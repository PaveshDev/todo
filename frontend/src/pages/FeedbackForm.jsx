import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createFeedback } from "../services/feedbackService";
import { verifyConsultation } from "../services/consultationService";
import StarRating from "../components/StarRating";
import { toast } from "react-toastify";

const FeedbackForm = () => {
  const navigate = useNavigate();

  // Step 1: Consultation verification
  const [consultationId, setConsultationId] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [consultationInfo, setConsultationInfo] = useState(null);

  // Step 2: Feedback form
  const [formData, setFormData] = useState({
    rating: 0,
    comment: "",
  });
  const [submitting, setSubmitting] = useState(false);

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
        comment: formData.comment,
      });
      toast.success("Feedback submitted successfully! 🎉");
      navigate("/");
    } catch (error) {
      const msg =
        error.response?.data?.message || "Failed to submit feedback";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-8 pb-20">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header Section */}
        <div className="mb-12">
          <span className="inline-block text-cyan-700 font-bold text-xs uppercase tracking-widest mb-3 px-4 py-1 bg-cyan-50 rounded-full border border-cyan-200">
            Your Experience Matters
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-4 font-['Manrope'] tracking-tight">
            Share Your Feedback
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
            Help us improve your dental care experience by sharing your thoughts about your consultation with our team.
          </p>
        </div>

        {/* Step 1: Verify Consultation */}
        {!verified ? (
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center">
                  <span className="material-symbols-outlined text-cyan-700 text-xl">verified_user</span>
                </div>
                <div>
                  <p className="text-cyan-700 font-bold text-xs uppercase tracking-widest">Step 1</p>
                  <h2 className="text-2xl font-extrabold text-gray-900 font-['Manrope']">Verify Your Consultation</h2>
                </div>
              </div>

              <p className="text-gray-600 mb-8 leading-relaxed">
                Enter your Consultation ID to verify your eligibility. Only patients with completed consultations can submit feedback.
              </p>

              <div className="mb-8">
                <label htmlFor="consultationId" className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                  Consultation ID
                </label>
                <input
                  type="text"
                  id="consultationId"
                  name="consultationId"
                  placeholder="e.g., CONS-2026-0001"
                  value={consultationId}
                  onChange={(e) => setConsultationId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-cyan-500 focus:outline-none font-medium text-gray-900 placeholder-gray-400 transition-colors"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={verifying}
                className="w-full bg-gradient-to-br from-cyan-700 to-cyan-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-cyan-700/20 hover:shadow-cyan-700/30 hover:from-cyan-600 hover:to-cyan-500 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">shield_check</span>
                {verifying ? "Verifying..." : "Verify Consultation"}
              </button>
            </div>
          </form>
        ) : (
          /* Step 2: Feedback Form */
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Success Indicator */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-green-700 text-xl">check_circle</span>
              </div>
              <div>
                <p className="text-green-700 font-bold text-sm uppercase tracking-widest">Verification Successful</p>
                <p className="text-green-600 font-medium">You're ready to share your feedback</p>
              </div>
            </div>

            {/* Consultation Details Card */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <h3 className="text-cyan-700 font-bold text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-base">info</span>
                Consultation Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-cyan-50 p-4 rounded-xl border border-cyan-100">
                  <p className="text-cyan-700 font-bold text-xs uppercase tracking-wide mb-1">Patient Name</p>
                  <p className="text-gray-900 font-bold text-lg">{consultationInfo.patientName}</p>
                </div>
                <div className="bg-cyan-50 p-4 rounded-xl border border-cyan-100">
                  <p className="text-cyan-700 font-bold text-xs uppercase tracking-wide mb-1">Doctor Name</p>
                  <p className="text-gray-900 font-bold text-lg">{consultationInfo.doctorName}</p>
                </div>
                <div className="bg-cyan-50 p-4 rounded-xl border border-cyan-100">
                  <p className="text-cyan-700 font-bold text-xs uppercase tracking-wide mb-1">Consultation ID</p>
                  <p className="text-gray-900 font-bold text-lg font-mono">{consultationInfo.consultationId}</p>
                </div>
                <div className="bg-cyan-50 p-4 rounded-xl border border-cyan-100">
                  <p className="text-cyan-700 font-bold text-xs uppercase tracking-wide mb-1">Consultation Date</p>
                  <p className="text-gray-900 font-bold text-lg">
                    {new Date(consultationInfo.consultationDate).toLocaleDateString("en-US", { 
                      year: "numeric", 
                      month: "short", 
                      day: "numeric" 
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Rating Section */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <label className="block text-gray-900 font-extrabold text-xl mb-6 font-['Manrope']">
                Rate Your Experience with Dr. {consultationInfo.doctorName}
              </label>
              <div className="flex justify-center">
                <StarRating
                  rating={formData.rating}
                  onRate={(val) => setFormData({ ...formData, rating: val })}
                />
              </div>
            </div>

            {/* Comment Section */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <label htmlFor="comment" className="block text-gray-900 font-extrabold text-lg mb-3 font-['Manrope']">
                Share Your Feedback
              </label>
              <p className="text-gray-600 text-sm mb-4">
                Tell us about your experience during the consultation
              </p>
              <textarea
                id="comment"
                name="comment"
                rows="5"
                placeholder="Share your experience with the doctor, clinic environment, treatment quality, and any suggestions..."
                value={formData.comment}
                onChange={(e) =>
                  setFormData({ ...formData, comment: e.target.value })
                }
                maxLength={500}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-cyan-500 focus:outline-none font-medium text-gray-900 placeholder-gray-400 transition-colors resize-none"
                required
              />
              <div className="flex justify-between items-center mt-3">
                <p className="text-gray-500 text-sm">
                  Be honest and constructive in your feedback
                </p>
                <span className="text-gray-400 text-sm font-medium">
                  {formData.comment.length}/500
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 flex-col sm:flex-row">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-gradient-to-br from-cyan-700 to-cyan-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-cyan-700/20 hover:shadow-cyan-700/30 hover:from-cyan-600 hover:to-cyan-500 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">send</span>
                {submitting ? "Submitting..." : "Submit Feedback"}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 sm:flex-0 border-2 border-gray-300 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">edit</span>
                Change Consultation
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default FeedbackForm;
