import { useEffect, useState } from "react";
import { getAllFeedback } from "../services/feedbackService";
import FeedbackCard from "../components/FeedbackCard";
import { toast } from "react-toastify";
import "../styles/FeedbackList.css";

const DoctorFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [doctorSearch, setDoctorSearch] = useState("");

  const fetchFeedbacks = async (doctor = "") => {
    try {
      setLoading(true);
      const res = await getAllFeedback({ doctor });
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
    fetchFeedbacks(doctorSearch);
  };

  return (
    <div className="feedback-list-page">
      <div className="page-header">
        <h2>Doctor Feedback View</h2>
        <p className="subtitle">
          Doctors can only view patient feedback submitted for consultations
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
        {doctorSearch && (
          <button
            type="button"
            className="btn btn-clear"
            onClick={() => {
              setDoctorSearch("");
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
          <span className="empty-icon">📋</span>
          <h3>No Feedback Found</h3>
          <p>No matching feedback was found.</p>
        </div>
      ) : (
        <>
          <p className="result-count">{feedbacks.length} feedback(s) found</p>
          <div className="feedback-grid">
            {feedbacks.map((fb) => (
              <FeedbackCard key={fb._id} feedback={fb} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default DoctorFeedback;
