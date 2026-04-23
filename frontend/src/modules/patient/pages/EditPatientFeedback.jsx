import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFeedbackById, updateFeedback } from "../../shared/services/feedbackService";
import StarRating from "../../shared/components/StarRating";
import { toast } from "react-toastify";
import "../styles/PatientFeedback.css";

const EditPatientFeedback = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
  const [feedbackInfo, setFeedbackInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await getFeedbackById(id);
        const fb = res.data;

        if (!fb.isEditable) {
          if (fb.adminReply?.message) {
            toast.error("You cannot edit this feedback because admin has already replied.");
          } else {
            toast.error("Edit window has expired for this feedback");
          }
          navigate("/");
          return;
        }

        setFeedbackInfo(fb);
        setFormData({ rating: fb.rating, comment: fb.comment });
        setCategoryRatings({
          doctor: fb.categoryRatings?.doctor || 0,
          service: fb.categoryRatings?.service || 0,
          staff: fb.categoryRatings?.staff || 0,
          app: fb.categoryRatings?.app || 0,
        });
        setFeatureAnonymous(Boolean(fb.isAnonymousFeatured));
      } catch (error) {
        toast.error("Feedback not found");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.rating === 0) {
      toast.warn("Please select a rating");
      return;
    }

    try {
      setSubmitting(true);
      await updateFeedback(id, {
        ...formData,
        categoryRatings,
        isAnonymousFeatured: featureAnonymous,
      });
      toast.success("Feedback updated successfully! ✏️");
      navigate("/consultations");
    } catch (error) {
      const msg =
        error.response?.data?.message || "Failed to update feedback";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading feedback...</p>
      </div>
    );
  }

  return (
    <div className="feedback-form-page">
      <div className="page-header">
        <h2>Edit Feedback</h2>
        <p className="subtitle">
          Update your feedback for{" "}
          <strong>Dr. {feedbackInfo?.doctorName}</strong> (Consultation:{" "}
          {feedbackInfo?.consultationId})
        </p>
        <div className="edit-notice">
          ⚠️ You can only edit feedback within{" "}
          {import.meta.env.VITE_EDIT_WINDOW || 24} hours of submission.
        </div>
      </div>

      <form className="feedback-form" onSubmit={handleSubmit}>
        <div className="info-row">
          <div className="info-item">
            <span className="label">Patient:</span>{" "}
            {feedbackInfo?.patientName}
          </div>
          <div className="info-item">
            <span className="label">Doctor:</span> {feedbackInfo?.doctorName}
          </div>
        </div>

        <div className="form-group rating-group">
          <label>Rating</label>
          <StarRating
            rating={formData.rating}
            onRate={(val) => setFormData({ ...formData, rating: val })}
          />
        </div>

        <section className="category-grid">
          <article className="category-card">
            <p className="category-title">Consulted Doctor</p>
            <p className="category-subtitle">Rate doctor professionalism and care</p>
            <StarRating
              rating={categoryRatings.doctor}
              onRate={(val) => setCategoryRatings({ ...categoryRatings, doctor: val })}
              size="small"
            />
          </article>

          <article className="category-card">
            <p className="category-title">Service Provided</p>
            <p className="category-subtitle">Rate the quality of treatment</p>
            <StarRating
              rating={categoryRatings.service}
              onRate={(val) => setCategoryRatings({ ...categoryRatings, service: val })}
              size="small"
            />
          </article>

          <article className="category-card">
            <p className="category-title">Staff Responsiveness</p>
            <p className="category-subtitle">Rate helpfulness of staff</p>
            <StarRating
              rating={categoryRatings.staff}
              onRate={(val) => setCategoryRatings({ ...categoryRatings, staff: val })}
              size="small"
            />
          </article>

          <article className="category-card">
            <p className="category-title">App Usability</p>
            <p className="category-subtitle">Rate how easy app usage was</p>
            <StarRating
              rating={categoryRatings.app}
              onRate={(val) => setCategoryRatings({ ...categoryRatings, app: val })}
              size="small"
            />
          </article>
        </section>

        <div className="form-group">
          <label htmlFor="comment">Feedback Comment</label>
          <textarea
            id="comment"
            name="comment"
            rows="4"
            placeholder="Update your feedback..."
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

        <label className="feature-optin" htmlFor="feature-anon-edit">
          <input
            id="feature-anon-edit"
            type="checkbox"
            checked={featureAnonymous}
            onChange={(e) => setFeatureAnonymous(e.target.checked)}
          />
          <span>Allow my feedback to be featured on our website (Anonymous)</span>
        </label>

        <div className="form-buttons">
          <button
            type="submit"
            className="btn btn-submit"
            disabled={submitting}
          >
            {submitting ? "Updating..." : "✅ Update Feedback"}
          </button>
          <button
            type="button"
            className="btn btn-cancel"
            onClick={() => navigate("/")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPatientFeedback;
