// components/leave/LeaveFormSections.js
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';    
import LeaveRequestService from '../../services/leaveRequestService';     
import {
  FormGroup,
  FormLabel,
  FormInput,
  FormSelect,
  FormTextarea,
  RadioGroup,
  Button,
  NotificationStatus
} from '../form/FormComponents';

export const BasicInfoSection = ({ formData, onChange }) => {
const [leaveTypes, setLeaveTypes] = useState([]);
  const [isLoadingLeaveTypes, setIsLoadingLeaveTypes] = useState(true);
  const [leaveTypesError, setLeaveTypesError] = useState('');
const [uploading, setUploading] = useState(false);
const [uploadError, setUploadError] = useState('');

// Fetch leave types on component mount
  useEffect(() => {
    const fetchLeaveTypes = async () => {
      try {
        setIsLoadingLeaveTypes(true);
        const types = await LeaveRequestService.getAllLeaveTypes();
        setLeaveTypes(types);
        setLeaveTypesError('');
      } catch (error) {
        console.error('Error fetching leave types:', error);
        setLeaveTypesError('Failed to load leave types');
        // Fallback to default leave types with integer IDs
      } finally {
        setIsLoadingLeaveTypes(false);
      }
    };

    fetchLeaveTypes();
  }, []);
   const selectedLeaveType = leaveTypes.find((lt) => lt.value === formData.leaveTypeId);
   
  return (
    <>
      <FormGroup>
        <FormLabel>Employee ID</FormLabel>
        <FormInput value={formData.empId} disabled />
      </FormGroup>

      <FormGroup>
        <FormLabel required>Start Date</FormLabel>
        <FormInput
          type="date"
          value={formData.startDate}
          onChange={(e) => onChange('startDate', e.target.value)}
          required
        />
      </FormGroup>

      <FormGroup>
        <FormLabel required>End Date</FormLabel>
        <FormInput
          type="date"
          value={formData.endDate}
          onChange={(e) => onChange('endDate', e.target.value)}
          required
        />
      </FormGroup>
      
      <FormGroup>
        <FormLabel required>Leave Type</FormLabel>
        {leaveTypesError && (
          <div className="error-message" style={{ color: 'red', fontSize: '12px', marginBottom: '5px' }}>
            {leaveTypesError}
          </div>
        )}
        <FormSelect
          value={formData.leaveTypeId ?? ''}
          onChange={(e) => onChange('leaveTypeId', Number(e.target.value))}
          options={leaveTypes}
          required
          disabled={isLoadingLeaveTypes}
          placeholder={isLoadingLeaveTypes ? "Loading leave types..." : "Select Leave Type"}
        />
      </FormGroup>

      {/* Conditional fields based on leave type */}
      {selectedLeaveType?.label === 'comp off' && (
        <FormGroup>
          <FormLabel required>Earned Date</FormLabel>
          <FormInput
            type="date"
            value={formData.earnedDate}
            onChange={(e) => onChange('earnedDate', e.target.value)}
            required
          />
        </FormGroup>
      )}

      {['Permission', 'Late'].includes(selectedLeaveType?.label) && (
        <>
          <FormGroup>
            <FormLabel required>Start Time</FormLabel>
            <FormInput
              type="time"
              value={formData.startTime}
              onChange={(e) => onChange('startTime', e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup>
            <FormLabel required>End Time</FormLabel>
            <FormInput
              type="time"
              value={formData.endTime}
              onChange={(e) => onChange('endTime', e.target.value)}
              required
            />
          </FormGroup>
        </>
      )}
<FormGroup>
  <FormLabel>Upload Document</FormLabel>

  {/* File Input */}
  <FormInput
    type="file"
    onChange={(e) => onChange('fileUpload', e.target.files[0])}
  />

  {/* Display selected file name */}
  {formData.fileUpload && (
    <div style={{ marginTop: '5px', fontSize: '14px', color: '#666' }}>
      Selected: {formData.documentFile.name} ({(formData.documentFile.size / 1024).toFixed(1)} KB)
    </div>
  )}

  {/* Display uploaded file URL if available */}
  {formData.fileUpload && (
    <div style={{ marginTop: '5px', fontSize: '14px', color: 'green' }}>
      ✓ File uploaded successfully
    </div>
  )}

  {/* Upload Button */}
  <button
    type="button"
    disabled={uploading || !formData.documentFile}
    onClick={async () => {
      if (!formData.documentFile) {
        alert('Please select a file before uploading.');
        return;
      }

      setUploading(true);
      setUploadError('');

      try {
        // Use your existing service method
        const uploadedUrl = await LeaveRequestService.uploadDocument(formData.documentFile);
        
        console.log('Upload successful, URL:', uploadedUrl);
        
        // Store the URL in formData
        onChange('fileUpload', uploadedUrl);

        alert('Document uploaded successfully!');
      } catch (error) {
        console.error('Upload failed:', error);
        setUploadError('Failed to upload document. Please try again.');
      } finally {
        setUploading(false);
      }
    }}
  >
    {uploading ? 'Uploading...' : 'Upload Document'}
  </button>

  {/* Upload error message */}
  {uploadError && <div style={{ color: 'red', marginTop: '5px' }}>{uploadError}</div>}
</FormGroup>


      <FormGroup>
        <FormLabel required>Reason</FormLabel>
        <FormTextarea
          value={formData.reason}
          onChange={(e) => onChange('reason', e.target.value)}
          required
          placeholder="Please provide the reason for your leave..."
        />
      </FormGroup>
    </>
  );
};
export const ClassSection = ({ formData, onChange, onMoveToAlteration }) => {
  const hasClassOptions = [
    { value: true, label: 'Yes' },
    { value: false, label: 'No' }
  ];
const navigate = useNavigate();

 const handleGoToAlteration = async () => {
    try {
      // Call API to save draft leave request
      await LeaveRequestService.createDraftLeaveRequest(formData);

      // After successful save, redirect to alteration page
      navigate('/alteration');
    } catch (error) {
      console.error('Failed to save draft leave request:', error);
      alert('Failed to save draft. Please try again.');
    }
  };
  return (
    <FormGroup>
      <FormLabel>Do you have a class?</FormLabel>
      <RadioGroup
        name="hasClass"
        value={formData.hasClass}
        onChange={(e) => {
          const boolValue = e.target.value === 'true';
          onChange('hasClass', boolValue);
          if (!boolValue) {
            onChange('alterationMode', '');
          }
        }}
        options={hasClassOptions}
      />
      {formData.hasClass && (
        <button type="button" onClick={handleGoToAlteration}>
          Move to Alteration
        </button>
      )}
    </FormGroup>
  );
};
// LeaveFormSections.jsx (or wherever you're defining it)

export const HalfDaySection = ({ formData, onChange }) => {
  const halfDayOptions = [
    { value: true, label: 'Yes' },
    { value: false, label: 'No' }
  ];

  const sessionOptions = [
    { value: 'FN', label: 'Forenoon (FN)' },
    { value: 'AN', label: 'Afternoon (AN)' }
  ];

  return (
    <>
      <FormGroup>
        <FormLabel required>Is this a Half Day?</FormLabel>
        <RadioGroup
          name="halfDay"
          value={formData.halfDay}
          onChange={(e) => {
            const boolValue = e.target.value === 'true';
            onChange('halfDay', boolValue);
            if (!boolValue) {
              onChange('session', ''); // Clear session if not half-day
            }
          }}
          options={halfDayOptions}
        />
      </FormGroup>

      {formData.halfDay && (
        <FormGroup>
          <FormLabel required>Session</FormLabel>
          <FormSelect
            value={formData.session || ''}
            onChange={(e) => onChange('session', e.target.value)}
            options={sessionOptions}
            required
            placeholder="Select Session"
          />
        </FormGroup>
      )}
    </>
  );
};



export const TimeSection = ({ formData, onChange }) => {
  if (!['Late', 'Permission'].includes(formData.leaveType)) {
    return null;
  }

  return (
    <div className="time-inputs">
      <FormGroup>
        <FormLabel required>Start Time</FormLabel>
        <FormInput
          type="time"
          value={formData.startTime}
          onChange={(e) => onChange('startTime', e.target.value)}
          required
        />
      </FormGroup>
      <FormGroup>
        <FormLabel required>End Time</FormLabel>
        <FormInput
          type="time"
          value={formData.endTime}
          onChange={(e) => onChange('endTime', e.target.value)}
          required
        />
      </FormGroup>
    </div>
  );
};

export const CompoffSection = ({ formData, onChange }) => {
  if (formData.leaveType !== 'comp off') {
    return null;
  }

  return (
    <FormGroup>
      <FormLabel required>Earned Date</FormLabel>
      <FormInput
        type="date"
        value={formData.earnedDate}
        onChange={(e) => onChange('earnedDate', e.target.value)}
        required
      />
    </FormGroup>
  );
};



