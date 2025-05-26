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
    leaveTypeId: 1, // Add this field
    reason: '',
    hasClass: false,
    isHalfDay: false,
    alterationType: '',
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
  const [showAlterationType, setShowAlterationType] = useState(false); // Add this state

  // Handle form field changes
  const handleFieldChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Reset alteration mode visibility when hasClass changes
    if (field === 'hasClass') {
      setShowAlterationType(false);
      if (value === false) {
        // Clear alteration-related fields when "No" is selected
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
    
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  // Handle move to alteration button click
  const handleMoveToAlteration = () => {
    setShowAlterationType(true);
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

      // Prepare clean leave request data - only send required fields
      const leaveRequestData = {
        empId: formData.empId,
        leaveTypeId: formData.leaveTypeId,
        isHalfDay: formData.isHalfDay, // Note: using 'ishalfDay' as per your requirement
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason,
        hasClass: formData.hasClass
      };

      // Add conditional fields only if they have values
      if (['Permission', 'Late'].includes(formData.leaveType) && formData.startTime) {
        leaveRequestData.startTime = formData.startTime;
      }

      if (['Permission', 'Late'].includes(formData.leaveType) && formData.endTime) {
        leaveRequestData.endTime = formData.endTime;
      }

      if (formData.leaveType === 'Compoff' && formData.earnedDate) {
        leaveRequestData.earnedDate = formData.earnedDate;
      }

      // Add class-related fields only if hasClass is true
      if (formData.hasClass === true) {
        if (formData.alterationMode) {
          leaveRequestData.alterationMode = formData.alterationMode;
        }
        if (formData.classPeriod) {
          leaveRequestData.classPeriod = formData.classPeriod;
        }
        if (formData.subjectCode) {
          leaveRequestData.subjectCode = formData.subjectCode;
        }
        if (formData.subjectName) {
          leaveRequestData.subjectName = formData.subjectName;
        }
        
        // Staff alteration specific fields
        if (formData.alterationMode === 'Staff Alteration' && formData.alteredFaculty) {
          leaveRequestData.alteredFaculty = formData.alteredFaculty;
          if (notificationStatus) {
            leaveRequestData.notificationStatus = notificationStatus;
          }
        }
        
        // Moodle activity specific fields
        if (formData.alterationMode === 'Moodle Activity' && formData.moodleLink) {
          leaveRequestData.moodleLink = formData.moodleLink;
        }
      }

      // Handle file upload separately if document exists
      if (formData.document) {
        const uploadResult = await leaveRequestService.uploadDocument(formData.document);
        leaveRequestData.documentUrl = uploadResult.url;
      }

      // Add medical file for ML leave type
      if (formData.leaveType === 'ML' && formData.document) {
        leaveRequestData.medicalFile = formData.document;
      }

      console.log('Clean leave request data being sent:', leaveRequestData);

      // Submit leave request
      const result = await leaveRequestService.createDraftLeaveRequest(leaveRequestData);
      
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
      leaveTypeId: 1,
      reason: '',
      hasClass: false,
      isHalfDay: false,
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
    setShowAlterationType(false); // Reset alteration mode visibility
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
          showAlterationType={showAlterationType}
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