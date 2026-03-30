import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
});

// ---- Events ----
export const fetchEvents = () => API.get("/events");
export const createEvent = (data) => API.post("/events", data);

// ---- Bookings ----
export const createBooking = (data) => API.post("/bookings", data);
export const getUserBookings = (userId) => API.get(`/users/${userId}/bookings`);

// ---- Attendance ----
export const markAttendance = (eventId, code) =>
  API.post(`/events/${eventId}/attendance`, { code });
