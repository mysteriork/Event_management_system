import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-brand">
        🎟 EventBook
      </NavLink>
      <ul className="navbar-links">
        <li>
          <NavLink to="/" end className={({ isActive }) => isActive ? "active" : ""}>
            Events
          </NavLink>
        </li>
        <li>
          <NavLink to="/create-event" className={({ isActive }) => isActive ? "active" : ""}>
            Create Event
          </NavLink>
        </li>
        <li>
          <NavLink to="/book" className={({ isActive }) => isActive ? "active" : ""}>
            Book Ticket
          </NavLink>
        </li>
        <li>
          <NavLink to="/my-bookings" className={({ isActive }) => isActive ? "active" : ""}>
            My Bookings
          </NavLink>
        </li>
        <li>
          <NavLink to="/attendance" className={({ isActive }) => isActive ? "active" : ""}>
            Check In
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
