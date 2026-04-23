import axios from "axios";

const API_URL = "http://localhost:5000/api/feedback";

// Create feedback
export const createFeedback = async (feedbackData) => {
  const response = await axios.post(API_URL, feedbackData);
  return response.data;
};

// Get all feedback (optional filters: doctor, patient, withReply)
export const getAllFeedback = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.doctor) params.append("doctor", filters.doctor);
  if (filters.patient) params.append("patient", filters.patient);
  if (filters.withReply !== undefined) {
    params.append("withReply", String(filters.withReply));
  }
  const query = params.toString();
  const url = query ? `${API_URL}?${query}` : API_URL;
  const response = await axios.get(url);
  return response.data;
};

// Get single feedback
export const getFeedbackById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

// Get doctor rating summary
export const getDoctorSummary = async () => {
  const response = await axios.get(`${API_URL}/summary/doctors`);
  return response.data;
};

// Update feedback
export const updateFeedback = async (id, feedbackData) => {
  const response = await axios.put(`${API_URL}/${id}`, feedbackData);
  return response.data;
};

// Add/update admin or receptionist reply
export const replyToFeedback = async (id, replyData) => {
  const response = await axios.patch(`${API_URL}/${id}/reply`, replyData);
  return response.data;
};

// Delete feedback
export const deleteFeedback = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
