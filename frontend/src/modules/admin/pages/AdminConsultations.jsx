import { useState, useEffect } from "react";
import {
  getAllConsultations,
  updateConsultation,
} from "../../../services/consultationService";
import AdminLayout from "../components/AdminLayout";
import { toast } from "react-toastify";
import "../styles/AdminConsultations.css";

const AdminConsultations = () => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

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

  const handleStartAppointment = async (id) => {
    try {
      await updateConsultation(id, { status: "in-progress" });
      toast.success("Appointment started successfully");
      fetchConsultations(statusFilter);
    } catch {
      toast.error("Failed to start appointment");
    }
  };

  const handleCompleteAppointment = async (id) => {
    try {
      await updateConsultation(id, { status: "completed" });
      toast.success("Appointment marked as completed");
      fetchConsultations(statusFilter);
    } catch {
      toast.error("Failed to complete appointment");
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
    <AdminLayout activeTop="appointments" activeSide="consultations">
      <div className="admin-consultation-container">
      <header className="admin-consultation-header">
        <h1>Consultation Management</h1>
        <p>Manage and update appointment statuses</p>
      </header>

      <div className="admin-consultation-toolbar">
        <div className="admin-consultation-filters">
          <button
            className={`admin-filter ${statusFilter === "" ? "active" : ""}`}
            onClick={() => handleFilterChange("")}
          >
            All
          </button>
          <button
            className={`admin-filter ${statusFilter === "booked" ? "active" : ""}`}
            onClick={() => handleFilterChange("booked")}
          >
            Booked
          </button>
          <button
            className={`admin-filter ${statusFilter === "in-progress" ? "active" : ""}`}
            onClick={() => handleFilterChange("in-progress")}
          >
            In Progress
          </button>
          <button
            className={`admin-filter ${statusFilter === "completed" ? "active" : ""}`}
            onClick={() => handleFilterChange("completed")}
          >
            Completed
          </button>
          <button
            className={`admin-filter ${statusFilter === "cancelled" ? "active" : ""}`}
            onClick={() => handleFilterChange("cancelled")}
          >
            Cancelled
          </button>
        </div>
      </div>

      {loading ? (
        <div className="admin-consultation-empty">
          <div className="admin-spinner" />
          <p>Loading consultations...</p>
        </div>
      ) : consultations.length === 0 ? (
        <div className="admin-consultation-empty">
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
          <p className="admin-consultation-count">
            {consultations.length} consultation(s) found
          </p>
          <div className="admin-consultation-grid">
            {consultations.map((c) => (
              <article className="admin-consultation-card" key={c._id}>
                <div className="admin-consultation-card-head">
                  <span className="admin-consult-id">{c.consultationId}</span>
                  <span className={`admin-consult-status ${getStatusClass(c.status)}`}>
                    {c.status}
                  </span>
                </div>

                <div className="admin-consultation-card-body">
                  <p>
                    <strong>Patient:</strong> {c.patientName}
                  </p>
                  <p>
                    <strong>Doctor:</strong> {c.doctorName}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(c.consultationDate).toLocaleString()}
                  </p>
                  {c.notes && (
                    <p>
                      <strong>Notes:</strong> {c.notes}
                    </p>
                  )}
                  {c.feedbackSubmitted && (
                    <div className="admin-consult-feedback-done">
                      Feedback submitted
                    </div>
                  )}
                </div>

                <div className="admin-consultation-card-actions">
                  {c.status === "booked" && (
                    <button
                      className="admin-action-start"
                      onClick={() => handleStartAppointment(c._id)}
                    >
                      <span className="material-symbols-outlined">play_arrow</span>
                      Start
                    </button>
                  )}
                  {c.status === "in-progress" && (
                    <button
                      className="admin-action-complete"
                      onClick={() => handleCompleteAppointment(c._id)}
                    >
                      <span className="material-symbols-outlined">check_circle</span>
                      Complete
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </>
      )}
      </div>
    </AdminLayout>
  );
};

export default AdminConsultations;
