import { useState } from 'react';
import { createEvent } from '../services/api';

const EMPTY_FORM = {
  title: '',
  description: '',
  date: '',
  total_capacity: '',
};

function CreateEventPage() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [message, setMessage] = useState(null); 
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      await createEvent({
        title: form.title,
        description: form.description,
        date: form.date,
        total_capacity: Number(form.total_capacity),
      });

      setMessage({ type: 'success', text: '✅ Event created successfully!' });
      setForm(EMPTY_FORM); 
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Something went wrong. Please try again.';
      setMessage({ type: 'error', text: errMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h1 className="page-title">➕ Create New Event</h1>

      <div className="form-card">
        {message && (
          <div className={`alert alert-${message.type === 'success' ? 'success' : 'error'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Event Title *</label>
            <input
              name="title"
              placeholder="e.g. Tech Summit 2025"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              placeholder="What is this event about?"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Date & Time *</label>
            <input
              type="datetime-local"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Total Capacity *</label>
            <input
              type="number"
              name="total_capacity"
              placeholder="e.g. 200"
              min="1"
              value={form.total_capacity}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Creating...' : 'Create Event'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateEventPage;
