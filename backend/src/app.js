import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

import eventsRoutes from "./routes/events.js";
import bookingsRoutes from "./routes/bookings.js";
import usersRoutes from "./routes/users.js";
import { pool } from "./config/db.js";
import { ApiError } from "./utils/ApiError.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerPath = path.join(__dirname, "./swagger.yml");

console.log("Swagger path:", swaggerPath);
console.log("File exists:", fs.existsSync(swaggerPath));

const swaggerDocument = YAML.load(swaggerPath);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/events", eventsRoutes);
app.use("/bookings", bookingsRoutes);
app.use("/users", usersRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req, res) => {
  res.json({ message: "Event Booking API is running!", docs: "/api-docs" });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found." });
});


app.use((err, req, res, next) => {
  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors: err.errors || [],
    data: null,
  });
});

async function startServer() {
  try {
    const connection = await pool.getConnection();
    console.log("Connected to MySQL database.");
    connection.release();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Swagger docs at http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
}

startServer();
