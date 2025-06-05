// services/leaveRequestService.js - FIXED VERSION

class LeaveRequestService {
  constructor() {
    this.baseURL = 'http://localhost:8080/api';
  }

  getEmployeeId() {
    return sessionStorage.getItem("empId") || localStorage.getItem("empId");
  }

  getAuthToken() {
    return sessionStorage.getItem('token') || localStorage.getItem('token') || '';
  }

  // FIXED: Return both canSubmit boolean AND status list
  async checkNotificationStatus(requestId) {
    try {
      const response = await fetch(`${this.baseURL}/leave-alteration/notification-status/${requestId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const statusList = await response.json();
      console.log('Backend status list for requestId', requestId, ':', statusList);

      // Check if ALL statuses are 'APPROVED' (ignoring null/pending)
      const pendingStatuses = statusList.filter(status => status === null || status === 'PENDING');
      const approvedStatuses = statusList.filter(status => status === 'APPROVED');
      const rejectedStatuses = statusList.filter(status => status === 'REJECTED');

      // Can submit only if all are approved and none are rejected
      const canSubmit = statusList.length > 0 && 
                       statusList.every(status => status === 'APPROVED') &&
                       rejectedStatuses.length === 0;

      // Determine overall status
      let overallStatus = 'PENDING';
      if (rejectedStatuses.length > 0) {
        overallStatus = 'REJECTED';
      } else if (canSubmit) {
        overallStatus = 'APPROVED';
      }

      console.log('Can submit form?', canSubmit);
      console.log('Overall status:', overallStatus);

      // Return both the boolean and the detailed status info
      return {
        canSubmit,
        statusList,
        overallStatus,
        summary: {
          total: statusList.length,
          approved: approvedStatuses.length,
          pending: pendingStatuses.length,
          rejected: rejectedStatuses.length
        }
      };
    } catch (error) {
      console.error('Error checking notification status:', error);
      throw error;
    }
  }

  // ... rest of your existing methods remain the same
  async getAllLeaveTypes() {
    try {
      const response = await fetch(`${this.baseURL}/leave-types/active`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (Array.isArray(result)) {
        return result.map(type => ({
          value: type.leaveTypeId,
          label: type.typeName
        }));
      } else {
        throw new Error('Invalid response format from leave types API');
      }
    } catch (error) {
      console.error('Error fetching leave types:', error);
      throw error;
    }
  }

  async createDraftLeaveRequest(leaveRequestData) {
    try {
      const token = this.getAuthToken();
      const empId = this.getEmployeeId();

      console.log("👉 Auth Token:", token);
      console.log("👉 Employee ID:", empId);
      console.log("👉 Leave Request Payload:", leaveRequestData);

      const response = await fetch(`${this.baseURL}/leave-request/create-draft`, {
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

      const data = await response.text();
      console.log("Server response:", data);

      const match = data.match(/ID:\s*(\d+)/);
      const requestId = match ? match[1] : null;

      if (requestId) {
        localStorage.setItem('requestId', requestId);
        console.log(" Stored requestId in localStorage:", requestId);
      } else {
        console.error(" Could not extract requestId from response:", data);
      }

      return {
        message: data,
        requestId: requestId,
      };
    } catch (error) {
      console.error('Error creating draft leave request:', error);
      throw error;
    }
  }

  async submitLeaveRequest(requestId, alterationData = null) {
    try {
      if (alterationData) {
        await this.createAlteration(alterationData);
      }

      const response = await fetch(`${this.baseURL}/leave-request/submit/${requestId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
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

  async createAlteration(alterationData) {
    try {
      const response = await fetch(`${this.baseURL}/leave-alteration/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify([alterationData]),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating alteration:', error);
      throw error;
    }
  }

  async uploadDocument(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${this.baseURL}/leave-request/upload-file`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const fileUrl = await response.text();
      console.log('UploadedfileURL:', fileUrl);
      return fileUrl;
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  }

  extractRequestIdFromMessage(message) {
    if (!message) return null;
    const match = message.match(/ID:\s*(\d+)/);
    return match ? parseInt(match[1]) : null;
  }

  validateBasicLeaveRequest(data) {
    const errors = [];

    if (!data.empId) errors.push('Employee ID is required');
    if (!data.startDate) errors.push('Start date is required');
    if (!data.endDate) errors.push('End date is required');
    if (!data.leaveType) errors.push('Leave type is required');
    if (!data.reason) errors.push('Reason is required');

    if (data.startDate && data.endDate) {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      if (start > end) errors.push('End date must be after start date');
    }

    if (['Permission', 'Late'].includes(data.leaveType)) {
      if (!data.startTime) errors.push('Start time is required');
      if (!data.endTime) errors.push('End time is required');
    }

    if (data.leaveType === 'Compoff' && !data.earnedDate) {
      errors.push('Earned date is required for compensatory leave');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  validateLeaveRequest(data) {
    const basicValidation = this.validateBasicLeaveRequest(data);
    const errors = [...basicValidation.errors];

    if (data.hasClass === true) {
      const alterationValidation = this.validateAlterationRequest(data);
      errors.push(...alterationValidation.errors);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  getStoredRequestId() {
    const requestId = localStorage.getItem('requestId');
    return requestId ? parseInt(requestId, 10) : null;
  }

  clearStoredData() {
    localStorage.removeItem('requestId');
  }
}

export default new LeaveRequestService();