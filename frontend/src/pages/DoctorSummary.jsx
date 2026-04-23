import { useState, useEffect } from "react";
import { getDoctorSummary } from "../services/feedbackService";
import StarRating from "../components/StarRating";
import { toast } from "react-toastify";
import "../styles/DoctorSummary.css";

const DoctorSummary = () => {
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await getDoctorSummary();
        setSummaries(res.data);
      } catch (error) {
        toast.error("Failed to load doctor summaries");
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  const getRatingBar = (count, total) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    return (
      <div className="rating-bar">
        <div
          className="rating-bar-fill"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading doctor summaries...</p>
      </div>
    );
  }

  return (
    <div className="doctor-summary-page">
      <div className="page-header">
        <h2>Doctor Rating Summary</h2>
        <p className="subtitle">
          Aggregated ratings and review breakdown for each doctor
        </p>
      </div>

      {summaries.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📊</span>
          <h3>No Data Available</h3>
          <p>No feedback has been submitted yet.</p>
        </div>
      ) : (
        <div className="summary-grid">
          {summaries.map((doc, index) => (
            <div className="summary-card" key={index}>
              <div className="summary-header">
                <div className="doctor-avatar">
                  {doc.doctorName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3>Dr. {doc.doctorName}</h3>
                  <p className="review-count">
                    {doc.totalReviews} review{doc.totalReviews !== 1 && "s"}
                  </p>
                </div>
                <div className="avg-rating">
                  <span className="avg-number">{doc.averageRating}</span>
                  <StarRating
                    rating={Math.round(doc.averageRating)}
                    readonly
                    size="small"
                  />
                </div>
              </div>

              <div className="rating-breakdown">
                <div className="breakdown-row">
                  <span className="star-label">5 ★</span>
                  {getRatingBar(doc.breakdown.fiveStar, doc.totalReviews)}
                  <span className="count">{doc.breakdown.fiveStar}</span>
                </div>
                <div className="breakdown-row">
                  <span className="star-label">4 ★</span>
                  {getRatingBar(doc.breakdown.fourStar, doc.totalReviews)}
                  <span className="count">{doc.breakdown.fourStar}</span>
                </div>
                <div className="breakdown-row">
                  <span className="star-label">3 ★</span>
                  {getRatingBar(doc.breakdown.threeStar, doc.totalReviews)}
                  <span className="count">{doc.breakdown.threeStar}</span>
                </div>
                <div className="breakdown-row">
                  <span className="star-label">2 ★</span>
                  {getRatingBar(doc.breakdown.twoStar, doc.totalReviews)}
                  <span className="count">{doc.breakdown.twoStar}</span>
                </div>
                <div className="breakdown-row">
                  <span className="star-label">1 ★</span>
                  {getRatingBar(doc.breakdown.oneStar, doc.totalReviews)}
                  <span className="count">{doc.breakdown.oneStar}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorSummary;
