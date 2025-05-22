import axios from "axios";

const API_BASE_URL = "http://localhost:8080/auth";

export const registerUser = async (userData) => {
  return await axios.post(`${API_BASE_URL}/register`, userData);
};
// src/services/authService.js
export const loginUser = async (userData) => {
  return await axios.post(`${API_BASE_URL}/login`, userData);
};
export async function forgotPassword(data) {
  const response = await axios.post(`${API_BASE_URL}/forgot-password`, data);
  return response.data; // expects { token, message }
}

export async function resetPassword(data) {
  const response = await axios.post(`${API_BASE_URL}/reset-password`, data);
  return response.data; // expects success message or error
}