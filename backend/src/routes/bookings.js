import express from "express";
const router = express.Router();
import { createBooking } from "../controllers/bookingsController.js";

router.post("/", createBooking);

export default router
