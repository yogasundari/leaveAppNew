// services/leaveService.js

const API_BASE_URL ='http://localhost:8080';

class LeaveService {
  constructor() {
    this.baseURL = `${API_BASE_URL}/api`;
  }

  // Get JWT token from localStorage
  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  // Fetch leave history for the current user
  async getLeaveHistory() {
    try {
      const response = await fetch(`${this.baseURL}/leave-request/leave-history`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Failed to load leave history: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching leave history:', error);
      throw error;
    }
  }

  // Fetch approval status for a specific leave request
  async getLeaveApprovalStatus(requestId) {
    try {
      const response = await fetch(`${this.baseURL}/leave-approval/status/${requestId}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch approval status: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching approval status:', error);
      throw error;
    }
  }

  // Utility function to format dates
  formatDate(dateStr) {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Get status color based on status value
  getStatusColor(status) {
    const statusColors = {
      APPROVED: 'green',
      REJECTED: 'red',
      PENDING: 'orange'
    };
    return statusColors[status] || '#666';
  }

  // Get background color for leave cards based on status
  getCardBackgroundColor(status) {
    const backgroundColors = {
      APPROVED: '#e6f4ea',
      REJECTED: '#fdecea',
      PENDING: '#fffbe6'
    };
    return backgroundColors[status] || '#f8f9fa';
  }
}

export default new LeaveService();