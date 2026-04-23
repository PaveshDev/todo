import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { createFeedback, getAllFeedback } from "../../shared/services/feedbackService";
import { verifyConsultation } from "../../shared/services/consultationService";
import StarRating from "../../shared/components/StarRating";
import { toast } from "react-toastify";
import "../styles/PatientFeedback.css";

const PatientFeedback = () => {
  const navigate = useNavigate();

  const [consultationId, setConsultationId] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [consultationInfo, setConsultationInfo] = useState(null);

  const [formData, setFormData] = useState({
    rating: 0,
    comment: "",
  });
  const [categoryRatings, setCategoryRatings] = useState({
    doctor: 0,
    service: 0,
    staff: 0,
    app: 0,
  });
  const [featureAnonymous, setFeatureAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [view, setView] = useState("submit"); // "submit" or "history"
  const [pastFeedback, setPastFeedback] = useState([]);
  const [loadingPastFeedback, setLoadingPastFeedback] = useState(false);
  const [actualPatientName, setActualPatientName] = useState(
    localStorage.getItem("actualPatientName") || localStorage.getItem("userName") || ""
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch patient's past feedback on component mount
  useEffect(() => {
    const fetchPastFeedback = async () => {
      try {
        setLoadingPastFeedback(true);
        const storedPatientName = localStorage.getItem("actualPatientName") || localStorage.getItem("userName") || "";
        console.log("Fetching feedback for patient:", storedPatientName);
        if (storedPatientName) {
          const result = await getAllFeedback({ patient: storedPatientName });
          console.log("Feedback result:", result);
          const feedbackList = Array.isArray(result) ? result : (result.data || []);
          console.log("Setting feedback list:", feedbackList);
          setPastFeedback(feedbackList);
        }
      } catch (error) {
        console.error("Failed to fetch past feedback:", error);
      } finally {
        setLoadingPastFeedback(false);
      }
    };

    fetchPastFeedback();
  }, []);

  // Refetch feedback when switching to history view
  const handleHistoryView = async () => {
    setView("history");
    try {
      const patientName = actualPatientName || localStorage.getItem("actualPatientName") || localStorage.getItem("userName") || "";
      console.log("Refetching feedback for patient:", patientName);
      if (patientName) {
        setLoadingPastFeedback(true);
        const result = await getAllFeedback({ patient: patientName });
        console.log("Refetched feedback result:", result);
        const feedbackList = Array.isArray(result) ? result : (result.data || []);
        console.log("Setting refetched feedback list:", feedbackList);
        setPastFeedback(feedbackList);
      }
    } catch (error) {
      console.error("Failed to refetch past feedback:", error);
    } finally {
      setLoadingPastFeedback(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    localStorage.removeItem("actualPatientName");
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!consultationId.trim()) {
      toast.warn("Please enter a Consultation ID");
      return;
    }

    try {
      setVerifying(true);
      const res = await verifyConsultation(consultationId.trim());

      if (res.eligible) {
        setConsultationInfo(res.data);
        setActualPatientName(res.data.patientName);
        localStorage.setItem("actualPatientName", res.data.patientName);
        setVerified(true);
        toast.success("Consultation verified! You can now submit your feedback.");
      }
    } catch (error) {
      const msg =
        error.response?.data?.message || "Failed to verify consultation";
      toast.error(msg);
      setVerified(false);
      setConsultationInfo(null);
    } finally {
      setVerifying(false);
    }
  };

  const handleReset = () => {
    setConsultationId("");
    setVerified(false);
    setConsultationInfo(null);
    setFormData({ rating: 0, comment: "" });
    setCategoryRatings({ doctor: 0, service: 0, staff: 0, app: 0 });
    setFeatureAnonymous(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.rating === 0) {
      toast.warn("Please select a rating");
      return;
    }

    try {
      setSubmitting(true);
      await createFeedback({
        patientName: consultationInfo.patientName,
        doctorName: consultationInfo.doctorName,
        consultationId: consultationInfo.consultationId,
        rating: formData.rating,
        categoryRatings,
        isAnonymousFeatured: featureAnonymous,
        comment: formData.comment,
      });
      toast.success("Feedback submitted successfully!");
      handleReset();
      handleHistoryView();
    } catch (error) {
      const msg =
        error.response?.data?.message || "Failed to submit feedback";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="patient-dashboard-shell">
      <nav className="patient-global-nav">
        <div className="global-nav-left">
          <span className="global-brand">Dent AI</span>
          <div className="global-links">
            <Link className="global-link active" to="/">Dashboard</Link>
            <Link className="global-link" to="/consultations">Book Appointment</Link>
            <button className="global-link pseudo-link" type="button">AI Analysis</button>
            <button className="global-link pseudo-link" type="button">History Vault</button>
            <button className="global-link pseudo-link" type="button">E-Payment</button>
          </div>
        </div>
        <div className="global-nav-right">
          <button className="icon-btn" type="button" aria-label="Notifications">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="icon-btn" type="button" aria-label="Messages">
            <span className="material-symbols-outlined">chat_bubble</span>
          </button>
          <div className="profile-dropdown-wrapper" ref={dropdownRef}>
            <button
              className="avatar-wrap"
              type="button"
              aria-label="Profile menu"
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            >
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80"
                alt="Patient avatar"
              />
            </button>
            {profileDropdownOpen && (
              <div className="profile-dropdown-menu">
                <div className="dropdown-header">
                  <span className="dropdown-user-name">Patient Name</span>
                </div>
                <div className="dropdown-divider" />
                <button
                  className="dropdown-item"
                  type="button"
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    toast.info("Profile feature coming soon");
                  }}
                >
                  <span className="material-symbols-outlined">person</span>
                  <span>Profile</span>
                </button>
                <button
                  className="dropdown-item"
                  type="button"
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    toast.info("Settings feature coming soon");
                  }}
                >
                  <span className="material-symbols-outlined">settings</span>
                  <span>Settings</span>
                </button>
                <div className="dropdown-divider" />
                <button
                  className="dropdown-item logout-item"
                  type="button"
                  onClick={handleLogout}
                >
                  <span className="material-symbols-outlined">logout</span>
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="patient-dashboard-layout">
        <aside className="patient-sidebar">
          <div className="sidebar-heading">
            <p>CLINICAL PRECISION</p>
            <h2>Dent AI Portal</h2>
          </div>

          <nav className="patient-nav">
            <Link className="patient-nav-item" to="/">
              <span className="material-symbols-outlined">dashboard</span>
              <span>Dashboard</span>
            </Link>
            <Link className="patient-nav-item" to="/consultations">
              <span className="material-symbols-outlined">calendar_add_on</span>
              <span>Book Appointment</span>
            </Link>
            <button className="patient-nav-item" type="button">
              <span className="material-symbols-outlined">psychology</span>
              <span>AI Analysis</span>
            </button>
            <button className="patient-nav-item" type="button">
              <span className="material-symbols-outlined">menu_book</span>
              <span>Medical Resource</span>
            </button>
            <button className="patient-nav-item" type="button">
              <span className="material-symbols-outlined">inventory_2</span>
              <span>History Vault</span>
            </button>
            <button className="patient-nav-item" type="button">
              <span className="material-symbols-outlined">pill</span>
              <span>Medication Ordering</span>
            </button>
            <button className="patient-nav-item" type="button">
              <span className="material-symbols-outlined">payments</span>
              <span>E-Payment</span>
            </button>
            <Link className="patient-nav-item active" to="/patient/feedback">
              <span className="material-symbols-outlined">rate_review</span>
              <span>My Feedback</span>
            </Link>
            <div className="sidebar-divider" />
            <button className="patient-nav-item" type="button">
              <span className="material-symbols-outlined">person</span>
              <span>Profile</span>
            </button>
            <button className="patient-nav-item" type="button">
              <span className="material-symbols-outlined">settings</span>
              <span>Settings</span>
            </button>
          </nav>

          <div className="patient-sidebar-actions">
            <button type="button" className="btn-emergency">
              <span className="material-symbols-outlined">emergency</span>
              Emergency Contact
            </button>
            <Link to="/consultations" className="btn-book-now">
              <span className="material-symbols-outlined">add</span>
              Book Now
            </Link>
          </div>
        </aside>

        <main className="patient-dashboard-main">
          <section className="patient-feedback-content">
            <div className="feedback-tabs">
              <button
                className={`feedback-tab ${view === "submit" ? "active" : ""}`}
                onClick={() => {
                  setView("submit");
                  handleReset();
                }}
              >
                <span className="material-symbols-outlined">edit</span>
                Submit Feedback
              </button>
              <button
                className={`feedback-tab ${view === "history" ? "active" : ""}`}
                onClick={handleHistoryView}
              >
                <span className="material-symbols-outlined">history</span>
                My Feedback ({pastFeedback.length})
              </button>
            </div>

            {view === "submit" ? (
              <>
                {!verified ? (
                  <div className="feedback-form-page">
                    <div className="page-header">
                      <h2>Submit Feedback</h2>
                      <p className="subtitle">
                        Share your experience after a completed consultation
                      </p>
                    </div>
                    <form className="feedback-form" onSubmit={handleVerify}>
                      <div className="verification-section">
                        <div className="step-indicator">
                          <span className="step-badge">Step 1</span>
                          <span className="step-text">Verify Your Consultation</span>
                        </div>
                        <p className="verification-info">
                          Enter your Consultation ID to verify your eligibility. Only patients
                          with completed consultations can submit feedback.
                        </p>
                        <div className="form-group">
                          <label htmlFor="consultationId">Consultation ID</label>
                          <input
                            type="text"
                            id="consultationId"
                            name="consultationId"
                            placeholder="e.g., CONS-2026-0001"
                            value={consultationId}
                            onChange={(e) => setConsultationId(e.target.value)}
                            required
                          />
                        </div>
                        <button
                          type="submit"
                          className="btn btn-verify"
                          disabled={verifying}
                        >
                          {verifying ? "Verifying..." : "Verify Consultation"}
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <form className="feedback-form patient-editorial-form" onSubmit={handleSubmit}>
                <div className="patient-editorial-header">
                  <div className="patient-editorial-copy">
                    <span className="patient-kicker">Patient Satisfaction</span>
                    <h3 className="patient-hero-title">Your Experience Matters</h3>
                    <div className="appointment-pill">
                      <div className="pill-icon">OK</div>
                      <div>
                        <p className="pill-title">Appointment #{consultationInfo.consultationId}</p>
                        <p className="pill-subtitle">
                          Completed on {new Date(consultationInfo.consultationDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="patient-editorial-media">
                    <div className="media-backdrop"></div>
                    <img
                      className="media-photo"
                      src="https://images.unsplash.com/photo-1588776814546-ec7e17f2f6dc?auto=format&fit=crop&w=800&q=80"
                      alt="Dental consultation"
                    />
                    <div className="verified-badge">Verified Patient</div>
                  </div>
                </div>

                <section className="patient-section-block">
                  <h4>How would you rate your overall experience?</h4>
                  <StarRating
                    rating={formData.rating}
                    onRate={(val) => setFormData({ ...formData, rating: val })}
                  />
                </section>

                <section className="category-grid">
                  <article className="category-card">
                    <p className="category-title">Consulted Doctor</p>
                    <p className="category-subtitle">
                      Rate Dr. {consultationInfo.doctorName}'s professionalism and care
                    </p>
                    <StarRating
                      rating={categoryRatings.doctor}
                      onRate={(val) => setCategoryRatings({ ...categoryRatings, doctor: val })}
                      size="small"
                    />
                  </article>

                  <article className="category-card">
                    <p className="category-title">Service Provided</p>
                    <p className="category-subtitle">Rate the quality of the dental treatment</p>
                    <StarRating
                      rating={categoryRatings.service}
                      onRate={(val) => setCategoryRatings({ ...categoryRatings, service: val })}
                      size="small"
                    />
                  </article>

                  <article className="category-card">
                    <p className="category-title">Staff Responsiveness</p>
                    <p className="category-subtitle">Rate the helpfulness and responses from the staff</p>
                    <StarRating
                      rating={categoryRatings.staff}
                      onRate={(val) => setCategoryRatings({ ...categoryRatings, staff: val })}
                      size="small"
                    />
                  </article>

                  <article className="category-card">
                    <p className="category-title">App Usability</p>
                    <p className="category-subtitle">Rate how easy it was to use the clinic app</p>
                    <StarRating
                      rating={categoryRatings.app}
                      onRate={(val) => setCategoryRatings({ ...categoryRatings, app: val })}
                      size="small"
                    />
                  </article>
                </section>

                <div className="form-group">
                  <label htmlFor="comment">Tell us more about your visit</label>
                  <textarea
                    id="comment"
                    name="comment"
                    rows="5"
                    placeholder="Your feedback helps us provide better care..."
                    value={formData.comment}
                    onChange={(e) =>
                      setFormData({ ...formData, comment: e.target.value })
                    }
                    maxLength={500}
                    required
                  />
                  <span className="char-count">
                    {formData.comment.length}/500 characters
                  </span>
                </div>

                <label className="feature-optin" htmlFor="feature-anon">
                  <input
                    id="feature-anon"
                    type="checkbox"
                    checked={featureAnonymous}
                    onChange={(e) => setFeatureAnonymous(e.target.checked)}
                  />
                  <span>Allow my feedback to be featured on our website (Anonymous)</span>
                </label>

                <div className="form-buttons">
                  <button
                    type="submit"
                    className="btn btn-submit btn-submit-feedback"
                    disabled={submitting}
                  >
                    {submitting ? "Submitting..." : "Submit Feedback"}
                    {!submitting && <span className="submit-arrow">?</span>}
                  </button>
                  <button
                    type="button"
                    className="btn btn-cancel"
                    onClick={handleReset}
                  >
                    Change Consultation
                  </button>
                </div>

                <div className="feedback-form-footer">
                  <p>DentAI Clinical Group 2026</p>
                  <div className="footer-icons">
                    <span className="footer-icon-item">
                      <span className="material-symbols-outlined">health_and_safety</span>
                      <span>Health</span>
                    </span>
                    <span className="footer-icon-item">
                      <span className="material-symbols-outlined">lock</span>
                      <span>Lock</span>
                    </span>
                    <span className="footer-icon-item">
                      <span className="material-symbols-outlined">shield</span>
                      <span>Shield</span>
                    </span>
                  </div>
                </div>
              </form>
                )}
              </>
            ) : (
              <div className="feedback-history">
                <div className="page-header">
                  <h2>My Feedback</h2>
                  <p className="subtitle">View your submitted feedback and responses from our team</p>
                </div>
                {loadingPastFeedback ? (
                  <div style={{ textAlign: "center", padding: "40px" }}>
                    <p>Loading your feedback...</p>
                  </div>
                ) : pastFeedback.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px" }}>
                    <p>No feedback submitted yet. Submit your first feedback above!</p>
                  </div>
                ) : (
                  <div className="feedback-history-list">
                    {pastFeedback.map((feedback) => (
                      <div key={feedback._id} className="feedback-history-card">
                        <div className="feedback-card-header">
                          <h4>Consultation #{feedback.consultationId}</h4>
                          <span className="feedback-date">{new Date(feedback.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="feedback-card-body">
                          <p><strong>Doctor:</strong> {feedback.doctorName}</p>
                          <p><strong>Rating:</strong> <span className="rating-stars">{'⭐'.repeat(feedback.rating)}</span></p>
                          {feedback.categoryRatings && (
                            <div className="history-category-ratings">
                              <div className="history-category-row">
                                <span>Consulted Doctor</span>
                                <StarRating rating={feedback.categoryRatings.doctor || 0} readonly size="small" />
                              </div>
                              <div className="history-category-row">
                                <span>Service Provided</span>
                                <StarRating rating={feedback.categoryRatings.service || 0} readonly size="small" />
                              </div>
                              <div className="history-category-row">
                                <span>Staff Responsiveness</span>
                                <StarRating rating={feedback.categoryRatings.staff || 0} readonly size="small" />
                              </div>
                              <div className="history-category-row">
                                <span>App Usability</span>
                                <StarRating rating={feedback.categoryRatings.app || 0} readonly size="small" />
                              </div>
                            </div>
                          )}
                          <p><strong>Your Comment:</strong></p>
                          <p className="feedback-comment">{feedback.comment}</p>
                          {feedback.isAnonymousFeatured && (
                            <p className="anonymous-badge">Featured anonymously</p>
                          )}
                        </div>
                        {feedback.adminReply && feedback.adminReply.message && (
                          <div className="feedback-admin-reply">
                            <p><strong>Response from Admin:</strong></p>
                            <p>{feedback.adminReply.message}</p>
                          </div>
                        )}

                        <div className="feedback-history-actions">
                          {feedback.isEditable && !(feedback.adminReply && feedback.adminReply.message) ? (
                            <button
                              type="button"
                              className="btn-edit-feedback"
                              onClick={() => navigate(`/edit/${feedback._id}`)}
                            >
                              <span className="material-symbols-outlined">edit</span>
                              Edit Feedback
                            </button>
                          ) : (
                            <span className="edit-locked-note">
                              {feedback.adminReply && feedback.adminReply.message
                                ? "Locked: admin replied to this feedback"
                                : "Locked: edit window expired"}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>
        </main>
      </div>

      <nav className="patient-mobile-nav">
        <button type="button" className="mobile-nav-item active">
          <span className="material-symbols-outlined">dashboard</span>
          <span>Dashboard</span>
        </button>
        <button type="button" className="mobile-nav-item">
          <span className="material-symbols-outlined">calendar_add_on</span>
          <span>Book</span>
        </button>
        <button type="button" className="mobile-nav-item">
          <span className="material-symbols-outlined">biotech</span>
          <span>AI Scan</span>
        </button>
        <button type="button" className="mobile-nav-item">
          <span className="material-symbols-outlined">account_circle</span>
          <span>Profile</span>
        </button>
      </nav>
    </div>
  );
};

export default PatientFeedback;
