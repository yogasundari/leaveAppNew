// LeaveRequestPage.js
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
    fileUpload: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState('');
  const [errors, setErrors] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showAlterationType, setShowAlterationType] = useState(false);
  const navigate = useNavigate();

  const handleFieldChange = (field, value) => {
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
const uploadedUrl = localStorage.getItem('uploadedDocumentUrl');
console.log('Uploaded Document URL:', uploadedUrl);

const leaveRequestData = {
  empId: formData.empId,
  leaveTypeId: formData.leaveTypeId,
  isHalfDay: formData.isHalfDay,
  startDate: formData.startDate,
  endDate: formData.endDate,
  reason: formData.reason,
  hasClass: formData.hasClass,
  fileUpload: uploadedUrl || null, // Assigns null if no file uploaded
};
if (formData.isHalfDay && formData.session) {
  leaveRequestData.session = formData.session;
}

      if (['Permission', 'Late'].includes(formData.leaveType)) {
        if (formData.startTime) leaveRequestData.startTime = formData.startTime;
        if (formData.endTime) leaveRequestData.endTime = formData.endTime;
      }

      if (formData.leaveType === 'Compoff' && formData.earnedDate) {
        leaveRequestData.earnedDate = formData.earnedDate;
      }

      if (formData.document) {
        const uploadResult = await leaveRequestService.uploadDocument(formData.document);
        leaveRequestData.documentUrl = uploadResult.url;
      }

      if (formData.leaveType === 'ML' && formData.document) {
        leaveRequestData.medicalFile = formData.document;
      }


  const result = await leaveRequestService.createDraftLeaveRequest(leaveRequestData);
  setSuccessMessage('Leave request submitted successfully!');
  navigate('/dashboard/leave-history'); // Redirect to leave requests page after submission
  console.log('Leave request submitted:', result);
}catch (error) {
  console.error("Error creating draft leave request:", error);

  if (error.response && error.response.status === 400) {
    setErrorMessage(error.response.data.message || error.response.data);
  } else if (error.message) {
    // If error is a JS Error with message, show that message
    setErrorMessage(error.message);
  } else {
    setErrorMessage("Something went wrong. Please try again.");
  }
}finally {
  setIsSubmitting(false); // Always reset loading state
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
