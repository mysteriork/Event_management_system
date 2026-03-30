import { useState } from 'react';
import { getUserBookings } from '../services/api';

function MyBookingsPage() {
  const [userId, setUserId]     = useState('');
  const [bookings, setBookings] = useState([]);
  const [searched, setSearched] = useState(false);
  const [error, setError]       = useState(null);
  const [loading, setLoading]   = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError(null);
    setSearched(false);
    setLoading(true);

    try {
      const res = await getUserBookings(userId);
      setBookings(res.data.data);
      setSearched(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not fetch bookings.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h1 className="page-title">📋 My Bookings</h1>

      <div className="form-card" style={{ marginBottom: 28 }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
          <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
            <label>Enter Your User ID</label>
            <input
              type="number"
              placeholder="e.g. 1"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {searched && bookings.length === 0 && (
        <div className="empty-state">
          <p>No bookings found for User ID <strong>{userId}</strong>.</p>
        </div>
      )}

      {bookings.length > 0 && (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Booking Code</th>
                <th>Event</th>
                <th>Event Date</th>
                <th>Tickets</th>
                <th>Booked On</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.booking_id}>
                  <td>
                    <span className="badge badge-blue">{b.unique_code}</span>
                  </td>
                  <td>{b.event_title}</td>
                  <td>{new Date(b.event_date).toLocaleDateString()}</td>
                  <td>{b.tickets_booked}</td>
                  <td>{new Date(b.booking_date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default MyBookingsPage;
