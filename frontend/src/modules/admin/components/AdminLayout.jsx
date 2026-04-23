import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/AdminDashboard.css";

const AdminLayout = ({ children, activeTop = "dashboard", activeSide = "dashboard" }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const onClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const userName = localStorage.getItem("userName") || "Admin";

  return (
    <div className="admin-shell">
      <nav className="admin-top-nav">
        <div className="admin-top-left">
          <span className="admin-brand">Dent AI</span>
          <div className="admin-top-links">
            <Link className={`admin-top-link ${activeTop === "dashboard" ? "active" : ""}`} to="/admin/dashboard">Dashboard</Link>
            <Link className={`admin-top-link ${activeTop === "appointments" ? "active" : ""}`} to="/admin/consultations">Appointments</Link>
            <button className="admin-top-link" type="button">Patients</button>
            <button className="admin-top-link" type="button">Staff</button>
            <button className="admin-top-link" type="button">Billing</button>
            <button className="admin-top-link" type="button">Reports</button>
          </div>
        </div>

        <div className="admin-top-right">
          <button className="admin-icon-btn" type="button" aria-label="Notifications">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="admin-icon-btn" type="button" aria-label="Messages">
            <span className="material-symbols-outlined">forum</span>
          </button>

          <div className="admin-profile-wrap" ref={menuRef}>
            <button
              className="admin-avatar"
              type="button"
              aria-label="Profile menu"
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              <img
                alt="Admin profile avatar"
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80"
              />
            </button>

            {menuOpen && (
              <div className="admin-profile-menu">
                <div className="admin-menu-head">{userName}</div>
                <div className="admin-menu-divider" />
                <button className="admin-menu-item" type="button" onClick={() => toast.info("Profile page coming soon")}>
                  <span className="material-symbols-outlined">person</span>
                  <span>Profile</span>
                </button>
                <button className="admin-menu-item" type="button" onClick={() => toast.info("Settings page coming soon")}>
                  <span className="material-symbols-outlined">settings</span>
                  <span>Settings</span>
                </button>
                <div className="admin-menu-divider" />
                <button className="admin-menu-item logout" type="button" onClick={handleLogout}>
                  <span className="material-symbols-outlined">logout</span>
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="admin-layout">
        <aside className="admin-sidebar">
          <div className="admin-sidebar-title">
            <p>CLINIC CONTROL CENTER</p>
            <h2>Dent AI Admin</h2>
          </div>

          <nav className="admin-side-nav">
            <Link className={`admin-side-item ${activeSide === "dashboard" ? "active" : ""}`} to="/admin/dashboard">
              <span className="material-symbols-outlined">dashboard</span>
              <span>Dashboard</span>
            </Link>
            <Link className={`admin-side-item ${activeSide === "consultations" ? "active" : ""}`} to="/admin/consultations">
              <span className="material-symbols-outlined">event_note</span>
              <span>Appointment Queue</span>
            </Link>
            <button className="admin-side-item" type="button">
              <span className="material-symbols-outlined">groups</span>
              <span>Patient Records</span>
            </button>
            <button className="admin-side-item" type="button">
              <span className="material-symbols-outlined">badge</span>
              <span>Doctor Schedules</span>
            </button>
            <button className="admin-side-item" type="button">
              <span className="material-symbols-outlined">payments</span>
              <span>Billing and Payments</span>
            </button>
            <button className="admin-side-item" type="button">
              <span className="material-symbols-outlined">inventory_2</span>
              <span>Inventory</span>
            </button>
            <button className="admin-side-item" type="button">
              <span className="material-symbols-outlined">lab_profile</span>
              <span>Reports and Analytics</span>
            </button>
            <Link className={`admin-side-item ${activeSide === "feedback" ? "active" : ""}`} to="/admin/feedback">
              <span className="material-symbols-outlined">rate_review</span>
              <span>Feedback Review</span>
            </Link>
            <div className="admin-divider" />
            <button className="admin-side-item" type="button">
              <span className="material-symbols-outlined">manage_accounts</span>
              <span>Staff Management</span>
            </button>
            <button className="admin-side-item" type="button">
              <span className="material-symbols-outlined">settings</span>
              <span>Settings</span>
            </button>
          </nav>

          <div className="admin-side-actions">
            <button className="urgent-btn" type="button">
              <span className="material-symbols-outlined">warning</span>
              <span>Urgent Cases</span>
            </button>
            <button className="walkin-btn" type="button">
              <span className="material-symbols-outlined">add</span>
              <span>Register Walk-in</span>
            </button>
          </div>
        </aside>

        <main className="admin-main">
          {children}
        </main>
      </div>

      <nav className="admin-mobile-nav">
        <button className={activeSide === "dashboard" ? "active" : ""} type="button" onClick={() => navigate("/admin/dashboard")}>
          <span className="material-symbols-outlined">dashboard</span>
          <span>Dashboard</span>
        </button>
        <button className={activeSide === "consultations" ? "active" : ""} type="button" onClick={() => navigate("/admin/consultations")}>
          <span className="material-symbols-outlined">event_note</span>
          <span>Queue</span>
        </button>
        <button className={activeSide === "feedback" ? "active" : ""} type="button" onClick={() => navigate("/admin/feedback")}>
          <span className="material-symbols-outlined">rate_review</span>
          <span>Feedback</span>
        </button>
        <button type="button">
          <span className="material-symbols-outlined">manage_accounts</span>
          <span>Staff</span>
        </button>
      </nav>
    </div>
  );
};

export default AdminLayout;
