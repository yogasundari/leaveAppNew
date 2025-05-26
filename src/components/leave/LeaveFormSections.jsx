// components/leave/LeaveFormSections.js
import React from 'react';
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
        setLeaveTypes([
          { value: 1, label: 'Casual Leave (CL)' },
          { value: 2, label: 'Medical Leave (ML)' },
          { value: 3, label: 'Earned Leave (EL)' },
          { value: 4, label: 'Vacation' },
          { value: 5, label: 'Permission' },
          { value: 6, label: 'Late' },
          { value: 7, label: 'Regional Holiday (RH)' },
          { value: 8, label: 'Compensatory Leave' }
        ]);
      } finally {
        setIsLoadingLeaveTypes(false);
      }
    };

    fetchLeaveTypes();
  }, []);
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
    value={formData.leaveTypeId ?? ''}  // Ensure value is not undefined
    onChange={(e) => onChange('leaveTypeId', Number(e.target.value))}  // Explicitly convert to number
    options={leaveTypes}  // Should be array like [{ value: 1, label: 'Casual Leave (CL)' }, ...]
    required
    disabled={isLoadingLeaveTypes}
    placeholder={isLoadingLeaveTypes ? "Loading leave types..." : "Select Leave Type"}
  />
</FormGroup>
      <FormGroup>
        <FormLabel>Upload Document</FormLabel>
        <FormInput
          type="file"
          onChange={(e) => onChange('document', e.target.files[0])}
        />
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
        <button type="button" onClick={onMoveToAlteration}>
          Move to Alteration
        </button>
      )}
    </FormGroup>
  );
};
// LeaveFormSections.jsx (or wherever you're defining it)

export const HalfDaySection = ({ formData, onChange }) => {
  const halfDayOptions = [
    { value: true, label: 'yes' },
    { value: false, label: 'no' }
  ];

  return (
    <FormGroup>
      <FormLabel>Select Half Day Type</FormLabel>
      <RadioGroup
        name="halfDayType"
        value={formData.halfDayType}
        onChange={(e) => {
          const boolValue = e.target.value === true;
          onChange('halfDayType', boolValue);
        }}
        options={halfDayOptions}
      />
    </FormGroup>
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
  if (formData.leaveType !== 'Compoff') {
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




