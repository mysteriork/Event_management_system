-- ============================================
-- Event Booking System - Database Schema
-- ============================================

CREATE DATABASE IF NOT EXISTS event_booking;
USE event_booking;

-- Users Table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Events Table
CREATE TABLE events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  date DATETIME NOT NULL,
  total_capacity INT NOT NULL CHECK (total_capacity > 0),
  remaining_tickets INT NOT NULL CHECK (remaining_tickets >= 0),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings Table
CREATE TABLE bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  event_id INT NOT NULL,
  booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  unique_code VARCHAR(20) NOT NULL UNIQUE,
  tickets_booked INT NOT NULL DEFAULT 1 CHECK (tickets_booked > 0),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- Event Attendance Table
CREATE TABLE event_attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id INT NOT NULL,
  user_id INT NOT NULL,
  entry_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================
-- Sample Data
-- ============================================

INSERT INTO users (name, email) VALUES
  ('Alice Johnson', 'alice@example.com'),
  ('Bob Smith', 'bob@example.com'),
  ('Charlie Brown', 'charlie@example.com');

INSERT INTO events (title, description, date, total_capacity, remaining_tickets) VALUES
  ('Tech Summit 2025', 'Annual technology conference covering AI, cloud, and dev tools.', '2025-08-15 09:00:00', 200, 200),
  ('Music Fest Indore', 'Live performances by top artists across genres.', '2025-09-20 17:00:00', 500, 500),
  ('Startup Pitch Night', 'Entrepreneurs pitch their ideas to a panel of investors.', '2025-07-10 18:30:00', 100, 100),
  ('Photography Workshop', 'Hands-on workshop for beginners and enthusiasts.', '2025-07-25 10:00:00', 30, 30);
