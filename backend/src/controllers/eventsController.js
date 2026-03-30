import {pool} from "../config/db.js";
import { ApiError } from "../utils/ApiError.js";

async function getAllEvents(req, res, next) {
  try {
    const [events] = await pool.query("SELECT * FROM events ORDER BY date ASC");

    res.json({
      success: true,
      data: events,
    });
  } catch (error) {
    next(error);
  }
}

async function createEvent(req, res, next) {
  try {
    const { title, description, date, total_capacity } = req.body;

    if (!title || !date || !total_capacity) {
      throw new ApiError(400, "title, date, and total_capacity are required.");
    }

    if (typeof total_capacity !== "number" || total_capacity <= 0) {
      throw new ApiError(400, "total_capacity must be a positive number.");
    }

    const eventDate = new Date(date);
    if (isNaN(eventDate.getTime()) || eventDate <= new Date()) {
      throw new ApiError(400, "date must be a valid future date.");
    }

    const [result] = await pool.query(
      "INSERT INTO events (title, description, date, total_capacity, remaining_tickets) VALUES (?, ?, ?, ?, ?)",
      [title, description || null, date, total_capacity, total_capacity],
    );

    const [newEvent] = await pool.query("SELECT * FROM events WHERE id = ?", [
      result.insertId,
    ]);

    res.status(201).json({
      success: true,
      message: "Event created successfully.",
      data: newEvent[0],
    });
  } catch (error) {
    next(error);
  }
}

export { getAllEvents, createEvent };
