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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState('');
  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [showAlterationType, setShowAlterationType] = useState(false);

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
      console.log('Leave request submitted:', result);
    } catch (error) {
      setErrors(['Failed to submit leave request. Please try again.']);
      console.error('Submission error:', error);
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
        {errors.length > 0 && (
          <div>
            {errors.map((error, index) => (
              <ErrorMessage key={index} message={error} />
            ))}
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
