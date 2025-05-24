// pages/LeaveRequestPage.js
import React, { useState } from 'react';
import leaveRequestService from '../services/leaveRequestService';
import {
  BasicInfoSection,
  HalfDaySection,
  TimeSection,
  CompoffSection,
  ClassSection,
  AlterationSection
} from '../components/leave/LeaveFormSections';
import { Button, ErrorMessage, SuccessMessage } from '../components/form/FormComponents';
import '../styles/LeaveRequest.css';

const LeaveRequestPage = () => {
  // Initialize form data
  const [formData, setFormData] = useState({
    empId: leaveRequestService.getEmployeeId(),
    startDate: '',
    endDate: '',
    leaveType: 'CL',
    reason: '',
    hasClass: 'no',
    hasHalfDay: 'no',
    alterationMode: '',
    startTime: '',
    endTime: '',
    earnedDate: '',
    document: null,
    classPeriod: '',
    subjectCode: '',
    subjectName: '',
    moodleLink: '',
    alteredFaculty: '',
  });

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState('');
  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [showAlterationMode, setShowAlterationMode] = useState(false); // Add this state

  // Handle form field changes
  const handleFieldChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Reset alteration mode visibility when hasClass changes
    if (field === 'hasClass') {
      setShowAlterationMode(false);
      if (value === 'no') {
        // Clear alteration-related fields when "No" is selected
        setFormData(prev => ({
          ...prev,
          alterationMode: '',
          classPeriod: '',
          subjectCode: '',
          subjectName: '',
          moodleLink: '',
          alteredFaculty: ''
        }));
      }
    }
    
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  // Handle move to alteration button click
  const handleMoveToAlteration = () => {
    setShowAlterationMode(true);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors([]);
    setSuccessMessage('');

    try {
      // Validate form data
      const validation = leaveRequestService.validateLeaveRequest(formData);
      if (!validation.isValid) {
        setErrors(validation.errors);
        setIsSubmitting(false);
        return;
      }

      // Prepare leave request data
      const leaveRequestData = {
        empId: formData.empId,
        startDate: formData.startDate,
        endDate: formData.endDate,
        leaveType: formData.leaveType,
        reason: formData.reason,
        hasHalfDay: ['CL', 'ML', 'EL', 'Vacation', 'RH', 'Late'].includes(formData.leaveType)
          ? formData.hasHalfDay
          : null,
        hasClass: formData.hasClass,
        alterationMode: formData.hasClass === 'yes' ? formData.alterationMode : null,
        startTime: ['Permission', 'Late'].includes(formData.leaveType) ? formData.startTime : null,
        endTime: ['Permission', 'Late'].includes(formData.leaveType) ? formData.endTime : null,
        earnedDate: formData.leaveType === 'Compoff' ? formData.earnedDate : null,
        medicalFile: formData.leaveType === 'ML' ? formData.document : null,
        classPeriod: formData.alterationMode ? formData.classPeriod : null,
        subjectCode: formData.alterationMode ? formData.subjectCode : null,
        subjectName: formData.alterationMode ? formData.subjectName : null,
        moodleLink: formData.alterationMode === 'Moodle Activity' ? formData.moodleLink : null,
        alteredFaculty: formData.alterationMode === 'Staff Alteration' ? formData.alteredFaculty : null,
        notificationStatus: formData.alterationMode === 'Staff Alteration' ? notificationStatus : null,
      };

      // Upload document if present
      if (formData.document) {
        const uploadResult = await leaveRequestService.uploadDocument(formData.document);
        leaveRequestData.documentUrl = uploadResult.url;
      }

      // Submit leave request
      const result = await leaveRequestService.submitLeaveRequest(leaveRequestData);
      
      setSuccessMessage('Leave request submitted successfully!');
      console.log('Leave request submitted:', result);
      
      // Optionally reset form or redirect
      // resetForm();
      
    } catch (error) {
      setErrors(['Failed to submit leave request. Please try again.']);
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle faculty notification
  const handleSendNotification = async () => {
    if (!formData.alteredFaculty) {
      setErrors(['Please enter faculty email before sending notification']);
      return;
    }

    try {
      await leaveRequestService.sendNotificationToFaculty(formData.alteredFaculty, {
        empId: formData.empId,
        leaveType: formData.leaveType,
        startDate: formData.startDate,
        endDate: formData.endDate,
        classPeriod: formData.classPeriod,
        subjectCode: formData.subjectCode,
        subjectName: formData.subjectName
      });
      
      setNotificationStatus('Notification sent successfully!');
    } catch (error) {
      setErrors(['Failed to send notification. Please try again.']);
      console.error('Notification error:', error);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      empId: leaveRequestService.getEmployeeId(),
      startDate: '',
      endDate: '',
      leaveType: 'CL',
      reason: '',
      hasClass: 'no',
      hasHalfDay: 'no',
      alterationMode: '',
      startTime: '',
      endTime: '',
      earnedDate: '',
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
    setShowAlterationMode(false); // Reset alteration mode visibility
  };

  return (
    <div className="leave-request-container">
      <h2 className="leave-request-heading">Leave Request</h2>
      
      <form onSubmit={handleSubmit} className={`leave-request-form ${isSubmitting ? 'loading' : ''}`}>
        {/* Display errors */}
        {errors.length > 0 && (
          <div>
            {errors.map((error, index) => (
              <ErrorMessage key={index} message={error} />
            ))}
          </div>
        )}

        {/* Display success message */}
        <SuccessMessage message={successMessage} />

        {/* Basic Information Section */}
        <BasicInfoSection 
          formData={formData} 
          onChange={handleFieldChange} 
        />

        {/* Half Day Section */}
        <HalfDaySection 
          formData={formData} 
          onChange={handleFieldChange} 
        />

        {/* Time Section for Permission/Late */}
        <TimeSection 
          formData={formData} 
          onChange={handleFieldChange} 
        />

        {/* Compensatory Leave Section */}
        <CompoffSection 
          formData={formData} 
          onChange={handleFieldChange} 
        />

        {/* Class Section */}
        <ClassSection 
          formData={formData} 
          onChange={handleFieldChange} 
        />

        {/* Alteration Section */}
        <AlterationSection 
          formData={formData} 
          onChange={handleFieldChange} 
          onSendNotification={handleSendNotification}
          notificationStatus={notificationStatus}
          showAlterationMode={showAlterationMode}
          onMoveToAlteration={handleMoveToAlteration}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          variant="primary"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Leave Request'}
        </Button>

        {/* Reset Button */}
        <Button
          type="button"
          onClick={resetForm}
          variant="secondary"
        >
          Reset Form
        </Button>
      </form>
    </div>
  );
};

export default LeaveRequestPage;