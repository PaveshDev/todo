import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getAllConsultations,
  createConsultation,
} from "../services/consultationService";
import { toast } from "react-toastify";
import "../styles/Consultations.css";

const Consultations = () => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [formData, setFormData] = useState({
    consultationId: "",
    patientName: "",
    doctorName: "",
    consultationDate: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchConsultations = async (status = "") => {
    try {
      setLoading(true);
      const filters = {};
      if (status) filters.status = status;
      const res = await getAllConsultations(filters);
      setConsultations(res.data);
    } catch {
      toast.error("Failed to load consultations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, []);

  const handleFilterChange = (status) => {
    setStatusFilter(status);
    fetchConsultations(status);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await createConsultation(formData);
      toast.success("Consultation booked successfully");
      setFormData({
        consultationId: "",
        patientName: "",
        doctorName: "",
        consultationDate: "",
        notes: "",
      });
      setShowForm(false);
      fetchConsultations(statusFilter);
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to book consultation";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };



  const getStatusClass = (status) => {
    const statusClass = {
      booked: "status-booked",
      "in-progress": "status-in-progress",
      completed: "status-completed",
      cancelled: "status-cancelled",
    };
    return statusClass[status] || "";
  };



  return (
    <div className="book-shell">
      <nav className="book-global-nav">
        <div className="book-global-left">
          <span className="book-brand">Dent AI</span>
          <div className="book-global-links">
            <Link className="book-global-link" to="/">Dashboard</Link>
            <Link className="book-global-link active" to="/consultations">Book Appointment</Link>
            <button className="book-global-link" type="button">AI Analysis</button>
            <button className="book-global-link" type="button">History Vault</button>
            <button className="book-global-link" type="button">E-Payment</button>
          </div>
        </div>
        <div className="book-global-right">
          <button className="book-icon-btn" type="button" aria-label="Notifications">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="book-icon-btn" type="button" aria-label="Messages">
            <span className="material-symbols-outlined">chat_bubble</span>
          </button>
          <div className="book-avatar-wrap">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80"
              alt="Patient avatar"
            />
          </div>
        </div>
      </nav>

      <div className="book-layout">
        <aside className="book-sidebar">
          <div className="book-sidebar-heading">
            <p>CLINICAL PRECISION</p>
            <h2>Dent AI Portal</h2>
          </div>

          <nav className="book-sidebar-nav">
            <Link className="book-nav-item" to="/">
              <span className="material-symbols-outlined">dashboard</span>
              <span>Dashboard</span>
            </Link>
            <Link className="book-nav-item active" to="/consultations">
              <span className="material-symbols-outlined">calendar_add_on</span>
              <span>Book Appointment</span>
            </Link>
            <button className="book-nav-item" type="button">
              <span className="material-symbols-outlined">psychology</span>
              <span>AI Analysis</span>
            </button>
            <button className="book-nav-item" type="button">
              <span className="material-symbols-outlined">menu_book</span>
              <span>Medical Resource</span>
            </button>
            <button className="book-nav-item" type="button">
              <span className="material-symbols-outlined">inventory_2</span>
              <span>History Vault</span>
            </button>
            <button className="book-nav-item" type="button">
              <span className="material-symbols-outlined">pill</span>
              <span>Medication Ordering</span>
            </button>
            <button className="book-nav-item" type="button">
              <span className="material-symbols-outlined">payments</span>
              <span>E-Payment</span>
            </button>
            <Link className="book-nav-item" to="/patient/feedback">
              <span className="material-symbols-outlined">rate_review</span>
              <span>My Feedback</span>
            </Link>
            <div className="book-sidebar-divider" />
            <button className="book-nav-item" type="button">
              <span className="material-symbols-outlined">person</span>
              <span>Profile</span>
            </button>
            <button className="book-nav-item" type="button">
              <span className="material-symbols-outlined">settings</span>
              <span>Settings</span>
            </button>
          </nav>

          <div className="book-sidebar-actions">
            <button type="button" className="book-emergency-btn">
              <span className="material-symbols-outlined">emergency</span>
              Emergency Contact
            </button>
            <button type="button" className="book-now-btn">
              <span className="material-symbols-outlined">add</span>
              Book Now
            </button>
          </div>
        </aside>

        <main className="book-main">
          <section className="book-content">
            <header className="book-header">
              <span className="book-kicker">APPOINTMENT CENTER</span>
              <h1>Book Appointment</h1>
              <p>
                Manage patient consultations with the same Dent AI dashboard experience.
              </p>
            </header>

            <div className="book-toolbar">
              <div className="book-filters">
                <button
                  className={`book-filter ${statusFilter === "" ? "active" : ""}`}
                  onClick={() => handleFilterChange("")}
                >
                  All
                </button>
                <button
                  className={`book-filter ${statusFilter === "booked" ? "active" : ""}`}
                  onClick={() => handleFilterChange("booked")}
                >
                  Booked
                </button>
                <button
                  className={`book-filter ${statusFilter === "in-progress" ? "active" : ""}`}
                  onClick={() => handleFilterChange("in-progress")}
                >
                  In Progress
                </button>
                <button
                  className={`book-filter ${statusFilter === "completed" ? "active" : ""}`}
                  onClick={() => handleFilterChange("completed")}
                >
                  Completed
                </button>
                <button
                  className={`book-filter ${statusFilter === "cancelled" ? "active" : ""}`}
                  onClick={() => handleFilterChange("cancelled")}
                >
                  Cancelled
                </button>
              </div>

              <button className="book-toggle-btn" onClick={() => setShowForm(!showForm)}>
                <span className="material-symbols-outlined">calendar_add_on</span>
                {showForm ? "Close Form" : "Book Consultation"}
              </button>
            </div>

            {showForm && (
              <form className="book-form" onSubmit={handleCreateSubmit}>
                <h3>New Consultation</h3>
                <div className="book-form-row">
                  <div className="book-field">
                    <label htmlFor="consultationId">Consultation ID</label>
                    <input
                      type="text"
                      id="consultationId"
                      name="consultationId"
                      placeholder="CONS-2026-0003"
                      value={formData.consultationId}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="book-field">
                    <label htmlFor="consultationDate">Consultation Date</label>
                    <input
                      type="datetime-local"
                      id="consultationDate"
                      name="consultationDate"
                      value={formData.consultationDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="book-form-row">
                  <div className="book-field">
                    <label htmlFor="patientName">Patient Name</label>
                    <input
                      type="text"
                      id="patientName"
                      name="patientName"
                      placeholder="Patient name"
                      value={formData.patientName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="book-field">
                    <label htmlFor="doctorName">Doctor Name</label>
                    <input
                      type="text"
                      id="doctorName"
                      name="doctorName"
                      placeholder="Doctor name"
                      value={formData.doctorName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="book-field">
                  <label htmlFor="notes">Notes</label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows="3"
                    placeholder="Any notes for this consultation"
                    value={formData.notes}
                    onChange={handleChange}
                    maxLength={500}
                  />
                </div>

                <button type="submit" className="book-submit" disabled={submitting}>
                  {submitting ? "Booking..." : "Create Consultation"}
                </button>
              </form>
            )}

            {loading ? (
              <div className="book-empty">
                <div className="book-spinner" />
                <p>Loading consultations...</p>
              </div>
            ) : consultations.length === 0 ? (
              <div className="book-empty">
                <span className="material-symbols-outlined">calendar_month</span>
                <h3>No consultations found</h3>
                <p>
                  {statusFilter
                    ? `No ${statusFilter} consultations available.`
                    : "No consultations have been booked yet."}
                </p>
              </div>
            ) : (
              <>
                <p className="book-count">{consultations.length} consultation(s) found</p>
                <div className="book-grid">
                  {consultations.map((c) => (
                    <article className="book-card" key={c._id}>
                      <div className="book-card-head">
                        <span className="book-id">{c.consultationId}</span>
                        <span className={`book-status ${getStatusClass(c.status)}`}>{c.status}</span>
                      </div>

                      <div className="book-card-body">
                        <p><strong>Patient:</strong> {c.patientName}</p>
                        <p><strong>Doctor:</strong> {c.doctorName}</p>
                        <p><strong>Date:</strong> {new Date(c.consultationDate).toLocaleString()}</p>
                        {c.notes && <p><strong>Notes:</strong> {c.notes}</p>}
                        {c.feedbackSubmitted && <div className="book-feedback-done">Feedback submitted</div>}
                      </div>

                      <div className="book-card-actions">
                        <p className="book-card-info">Contact admin to start or complete this appointment.</p>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            )}
          </section>
        </main>
      </div>

      <nav className="book-mobile-nav">
        <button type="button" className="book-mobile-item">
          <span className="material-symbols-outlined">dashboard</span>
          <span>Dashboard</span>
        </button>
        <button type="button" className="book-mobile-item active">
          <span className="material-symbols-outlined">calendar_add_on</span>
          <span>Book</span>
        </button>
        <button type="button" className="book-mobile-item">
          <span className="material-symbols-outlined">biotech</span>
          <span>AI Scan</span>
        </button>
        <button type="button" className="book-mobile-item">
          <span className="material-symbols-outlined">account_circle</span>
          <span>Profile</span>
        </button>
      </nav>
    </div>
  );
};

export default Consultations;
