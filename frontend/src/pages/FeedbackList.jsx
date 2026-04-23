import { useState, useEffect } from "react";
import { getAllFeedback } from "../services/feedbackService";
import FeedbackCard from "../components/FeedbackCard";
import { toast } from "react-toastify";
import "../styles/FeedbackList.css";

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchFeedbacks = async (doctorFilter = "") => {
    try {
      setLoading(true);
      const res = await getAllFeedback(doctorFilter);
      setFeedbacks(res.data);
    } catch (error) {
      toast.error("Failed to load feedback");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchFeedbacks(search);
  };

  const handleDelete = (id) => {
    setFeedbacks((prev) => prev.filter((f) => f._id !== id));
  };

  return (
    <div className="feedback-list-page">
      <div className="page-header">
        <h2>All Feedback & Ratings</h2>
        <p className="subtitle">
          View all patient feedback for completed consultations
        </p>
      </div>

      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="🔍 Search by doctor name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" className="btn btn-search">
          Search
        </button>
        {search && (
          <button
            type="button"
            className="btn btn-clear"
            onClick={() => {
              setSearch("");
              fetchFeedbacks();
            }}
          >
            Clear
          </button>
        )}
      </form>

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading feedback...</p>
        </div>
      ) : feedbacks.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📝</span>
          <h3>No Feedback Found</h3>
          <p>No feedback has been submitted yet, or no results match your search.</p>
        </div>
      ) : (
        <>
          <p className="result-count">{feedbacks.length} feedback(s) found</p>
          <div className="feedback-grid">
            {feedbacks.map((fb) => (
              <FeedbackCard
                key={fb._id}
                feedback={fb}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default FeedbackList;
