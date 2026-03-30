import { useState, useEffect } from "react";
import { fetchEvents, createBooking } from "../services/api";

function BookTicketPage() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    user_id: "",
    event_id: "",
    tickets_booked: 1,
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEvents()
      .then((res) => setEvents(res.data.data))
      .catch(() => setError("Could not load events. Is the backend running?"));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);
    setError(null);
    setLoading(true);

    try {
      const res = await createBooking({
        user_id: Number(form.user_id),
        event_id: Number(form.event_id),
        tickets_booked: Number(form.tickets_booked),
      });
      setResult(res.data.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Booking failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h1 className="page-title">🎟 Book a Ticket</h1>

      <div className="form-card">
        {error && <div className="alert alert-error">{error}</div>}

        {result && (
          <div className="alert alert-success">
            <strong> Booking Confirmed!</strong>
            <p style={{ marginTop: 6 }}>Your unique booking code:</p>
            <div className="code-box">{result.unique_code}</div>
            <p>
              <strong>{result.tickets_booked}</strong> ticket(s) for{" "}
              <strong>{result.event_title}</strong>
            </p>
            <p style={{ fontSize: "0.82rem", marginTop: 6, color: "#555" }}>
              Save this code — you'll need it to check in at the event.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Your User ID *</label>
            <input
              type="number"
              name="user_id"
              placeholder="e.g. 1"
              value={form.user_id}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Select Event *</label>
            <select
              name="event_id"
              value={form.event_id}
              onChange={handleChange}
              required
            >
              <option value="">-- Choose an event --</option>
              {events.map((ev) => (
                <option
                  key={ev.id}
                  value={ev.id}
                  disabled={ev.remaining_tickets === 0}
                >
                  {ev.title} — {new Date(ev.date).toLocaleDateString()} (
                  {ev.remaining_tickets > 0
                    ? `${ev.remaining_tickets} left`
                    : "Sold Out"}
                  )
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Number of Tickets *</label>
            <input
              type="number"
              name="tickets_booked"
              min="1"
              value={form.tickets_booked}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
          >
            {loading ? "Booking..." : "Book Now"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default BookTicketPage;
