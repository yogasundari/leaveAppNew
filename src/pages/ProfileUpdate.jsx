import React, { useState, useEffect } from 'react';
import employeeService from '../services/employeeService';
import ProfileFormInput from '../components/ProfileFormInput';
import ProfilePicture from '../components/ProfilePicture';
import '../styles/ProfileUpdate.css';

const ProfileUpdate = () => {
  const userData = employeeService.getUserData();

  const [departments, setDepartments] = useState([]);
  const [approvalFlows, setApprovalFlows] = useState([]);

  const [formData, setFormData] = useState({
    empName: '',
    designation: '',
    departmentId: '',
    staffType: '',
    profilePicture: '',
    approvalFlowId: '',
    joiningDate: ''
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (userData.empId) {
      loadInitialData();
    }
  }, [userData.empId]);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchEmployeeProfile(),
        fetchDepartments(),
        fetchApprovalFlows(),
        userData.role === 'ADMIN' ? fetchApprovalFlows() : null
      ]);
    } catch (error) {
      setMessage('Error loading initial data: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEmployeeProfile = async () => {
    try {
      const data = await employeeService.getEmployeeProfile(userData.empId);
      setFormData({
        empName: data.empName || '',
        designation: data.designation || '',
        departmentId: data.department ? data.department.departmentId : '',
        staffType: data.staffType || '',
        profilePicture: data.profilePicture || '',
        approvalFlowId: data.approvalFlowId ? data.approvalFlows.approvalFlowId : '',
        joiningDate: employeeService.formatDateForInput(data.joiningDate)
      });
      setImagePreview(data.profilePicture || '');
    } catch (error) {
      throw new Error('Failed to fetch employee profile: ' + error.message);
    }
  };

  const fetchDepartments = async () => {
    try {
      const data = await employeeService.getDepartments();
      setDepartments(data);
    } catch (error) {
      throw new Error('Failed to fetch departments: ' + error.message);
    }
  };

  const fetchApprovalFlows = async () => {
    try {
      const data = await employeeService.getApprovalFlows();
      setApprovalFlows(data);
    } catch (error) {
      setMessage('Error fetching approval flows: ' + error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
    setMessage('');
  };

  const handleImageUpload = async () => {
    if (!selectedFile) {
      alert('Please choose an image first!');
      return;
    }

    setIsUploading(true);
    setMessage('');

    try {
      const uploadedImageUrl = await employeeService.uploadProfilePicture(userData.empId, selectedFile);
      const updatedProfile = await employeeService.getEmployeeProfile(userData.empId);

      setFormData(prev => ({
        ...prev,
        profilePicture: uploadedImageUrl || updatedProfile.profilePicture || '',
      }));

      setImagePreview(uploadedImageUrl || updatedProfile.profilePicture || '');
      setSelectedFile(null);
      setMessage('Image uploaded successfully!');
    } catch (error) {
      setMessage('Error uploading image: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
console.log(" Sending profile update data to backend:", formData);
    try {
      await employeeService.updateEmployeeProfile(userData.empId, formData);
      setMessage('Profile updated successfully!');

      await fetchEmployeeProfile();

    } catch (error) {
      setMessage('Error updating profile: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getMessageType = () => {
    return message.toLowerCase().includes('error') ? 'error' : 'success';
  };

  return (
    <div className={`profile-update-container ${isLoading ? 'loading' : ''}`}>
      <h2 className="profile-update-title">Update Profile</h2>

      {message && (
        <div className={`message ${getMessageType()}`}>
          {message}
        </div>
      )}

      <ProfilePicture
        imagePreview={imagePreview}
        onFileSelect={handleFileSelect}
        onUpload={handleImageUpload}
        selectedFile={selectedFile}
        isUploading={isUploading}
      />

      <form onSubmit={handleSubmit}>
        <ProfileFormInput name="empId" label="Employee ID" value={userData.empId} disabled />
        <ProfileFormInput name="email" label="Email" value={userData.email} disabled />
        <ProfileFormInput name="role" label="Role" value={userData.role} disabled />
        <ProfileFormInput name="empName" label="Employee Name" value={formData.empName} onChange={handleInputChange} required />
        <ProfileFormInput name="designation" label="Designation" value={formData.designation} onChange={handleInputChange} />
        <ProfileFormInput
  name="staffType"
  label="Staff Type"
  value={formData.staffType}
  onChange={handleInputChange}
  required
  options={[
    { label: 'TEACHING', value: 'TEACHING' },
    { label: 'NON_TEACHING', value: 'NON_TEACHING' }
  ]}
/>

        <ProfileFormInput name="joiningDate" label="Joining Date" type="date" value={formData.joiningDate} onChange={handleInputChange} required  disabled={!!formData.joiningDate}/>

        <div className="form-group">
          <label className="form-label" htmlFor="departmentId">
            Department <span style={{ color: '#dc3545', marginLeft: '4px' }}>*</span>
          </label>
          <select
            id="departmentId"
            name="departmentId"
            value={Number(formData.departmentId)}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                departmentId: parseInt(e.target.value, 10),
              }))
            }
            className="form-select"
            required
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept.departmentId} value={dept.departmentId}>
                {dept.deptName}
              </option>
            ))}
          </select>
        </div>

        

        <button type="submit" disabled={isLoading} className="submit-button">
          {isLoading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
};

export default ProfileUpdate;
