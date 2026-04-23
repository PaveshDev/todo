import { useEffect, useState } from "react";
import StarRating from "./StarRating";
import { replyToFeedback } from "../services/feedbackService";
import { toast } from "react-toastify";
import "../styles/FeedbackCard.css";

const FeedbackCard = ({
  feedback,
  canReply = false,
}) => {
  const [currentFeedback, setCurrentFeedback] = useState(feedback);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyMessage, setReplyMessage] = useState(feedback.adminReply?.message || "");
  const [repliedBy, setRepliedBy] = useState(feedback.adminReply?.repliedBy || "Reception");
  const [replySaving, setReplySaving] = useState(false);

  useEffect(() => {
    setCurrentFeedback(feedback);
    setReplyMessage(feedback.adminReply?.message || "");
    setRepliedBy(feedback.adminReply?.repliedBy || "Reception");
  }, [feedback]);

  const handleReplySubmit = async (e) => {
    e.preventDefault();

    if (!replyMessage.trim()) {
      toast.warn("Please enter a reply message");
      return;
    }

    try {
      setReplySaving(true);
      const res = await replyToFeedback(currentFeedback._id, {
        message: replyMessage,
        repliedBy,
      });
      setCurrentFeedback(res.data);
      setReplyMessage(res.data.adminReply?.message || "");
      setRepliedBy(res.data.adminReply?.repliedBy || "Reception");
      setShowReplyForm(false);
      toast.success("Reply saved successfully!");
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to save reply";
      toast.error(msg);
    } finally {
      setReplySaving(false);
    }
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="feedback-card">
      <div className="feedback-card-header">
        <div className="feedback-avatar">
          {feedback.patientName.charAt(0).toUpperCase()}
        </div>
        <div className="feedback-meta">
          <h4 className="patient-name">{currentFeedback.patientName}</h4>
          <p className="doctor-name">
            <span className="label">Doctor:</span> {currentFeedback.doctorName}
          </p>
          <p className="consultation-id">
            <span className="label">Consultation:</span>{" "}
            {currentFeedback.consultationId}
          </p>
        </div>
        <div className="feedback-time">
          <span className="time-ago">{timeAgo(currentFeedback.createdAt)}</span>
          {currentFeedback.isEditable && (
            <span className="editable-badge">Editable</span>
          )}
        </div>
      </div>

      <div className="feedback-rating">
        <StarRating rating={currentFeedback.rating} readonly size="small" />
      </div>

      <p className="feedback-comment">{currentFeedback.comment}</p>

      {currentFeedback.adminReply?.message && (
        <div className="admin-reply-block">
          <p className="admin-reply-title">Reply from clinic</p>
          <p className="admin-reply-message">{currentFeedback.adminReply.message}</p>
          <p className="admin-reply-meta">
            {currentFeedback.adminReply.repliedBy || "Reception"}
            {currentFeedback.adminReply.repliedAt
              ? ` • ${new Date(currentFeedback.adminReply.repliedAt).toLocaleString()}`
              : ""}
          </p>
        </div>
      )}

      {showReplyForm && (
        <form className="reply-form" onSubmit={handleReplySubmit}>
          <div className="reply-form-row">
            <label htmlFor={`repliedBy-${currentFeedback._id}`}>Reply by</label>
            <input
              id={`repliedBy-${currentFeedback._id}`}
              type="text"
              value={repliedBy}
              onChange={(e) => setRepliedBy(e.target.value)}
              maxLength={80}
              placeholder="Receptionist name"
            />
          </div>
          <div className="reply-form-row">
            <label htmlFor={`reply-${currentFeedback._id}`}>Reply message</label>
            <textarea
              id={`reply-${currentFeedback._id}`}
              rows="3"
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              maxLength={500}
              placeholder="Type reply to patient..."
              required
            />
            <span className="reply-char-count">{replyMessage.length}/500</span>
          </div>
          <div className="reply-form-actions">
            <button type="submit" className="btn btn-reply-save" disabled={replySaving}>
              {replySaving ? "Saving..." : "Save Reply"}
            </button>
            <button
              type="button"
              className="btn btn-reply-cancel"
              onClick={() => setShowReplyForm(false)}
              disabled={replySaving}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {canReply && (
        <div className="feedback-actions">
          <button
            className="btn btn-reply"
            onClick={() => setShowReplyForm((prev) => !prev)}
          >
            💬 {currentFeedback.adminReply?.message ? "Edit Reply" : "Reply"}
          </button>
        </div>
      )}
    </div>
  );
};

export default FeedbackCard;
