// services/leaveRequestService.js

class LeaveRequestService {
  constructor() {
    this.baseURL = 'http://localhost:8080/api'; // You can replace this with process.env.REACT_APP_API_URL in production
  }

  // Get employee ID from session or local storage
  getEmployeeId() {
    return sessionStorage.getItem("empId") || localStorage.getItem("empId");
  }

  // Get authentication token
  getAuthToken() {
    return sessionStorage.getItem('token') || localStorage.getItem('token') || '';
  }

  // Get all leave types from backend
 async getAllLeaveTypes() {
  try {
    const response = await fetch(`${this.baseURL}/leave-types`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`, // add token if required
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (Array.isArray(result)) {
      // Map your leave types to dropdown format
      return result.map(type => ({
        value: type.leaveTypeId,    // your ID field
        label: type.typeName        // your display field
      }));
    } else {
      throw new Error('Invalid response format from leave types API');
    }
  } catch (error) {
    console.error('Error fetching leave types:', error);
    throw error;
  }
}


  // Create draft leave request
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
const data = await response.text(); // plain text response
    console.log("Server response:", data);

    const match = data.match(/ID:\s*(\d+)/);
    const requestId = match ? match[1] : null;

    return {
      message: data,
      requestId: requestId,
    };
    } catch (error) {
      console.error('Error creating draft leave request:', error);
      throw error;
    }
  }

  // Submit leave request (optionally with alteration data)
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

  // Create alteration record
  async createAlteration(alterationData) {
    try {
      const response = await fetch(`${this.baseURL}/leave-alteration/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify([alterationData]), // Send as array
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

  // Check notification status
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

      const result = await response.json();
      return result.status || result.notificationStatus || 'PENDING';
    } catch (error) {
      console.error('Error checking notification status:', error);
      throw error;
    }
  }

  // Upload document
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

    const fileUrl = await response.text();  // <-- get plain text response

    console.log('UploadedfileURL:', fileUrl); // Log the URL string

    return fileUrl;  // return the URL string directly
  } catch (error) {
    console.error('Error uploading document:', error);
    throw error;
  }
}


  // Extract request ID from message
  extractRequestIdFromMessage(message) {
    if (!message) return null;
    const match = message.match(/ID:\s*(\d+)/);
    return match ? parseInt(match[1]) : null;
  }

  // Validate basic leave request
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

  // Validate alteration request
  validateAlterationRequest(data) {
    const errors = [];

    if (!data.alterationMode) {
      errors.push('Alteration mode is required');
    }

    if (data.alterationMode) {
      if (!data.classDate) errors.push('Class date is required');
      if (!data.classPeriod) errors.push('Class period is required');
      if (!data.subjectCode) errors.push('Subject code is required');
      if (!data.subjectName) errors.push('Subject name is required');

      if (data.alterationMode === 'MOODLE_LINK' && !data.moodleActivityLink) {
        errors.push('Moodle activity link is required');
      }

      if (data.alterationMode === 'STAFF_ALTERATION' && !data.replaceEmpId) {
        errors.push('Replace employee ID is required');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validate full leave request including alteration if applicable
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
}

// ✅ Correct export
export default new LeaveRequestService();