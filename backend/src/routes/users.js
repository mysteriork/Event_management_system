import express from "express";
const router = express.Router();
import { getUserBookings } from "../controllers/bookingsController.js";

router.get("/:id/bookings", getUserBookings);

export default router
