import { useEffect, useState } from 'react';
import { fetchEvents } from '../services/api';

function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvents()
      .then((res) => setEvents(res.data.data))
      .catch(() => setError('Could not load events. Make sure the backend is running.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="loading-text">⏳ Loading events...</p>;
  if (error)   return <div className="page"><div className="alert alert-error">{error}</div></div>;

  return (
    <div className="page">
      <h1 className="page-title">🗓 Upcoming Events</h1>

      {events.length === 0 ? (
        <div className="empty-state">
          <p>No upcoming events found. Create one!</p>
        </div>
      ) : (
        <div className="card-grid">
          {events.map((event) => (
            <div className="card" key={event.id}>
              <h3>{event.title}</h3>
              <p>{event.description || 'No description provided.'}</p>
              <p>📅 {new Date(event.date).toLocaleString()}</p>
              <p>🪑 Total Capacity: {event.total_capacity}</p>
              <span
                className={`badge ${
                  event.remaining_tickets > 0 ? 'badge-green' : 'badge-red'
                }`}
              >
                {event.remaining_tickets > 0
                  ? `${event.remaining_tickets} tickets left`
                  : 'Sold Out'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EventsPage;
