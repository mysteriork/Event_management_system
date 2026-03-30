# 🎟 Event Booking System

A Mini Event Management System built with **Node.js (Express)**, **MySQL**, and **React**.

---

## 📁 Project Structure

```
event-booking/
├── backend/
│   ├── src/
│   │   ├── app.js                    ← Express server entry point
│   │   ├── config/
│   │   │   └── db.js                 ← MySQL connection pool
│   │   ├── controllers/
│   │   │   ├── eventsController.js   ← List & create events
│   │   │   ├── bookingsController.js ← Book tickets (transaction)
│   │   │   └── attendanceController.js ← Check-in logic
│   │   ├── routes/
│   │   │   ├── events.js
│   │   │   ├── bookings.js
│   │   │   └── users.js
│   │   ├── middleware/
│   │   │   └── errorHandler.js       ← Global error middleware
│   │   └── utils/
│   │       └── codeGenerator.js      ← Unique booking code generator
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js
│   │   ├── index.js
│   │   ├── index.css
│   │   ├── components/
│   │   │   └── Navbar.js
│   │   ├── pages/
│   │   │   ├── EventsPage.js         ← Browse upcoming events
│   │   │   ├── CreateEventPage.js    ← Create a new event
│   │   │   ├── BookTicketPage.js     ← Book tickets
│   │   │   ├── MyBookingsPage.js     ← View bookings by user ID
│   │   │   └── AttendancePage.js     ← Check in with code
│   │   └── services/
│   │       └── api.js                ← All Axios API calls
│   └── package.json
├── docs/
│   └── swagger.yaml                  ← OpenAPI documentation
├── schema.sql                        ← Database schema + sample data
├── EventBooking.postman_collection.json
└── README.md
```

---

## ⚙️ Prerequisites

- Node.js v18+
- MySQL 8.0+
- npm

---

## 🚀 Setup Instructions

### Step 1 — Set up the Database

Open MySQL and run the schema file:

```bash
mysql -u root -p < schema.sql
```

This will:
- Create the `event_booking` database
- Create all 4 tables: `users`, `events`, `bookings`, `event_attendance`
- Insert 3 sample users and 4 sample events

---

### Step 2 — Set up the Backend

```bash
cd backend

# Install dependencies
npm install

# Copy environment file and fill in your DB credentials
cp .env.example .env
```

Edit `.env`:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=event_booking
DB_PORT=3306
PORT=5000
```

Start the backend:
```bash
npm run dev     # Development mode with auto-reload
# or
npm start       # Production mode
```

---

### Step 3 — Set up the Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start the React app
npm start
```

> **Note:** The frontend uses `proxy: "http://localhost:5000"` in package.json,  
> so API calls from React automatically go to the backend.

---

## 📡 API Endpoints

| Method | Endpoint                  | Description                                  |
|--------|---------------------------|----------------------------------------------|
| GET    | `/events`                 | List all upcoming events                     |
| POST   | `/events`                 | Create a new event                           |
| POST   | `/bookings`               | Book tickets (with race condition protection)|
| GET    | `/users/:id/bookings`     | Get all bookings for a user                  |
| POST   | `/events/:id/attendance`  | Check in using a booking code                |

---

## 🔒 Race Condition Handling

When two users try to book the last ticket at the same time, the system uses a **MySQL transaction with row-level locking**:

```sql
-- Locks the event row so no other transaction can read/update it simultaneously
SELECT * FROM events WHERE id = ? FOR UPDATE;
```

This ensures only one booking succeeds and the other gets a proper "not enough tickets" error.

---

## 📬 Postman Collection

Import `EventBooking.postman_collection.json` into Postman. It includes all 5 endpoints with example request bodies and a `{{baseUrl}}` variable pointing to `http://localhost:5000`.

---

## 📖 API Documentation

OpenAPI spec is in `docs/swagger.yaml`.  
Interactive docs available at `http://localhost:5000/api-docs` when the server is running.

---

## 🧪 Sample Data (from schema.sql)

**Users:**
| ID | Name           | Email                |
|----|----------------|----------------------|
| 1  | Alice Johnson  | alice@example.com    |
| 2  | Bob Smith      | bob@example.com      |
| 3  | Charlie Brown  | charlie@example.com  |

**Events:** Tech Summit 2025, Music Fest Indore, Startup Pitch Night, Photography Workshop

---

## 🏗 Tech Stack

| Layer    | Technology                     |
|----------|-------------------------------|
| Backend  | Node.js, Express.js           |
| Database | MySQL 8 + mysql2/promise      |
| Frontend | React 18, React Router v6, Axios |
| Docs     | Swagger UI + OpenAPI 3.0 YAML |
