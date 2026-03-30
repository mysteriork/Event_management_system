import express from "express";
const router = express.Router();
import { getAllEvents, createEvent } from "../controllers/eventsController.js";
import { markAttendance } from "../controllers/attendanceController.js";

router.get("/", getAllEvents);
router.post("/", createEvent);
router.post("/:id/attendance", markAttendance);

export default router
