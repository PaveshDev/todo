import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
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
            <button className="admin-top-link active" type="button">Dashboard</button>
            <Link className="admin-top-link" to="/admin/consultations">Appointments</Link>
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
                <button className="admin-menu-item" type="button" onClick={() => toast.info("Profile page coming soon")}>Profile</button>
                <button className="admin-menu-item" type="button" onClick={() => toast.info("Settings page coming soon")}>Settings</button>
                <button className="admin-menu-item logout" type="button" onClick={handleLogout}>Logout</button>
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
            <button className="admin-side-item active" type="button">
              <span className="material-symbols-outlined">dashboard</span>
              <span>Dashboard</span>
            </button>
            <Link className="admin-side-item" to="/admin/consultations">
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
            <Link className="admin-side-item" to="/admin/feedback">
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
          <section className="admin-hero">
            <div className="admin-hero-copy">
              <span className="admin-kicker">ADMIN OVERVIEW</span>
              <h1>Hello, Admin.</h1>
              <p>
                Your front-desk and clinic operations snapshot is ready. Here is
                today&apos;s appointments, staff availability, payments, and priority actions.
              </p>
            </div>
            <div className="admin-glance-card">
              <p className="small">Today at a Glance</p>
              <h3>128 Patients</h3>
              <div className="split-stats">
                <div>
                  <p>Checked In</p>
                  <strong>46</strong>
                </div>
                <div>
                  <p>Pending Bills</p>
                  <strong>12</strong>
                </div>
              </div>
            </div>
          </section>

          <section className="admin-grid-top">
            <article className="card queue-card">
              <div className="card-head">
                <div>
                  <span className="card-kicker">TODAY&apos;S OPERATIONS</span>
                  <h3>Appointment Queue</h3>
                </div>
                <span className="material-symbols-outlined">calendar_month</span>
              </div>
              <div className="queue-content">
                <div>
                  <div className="big-number">28</div>
                  <p>appointments remaining</p>
                  <small>Next check-in at 10:30 AM - Dr. Julian Vance - Operatory 03</small>
                </div>
                <div className="walkin-chip">
                  <span className="material-symbols-outlined">person_add</span>
                  <div>
                    <p>Walk-ins</p>
                    <strong>05 waiting</strong>
                  </div>
                </div>
              </div>
            </article>

            <article className="card revenue-card">
              <span className="card-kicker">REVENUE STATUS</span>
              <h3>LKR 148,500 Collected</h3>
              <div className="progress-wrap">
                <div className="progress-bar">
                  <span />
                </div>
                <div className="progress-label">
                  <span>78% of daily target</span>
                  <span className="material-symbols-outlined">trending_up</span>
                </div>
              </div>
            </article>

            <article className="card alert-card">
              <h4>Priority Alerts</h4>
              <div className="alerts">
                <div className="alert-row">
                  <span className="dot red" />
                  <div>
                    <p>2 invoices overdue</p>
                    <small>ACTION NEEDED</small>
                  </div>
                </div>
                <div className="alert-row">
                  <span className="dot green" />
                  <div>
                    <p>All doctors assigned</p>
                    <small>COMPLETED</small>
                  </div>
                </div>
                <div className="alert-row">
                  <span className="dot amber" />
                  <div>
                    <p>Low stock: gloves</p>
                    <small>REORDER SOON</small>
                  </div>
                </div>
              </div>
              <button className="link-btn" type="button">View All Alerts</button>
            </article>
          </section>

          <section className="quick-actions">
            <div className="section-title">
              <h3>Quick Actions</h3>
              <div />
            </div>
            <div className="action-grid">
              <button className="action-card" type="button">
                <span className="icon-wrap">
                  <span className="material-symbols-outlined">person_add</span>
                </span>
                <div>
                  <p>Register Patient</p>
                  <small>Add new walk-in or booked patient</small>
                </div>
              </button>
              <button className="action-card" type="button">
                <span className="icon-wrap secondary">
                  <span className="material-symbols-outlined">assignment_ind</span>
                </span>
                <div>
                  <p>Assign Doctor</p>
                  <small>Manage today&apos;s treatment slots</small>
                </div>
              </button>
              <button className="action-card" type="button">
                <span className="icon-wrap tertiary">
                  <span className="material-symbols-outlined">receipt_long</span>
                </span>
                <div>
                  <p>Process Billing</p>
                  <small>Complete payments and print invoice</small>
                </div>
              </button>
            </div>
          </section>

          <section className="insight-block">
            <div className="insight-copy">
              <span>OPERATIONS INSIGHT</span>
              <h2>Keep the clinic flow smooth today</h2>
              <p>
                Peak traffic is expected between 11:00 AM and 1:00 PM. Move one
                hygienist to chair support, confirm pending insurance entries early,
                and reorder essential consumables before the afternoon session begins.
              </p>
              <div className="insight-actions">
                <button type="button" className="primary-action">Open Full Report</button>
                <button type="button" className="secondary-action">View Staff Roster</button>
              </div>
            </div>
            <div className="insight-pulse">
              <div className="pulse-card">
                <span className="material-symbols-outlined">monitoring</span>
                <p>Admin Pulse</p>
                <h4>Efficient</h4>
              </div>
            </div>
          </section>
        </main>
      </div>

      <nav className="admin-mobile-nav">
        <button className="active" type="button">
          <span className="material-symbols-outlined">dashboard</span>
          <span>Dashboard</span>
        </button>
        <button type="button">
          <span className="material-symbols-outlined">event_note</span>
          <span>Queue</span>
        </button>
        <button type="button">
          <span className="material-symbols-outlined">groups</span>
          <span>Patients</span>
        </button>
        <button type="button">
          <span className="material-symbols-outlined">manage_accounts</span>
          <span>Staff</span>
        </button>
      </nav>
    </div>
  );
};

export default AdminDashboard;
