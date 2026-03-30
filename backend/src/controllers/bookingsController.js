import {pool} from "../config/db.js";
import { ApiError } from "../utils/ApiError.js";
import { generateUniqueCode } from "../utils/codeGenerator.js";

async function createBooking(req, res, next) {
  const connection = await pool.getConnection();

  try {
    const { user_id, event_id, tickets_booked = 1 } = req.body;

    if (!user_id || !event_id) {
      throw new ApiError(402, "User_id or Event_id is required");
    }

    if (typeof tickets_booked !== "number" || tickets_booked < 1) {
      throw new ApiError(402, "tickets_booked must be a positive number.");
    }

    const [users] = await connection.query(
      "SELECT id FROM users WHERE id = ?",
      [user_id],
    );
    if (users.length === 0) {
      throw new ApiError(402, "User not found");
    }

    // This prevents race conditions (two people booking the last ticket at once)
    await connection.beginTransaction();

    const [events] = await connection.query(
      "SELECT * FROM events WHERE id = ? FOR UPDATE",
      [event_id],
    );

    if (events.length === 0) {
      await connection.rollback();
      throw new ApiError(401, "Event not found");
    }

    const event = events[0];

    if (event.remaining_tickets < tickets_booked) {
      await connection.rollback();
      throw new ApiError(
        402,
        `Only ${event.remaining_tickets} ticket(s) remaining.`,
      );
    }

    let unique_code;
    let codeIsUnique = false;
    while (!codeIsUnique) {
      unique_code = generateUniqueCode();
      const [existing] = await connection.query(
        "SELECT id FROM bookings WHERE unique_code = ?",
        [unique_code],
      );
      if (existing.length === 0) codeIsUnique = true;
    }

    const [bookingResult] = await connection.query(
      "INSERT INTO bookings (user_id, event_id, unique_code, tickets_booked) VALUES (?, ?, ?, ?)",
      [user_id, event_id, unique_code, tickets_booked],
    );

    await connection.query(
      "UPDATE events SET remaining_tickets = remaining_tickets - ? WHERE id = ?",
      [tickets_booked, event_id],
    );

    // ---- COMMIT TRANSACTION ----
    await connection.commit();

    res.status(201).json({
      success: true,
      message: "Booking successful!",
      data: {
        booking_id: bookingResult.insertId,
        unique_code,
        user_id,
        event_id,
        event_title: event.title,
        tickets_booked,
        booking_date: new Date(),
      },
    });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
}

async function getUserBookings(req, res, next) {
  try {
    const userId = req.params.id;

    const [users] = await pool.query("SELECT id FROM users WHERE id = ?", [
      userId,
    ]);
    if (users.length === 0) {
      throw new ApiError(401, "User not Found !");
    }

    const [bookings] = await pool.query(
      `SELECT 
        b.id AS booking_id,
        b.unique_code,
        b.tickets_booked,
        b.booking_date,
        e.id AS event_id,
        e.title AS event_title,
        e.description AS event_description,
        e.date AS event_date
      FROM bookings b
      JOIN events e ON b.event_id = e.id
      WHERE b.user_id = ?
      ORDER BY b.booking_date DESC`,
      [userId],
    );

    res.json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
}

export { createBooking, getUserBookings };
