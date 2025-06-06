// services/employeeService.js

const API_BASE_URL = 'http://localhost:8080';

class EmployeeService {
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

  // Get multipart auth headers (for file uploads)
  getMultipartAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`
      // Do NOT set Content-Type for FormData manually
    };
  }

  // Fetch employee profile by ID
  async getEmployeeProfile(empId) {
    if (!empId) empId = this.getUserData().empId;
    if (!empId) throw new Error("Employee ID not available");

    try {
      const response = await fetch(`${this.baseURL}/employees/${empId}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch employee profile: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching employee profile:', error);
      throw error;
    }
  }
  // Update employee profile
  async updateEmployeeProfile(empId, profileData) {
    if (!empId) empId = this.getUserData().empId;
    if (!empId) throw new Error("Employee ID not available");

    try {
      const response = await fetch(`${this.baseURL}/employees/update/${empId}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(profileData)
      });

      if (!response.ok) {
        throw new Error(`Failed to update employee profile: ${response.status} ${response.statusText}`);
      }
const message = await response.text(); // correctly handles plain text
        console.log("Update message:", message);
        return message;  // return the plain text message

    } catch (error) {
      console.error('Error updating employee profile:', error);
      throw error;
    }
  }

  // Upload profile picture
  async uploadProfilePicture(empId, imageFile) {
    if (!empId) empId = this.getUserData().empId;
    if (!empId) throw new Error("Employee ID not found in localStorage");

    try {
      const formData = new FormData();
      formData.append('file', imageFile);

     console.log("empId (uploadProfilePicture):", empId);

      const response = await fetch(`${this.baseURL}/employees/upload-picture/${empId}`, {
        method: 'POST',
        headers: this.getMultipartAuthHeaders(),
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Failed to upload profile picture: ${response.status} ${response.statusText}`);
      }

// Parse as text because server returns a plain URL string, not JSON
    const imageUrl = await response.text();
    console.log("Uploaded image URL:", imageUrl);

    return imageUrl;  // return the string URL
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      throw error;
    }
  }

  // Fetch all departments
  async getDepartments() {
    try {
      const response = await fetch(`${this.baseURL}/departments`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch departments: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching departments:', error);
      throw error;
    }
  }

  // Get user data from localStorage
  getUserData() {
    return {
      empId: localStorage.getItem('empId') || '',
      email: localStorage.getItem('email') || '',
      role: localStorage.getItem('role') || ''

    };
  }
  // Fetch all Approval flow id
async getApprovalFlows() {
  try {
    const response = await fetch(`${this.baseURL}/approval-flows/active`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch approval flow: ${response.status} ${response.statusText}`);
    }

    const data = await response.json(); // ✅ parse JSON first
    console.log("approvalFlows", data); // ✅ log the actual fetched array

    return data;
  } catch (error) {
    console.error('Error fetching approval flow:', error);
    throw error;
  }
}

  // Format date for input fields
  formatDateForInput(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }
}

export default new EmployeeService();
