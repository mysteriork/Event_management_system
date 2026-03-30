import { useState } from "react";
import { markAttendance } from "../services/api";

function AttendancePage() {
  const [form, setForm] = useState({ event_id: "", code: "" });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const value =
      e.target.name === "code" ? e.target.value.toUpperCase() : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);
    setError(null);
    setLoading(true);

    try {
      const res = await markAttendance(form.event_id, form.code);
      setResult(res.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Check-in failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h1 className="page-title">Event Check-In</h1>
      <p style={{ marginBottom: 24, color: "#666" }}>
        Enter the Event ID and the unique booking code you received when you
        booked your ticket.
      </p>

      <div className="form-card">
        {error && <div className="alert alert-error">❌ {error}</div>}

        {result && (
          <div
            className={`alert ${result.data.already_checked_in ? "alert-info" : "alert-success"}`}
          >
            <strong>{result.message}</strong>
            <div style={{ marginTop: 10 }}>
              <p>
                👤 <strong>{result.data.user_name}</strong> (
                {result.data.user_email})
              </p>
              <p>
                🎟 Tickets Booked: <strong>{result.data.tickets_booked}</strong>
              </p>
              {!result.data.already_checked_in && (
                <p>
                  🕐 Entry Time:{" "}
                  {new Date(result.data.entry_time).toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Event ID *</label>
            <input
              type="number"
              name="event_id"
              placeholder="e.g. 1"
              value={form.event_id}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Booking Code *</label>
            <input
              name="code"
              placeholder="e.g. EVT-A3F9K2"
              value={form.code}
              onChange={handleChange}
              maxLength={10}
              style={{ letterSpacing: "2px", fontWeight: 600 }}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-dark btn-full"
            disabled={loading}
          >
            {loading ? "Checking in..." : "🚪 Check In"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AttendancePage;
