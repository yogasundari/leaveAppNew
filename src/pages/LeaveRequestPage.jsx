import React, { useState } from 'react';
import leaveRequestService from '../services/leaveRequestService';
import {
  BasicInfoSection,
  HalfDaySection,
  TimeSection,
  CompoffSection,
  ClassSection,
} from '../components/leave/LeaveFormSections';
import { Button, ErrorMessage, SuccessMessage } from '../components/form/FormComponents';
import '../styles/LeaveRequest.css';
import { useNavigate } from 'react-router-dom';

const LeaveRequestPage = () => {
  const [formData, setFormData] = useState({
    empId: leaveRequestService.getEmployeeId(),
    startDate: '',
    endDate: '',
    leaveType: 'CL',
    leaveTypeId: 1,
    reason: '',
    hasClass: false,
    isHalfDay: false,
    startTime: '',
    session: '',
    endTime: '',
    earnedDate: '',
    fileUpload: null,   // Store uploaded file URL here
    document: null,     // File object for upload
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState('');
  const [errors, setErrors] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showAlterationType, setShowAlterationType] = useState(false);
  const navigate = useNavigate();

  const handleFieldChange = (field, value) => {
      if (field === 'leaveType') {
    console.log('Leave type selected:', `"${value}"`); // Shows exact value with quotes
  }
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (field === 'hasClass') {
      setShowAlterationType(false);
      if (value === false) {
        setFormData(prev => ({
          ...prev,
          alterationType: '',
          classPeriod: '',
          subjectCode: '',
          subjectName: '',
          moodleLink: '',
          alteredFaculty: ''
        }));
      }
    }

    if (errors.length > 0) {
      setErrors([]);
    }
  };

  // Example file input handler to store file object & clear previous uploaded URL if new file selected
  const handleFileChange = (e) => {
    const file = e.target.files[0] || null;
    setFormData(prev => ({
      ...prev,
      document: file,
      fileUpload: null,  // Reset uploaded URL because new file selected
    }));
  };

  const handleMoveToAlteration = () => {
    setShowAlterationType(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors([]);
    setSuccessMessage('');

    try {
      const validation = leaveRequestService.validateLeaveRequest(formData);
      if (!validation.isValid) {
        setErrors(validation.errors);
        setIsSubmitting(false);
        return;
      }

      const leaveRequestData = {
        empId: formData.empId,
        leaveTypeId: formData.leaveTypeId,
        isHalfDay: formData.isHalfDay,
        startDate: formData.startDate,
        earnedDate: formData.earnedDate,
        endDate: formData.endDate,
        reason: formData.reason,
        hasClass: formData.hasClass,
        fileUpload: formData.fileUpload || null,  // Use fileUpload from formData state
      };

      if (formData.isHalfDay && formData.session) {
        leaveRequestData.session = formData.session;
      }

      if (['Permission', 'Late'].includes(formData.leaveType)) {
        if (formData.startTime) leaveRequestData.startTime = formData.startTime;
        if (formData.endTime) leaveRequestData.endTime = formData.endTime;
      }

      if (formData.leaveType === 'comp off' && formData.earnedDate) {
        leaveRequestData.earnedDate = formData.earnedDate;
      }

      // If a new document file is selected, upload it
      if (formData.document) {
        const uploadResult = await leaveRequestService.uploadDocument(formData.document);
        leaveRequestData.fileUpload = uploadResult.url; // Save uploaded URL in leaveRequestData
      }

      if (formData.leaveType === 'ML' && formData.document) {
        leaveRequestData.medicalFile = formData.document;
      }

      const result = await leaveRequestService.createDraftLeaveRequest(leaveRequestData);
      setSuccessMessage('Leave request submitted successfully!');
      navigate('/dashboard/leave-history'); // Redirect after submission
      console.log('Leave request submitted:', result);
    } catch (error) {
      console.error("Error creating draft leave request:", error);

      if (error.response && error.response.status === 400) {
        setErrorMessage(error.response.data.message || error.response.data);
      } else if (error.message) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      empId: leaveRequestService.getEmployeeId(),
      startDate: '',
      endDate: '',
      leaveType: 'CL',
      leaveTypeId: 1,
      reason: '',
      hasClass: false,
      isHalfDay: false,
      session: '',
      alterationMode: '',
      startTime: '',
      endTime: '',
      earnedDate: '',
      fileUpload: null,
      document: null,
      classPeriod: '',
      subjectCode: '',
      subjectName: '',
      moodleLink: '',
      alteredFaculty: '',
    });
    setNotificationStatus('');
    setErrors([]);
    setSuccessMessage('');
    setShowAlterationType(false);
  };

  return (
    <div className="leave-request-container">
      <h2 className="leave-request-heading">Leave Request</h2>

      <form onSubmit={handleSubmit} className={`leave-request-form ${isSubmitting ? 'loading' : ''}`}>

        {errorMessage && (
          <div style={{ color: 'red', marginBottom: '1rem' }}>
            {errorMessage}
          </div>
        )}

        <SuccessMessage message={successMessage} />

        <BasicInfoSection formData={formData} onChange={handleFieldChange} />
        <HalfDaySection formData={formData} onChange={handleFieldChange} />
        <TimeSection formData={formData} onChange={handleFieldChange} />
        <CompoffSection formData={formData} onChange={handleFieldChange} />
        <ClassSection formData={formData} onChange={handleFieldChange} />



        <Button type="submit" disabled={isSubmitting} variant="primary">
          {isSubmitting ? 'Submitting...' : 'Submit Leave Request'}
        </Button>

        <Button type="button" onClick={resetForm} variant="secondary">
          Reset Form
        </Button>
      </form>
    </div>
  );
};

export default LeaveRequestPage;
