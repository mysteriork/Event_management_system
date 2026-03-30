import { pool } from "../config/db.js";
import { ApiError } from "../utils/ApiError.js";

async function markAttendance(req, res, next) {
  try {
    const eventId = parseInt(req.params.id, 10);
    const { code } = req.body;

    if (isNaN(eventId)) {
      throw new ApiError(400, "Invalid event ID.");
    }

    if (!code || code.trim() === "") {
      throw new ApiError(400, "Booking code is required.");
    }

    const normalizedCode = code.trim().toUpperCase();

    const [bookings] = await pool.query(
      `SELECT b.*, u.name AS user_name, u.email AS user_email
       FROM bookings b
       JOIN users u ON b.user_id = u.id
       WHERE b.unique_code = ? AND b.event_id = ?`,
      [normalizedCode, eventId],
    );

    if (bookings.length === 0) {
      const [anyBooking] = await pool.query(
        "SELECT event_id FROM bookings WHERE unique_code = ?",
        [normalizedCode],
      );
      if (anyBooking.length > 0) {
        throw new ApiError(
          404,
          `This code belongs to event ID ${anyBooking[0].event_id}, not ${eventId}. Enter ${anyBooking[0].event_id} in the Event ID field.`,
        );
      }
      throw new ApiError(
        404,
        "Invalid booking code. Please check and try again.",
      );
    }

    const booking = bookings[0];

    const [existing] = await pool.query(
      "SELECT id FROM event_attendance WHERE booking_id = ?",
      [booking.id],
    );

    if (existing.length > 0) {
      return res.status(200).json({
        success: true,
        message: "Already checked in.",
        data: {
          already_checked_in: true,
          tickets_booked: booking.tickets_booked,
          user_name: booking.user_name,
          user_email: booking.user_email,
          booking_code: normalizedCode,
        },
      });
    }

    await pool.query(
      "INSERT INTO event_attendance (booking_id, user_id) VALUES (?, ?)",
      [booking.id, booking.user_id],
    );

    return res.status(201).json({
      success: true,
      message: "Check-in successful!",
      data: {
        already_checked_in: false,
        tickets_booked: booking.tickets_booked,
        user_name: booking.user_name,
        user_email: booking.user_email,
        booking_code: normalizedCode,
        entry_time: new Date(),
      },
    });
  } catch (error) {
    next(error);
  }
}

export { markAttendance };
