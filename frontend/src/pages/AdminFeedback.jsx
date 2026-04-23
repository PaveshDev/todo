import { useEffect, useState } from "react";
import { getAllFeedback } from "../services/feedbackService";
import FeedbackCard from "../components/FeedbackCard";
import { toast } from "react-toastify";
import "../styles/FeedbackList.css";

const AdminFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [doctorSearch, setDoctorSearch] = useState("");
  const [onlyUnreplied, setOnlyUnreplied] = useState(false);

  const fetchFeedbacks = async (options = {}) => {
    try {
      setLoading(true);
      const res = await getAllFeedback(options);
      setFeedbacks(res.data);
    } catch (error) {
      toast.error("Failed to load feedback");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks({ withReply: false });
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchFeedbacks({
      doctor: doctorSearch,
      withReply: onlyUnreplied ? false : undefined,
    });
  };

  const handleToggleUnreplied = () => {
    const next = !onlyUnreplied;
    setOnlyUnreplied(next);
    fetchFeedbacks({
      doctor: doctorSearch,
      withReply: next ? false : undefined,
    });
  };

  return (
    <div className="feedback-list-page">
      <div className="page-header">
        <h2>Admin/Reception Feedback Inbox</h2>
        <p className="subtitle">
          View submitted patient feedback and send official replies
        </p>
      </div>

      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search by doctor name..."
          value={doctorSearch}
          onChange={(e) => setDoctorSearch(e.target.value)}
        />
        <button type="submit" className="btn btn-search">
          Search
        </button>
        <button
          type="button"
          className="btn btn-clear"
          onClick={handleToggleUnreplied}
        >
          {onlyUnreplied ? "Show All" : "Only Unreplied"}
        </button>
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
          <p>No matching feedback was found.</p>
        </div>
      ) : (
        <>
          <p className="result-count">{feedbacks.length} feedback(s) found</p>
          <div className="feedback-grid">
            {feedbacks.map((fb) => (
              <FeedbackCard key={fb._id} feedback={fb} canReply />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminFeedback;
