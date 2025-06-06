import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import employeeService from '../../services/employeeService';
import ProfilePicture from "../../components/ProfilePicture";
import ProfileFormInput from '../../components/ProfileFormInput';
import '../../styles/ProfileUpdate.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EditEmployee = () => {
  const { id } = useParams(); // employee ID from route

  const [departments, setDepartments] = useState([]);
  const [approvalFlows, setApprovalFlows] = useState([]);

  const [formData, setFormData] = useState({
    empId: '',
    empName: '',
    designation: '',
    departmentId: '',
    staffType: '',
    profilePicture: '',
    approvalFlowId: '',
    joiningDate: '',
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
const navigate = useNavigate();
  useEffect(() => {
    if (id) {
      loadInitialData();
    }
  }, [id]);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchEmployeeProfile(),
        fetchDepartments(),
        fetchApprovalFlows()
      ]);
    } catch (error) {
      setMessage('Error loading initial data: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEmployeeProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:8080/api/employees/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const emp = res.data;

      setFormData({
        empId: emp.empId,
        empName: emp.empName,
        designation: emp.designation,
        departmentId: emp.department?.departmentId || '',
        staffType: emp.staffType,
        profilePicture: emp.profilePicture || '',
        approvalFlowId: emp.approvalFlow?.approvalFlowId || '',
        joiningDate: emp.joiningDate?.slice(0, 10) || '',
      });

      setImagePreview(emp.profilePicture || '');
    } catch (error) {
      setMessage('Error fetching employee data: ' + error.message);
    }
  };

  const fetchDepartments = async () => {
    try {
      const data = await employeeService.getDepartments();
      setDepartments(data);
    } catch (error) {
      setMessage('Error fetching departments: ' + error.message);
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
      const uploadedUrl = await employeeService.uploadProfilePicture(formData.empId, selectedFile);
      setFormData(prev => ({
        ...prev,
        profilePicture: uploadedUrl,
      }));
      setImagePreview(uploadedUrl);
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

    const payload = {
      empId: formData.empId,
      empName: formData.empName,
      approvalFlowId: formData.approvalFlowId,
      designation: formData.designation,
      departmentId: formData.departmentId,
      joiningDate: formData.joiningDate,
      staffType: formData.staffType
    };

    try {
      const token = localStorage.getItem('token');
      console.log('📦 Submitting:', payload);

      await axios.put(
        'http://localhost:8080/api/employees/assign-approval-flow',
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage('Employee updated successfully!');
      navigate('/admin-panel/employee'); // Redirect to employee list
    } catch (error) {
      setMessage('Error updating employee: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getMessageType = () => {
    return message.toLowerCase().includes('error') ? 'error' : 'success';
  };

  return (
    <div className={`profile-update-container ${isLoading ? 'loading' : ''}`}>
      <h2 className="profile-update-title">Edit Employee</h2>

      {message && <div className={`message ${getMessageType()}`}>{message}</div>}

      <ProfilePicture
        imagePreview={imagePreview}
        onFileSelect={handleFileSelect}
        onUpload={handleImageUpload}
        selectedFile={selectedFile}
        isUploading={isUploading}
      />

      <form onSubmit={handleSubmit}>
        <ProfileFormInput name="empId" label="Employee ID" value={formData.empId} disabled />
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

        <ProfileFormInput name="joiningDate" label="Joining Date" type="date" value={formData.joiningDate} onChange={handleInputChange} required />

        <div className="form-group">
          <label className="form-label" htmlFor="departmentId">Department</label>
          <select
            id="departmentId"
            name="departmentId"
            value={formData.departmentId}
            onChange={(e) => setFormData(prev => ({ ...prev, departmentId: parseInt(e.target.value, 10) }))}
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

<div className="form-group">
            <label className="form-label" htmlFor="approvalFlowId">
              Approval Flow <span style={{ color: '#dc3545', marginLeft: '4px' }}>*</span>
            </label>
           <div className="form-group">
           <select
             id="approvalFlowId"
             name="approvalFlowId"
             value={formData.approvalFlowId ?? ''} // Ensure a fallback for undefined
            onChange={(e) => {
             const id = parseInt(e.target.value, 10);
             console.log("Selected Approval Flow ID:", id); // Debug output
             setFormData((prev) => ({
            ...prev,
             approvalFlowId: id, // Set parsed integer to state
            }));
           }}
          className="form-select"
            required
          >
         <option value="">Select Approval Flow</option>
        {approvalFlows.map((flow) => (
            <option key={flow.approvalFlowId} value={flow.approvalFlowId}>
          {flow.name}
         </option>
             ))}
          </select>
        </div>
          </div>

        <button type="submit" disabled={isLoading} className="submit-button">
          {isLoading ? 'Updating...' : 'Update Employee'}
        </button>
      </form>
    </div>
  );
};

export default EditEmployee;
