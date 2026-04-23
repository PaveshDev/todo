import { Link, useLocation } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="brand-icon">⚕️</span>
        <h1>Smart Clinic</h1>
        <span className="brand-sub">Feedback & Rating</span>
      </div>
      <div className="navbar-links">
        <Link
          to="/patient/feedback"
          className={`nav-link ${isActive("/patient/feedback") || isActive("/") ? "active" : ""}`}
        >
          🙍 Patient Feedback
        </Link>
        <Link
          to="/admin/feedback"
          className={`nav-link ${isActive("/admin/feedback") ? "active" : ""}`}
        >
          🧑‍💼 Admin/Reception
        </Link>
        <Link
          to="/doctor/feedback"
          className={`nav-link ${isActive("/doctor/feedback") ? "active" : ""}`}
        >
          🩺 Doctor View
        </Link>
        <Link
          to="/consultations"
          className={`nav-link ${isActive("/consultations") ? "active" : ""}`}
        >
          🩺 Consultations
        </Link>
        <Link
          to="/submit"
          className={`nav-link ${isActive("/submit") ? "active" : ""}`}
        >
          ➕ Quick Submit
        </Link>
        <Link
          to="/summary"
          className={`nav-link ${isActive("/summary") ? "active" : ""}`}
        >
          📊 Doctor Summary
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
