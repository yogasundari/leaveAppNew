import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const getAuthToken = () => {
  return localStorage.getItem('token');
};

const getNotifications = async (empId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/notifications`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      params: { empId }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

const approveAlteration = async (id) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/leave-alteration/approve/${id}`, {}, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error approving alteration:', error);
    throw error;
  }
};

const rejectAlteration = async (id) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/leave-alteration/reject/${id}`, {}, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error rejecting alteration:', error);
    throw error;
  }
};

export default {
  getNotifications,
  approveAlteration,
  rejectAlteration
};
