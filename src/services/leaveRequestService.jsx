// services/leaveService.js

class LeaveRequestService {
  constructor() {
    this.baseURL = 'http://localhost:8000/api';
  }

  // Get employee ID from session storage (replacing localStorage)
getEmployeeId() {
  // In a real app, this would come from authentication context
  return localStorage.getItem("empId");
}

  // Submit leave request
  async submitLeaveRequest(leaveRequestData) {
    try {
      const response = await fetch(`${this.baseURL}/leave-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify(leaveRequestData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error submitting leave request:', error);
      throw error;
    }
  }

  // Send notification to altered faculty
  async sendNotificationToFaculty(facultyEmail, leaveDetails) {
    try {
      const response = await fetch(`${this.baseURL}/notifications/faculty`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify({
          recipientEmail: facultyEmail,
          leaveDetails,
          type: 'STAFF_ALTERATION'
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  }

  // Upload document
  async uploadDocument(file) {
    try {
      const formData = new FormData();
      formData.append('document', file);

      const response = await fetch(`${this.baseURL}/documents/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  }

  // Get authentication token
  getAuthToken() {
    return sessionStorage.getItem('authToken') || '';
  }

  // Validate leave request data
  validateLeaveRequest(data) {
    const errors = [];

    if (!data.startDate) errors.push('Start date is required');
    if (!data.endDate) errors.push('End date is required');
    if (!data.leaveType) errors.push('Leave type is required');
    if (!data.reason) errors.push('Reason is required');

    // Validate date range
    if (data.startDate && data.endDate) {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      if (start > end) {
        errors.push('End date must be after start date');
      }
    }

    // Validate time fields for Permission/Late
    if (['Permission', 'Late'].includes(data.leaveType)) {
      if (!data.startTime) errors.push('Start time is required');
      if (!data.endTime) errors.push('End time is required');
    }

    // Validate earned date for Compoff
    if (data.leaveType === 'Compoff' && !data.earnedDate) {
      errors.push('Earned date is required for compensatory leave');
    }

    // Validate alteration details
    if (data.hasClass === 'yes') {
      if (!data.alterationMode) {
        errors.push('Alteration mode is required when you have a class');
      }
      if (data.alterationMode) {
        if (!data.classPeriod) errors.push('Class period is required');
        if (!data.subjectCode) errors.push('Subject code is required');
        if (!data.subjectName) errors.push('Subject name is required');
        
        if (data.alterationMode === 'Staff Alteration' && !data.alteredFaculty) {
          errors.push('Altered faculty email is required');
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export default new LeaveRequestService();