import axios from "axios";

const API_URL = "http://localhost:5000/api/consultations";

// Book a new consultation
export const createConsultation = async (consultationData) => {
  const response = await axios.post(API_URL, consultationData);
  return response.data;
};

// Get all consultations (optional filters: status, doctor, patient)
export const getAllConsultations = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.status) params.append("status", filters.status);
  if (filters.doctor) params.append("doctor", filters.doctor);
  if (filters.patient) params.append("patient", filters.patient);
  const url = params.toString() ? `${API_URL}?${params}` : API_URL;
  const response = await axios.get(url);
  return response.data;
};

// Verify a consultation for feedback eligibility
export const verifyConsultation = async (consultationId) => {
  const response = await axios.get(`${API_URL}/verify/${consultationId}`);
  return response.data;
};

// Get single consultation
export const getConsultationById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

// Update consultation
export const updateConsultation = async (id, data) => {
  const response = await axios.put(`${API_URL}/${id}`, data);
  return response.data;
};

// Delete consultation
export const deleteConsultation = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
