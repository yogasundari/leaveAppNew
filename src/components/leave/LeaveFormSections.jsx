// components/leave/LeaveFormSections.js
import React from 'react';
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
  const leaveTypeOptions = [
    { value: 'CL', label: 'Casual Leave (CL)' },
    { value: 'ML', label: 'Medical Leave (ML)' },
    { value: 'EL', label: 'Earned Leave (EL)' },
    { value: 'Vacation', label: 'Vacation' },
    { value: 'Permission', label: 'Permission' },
    { value: 'Late', label: 'Late' },
    { value: 'RH', label: 'Regional Holiday (RH)' },
    { value: 'Compoff', label: 'Compensatory Leave' }
  ];

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
        <FormSelect
          value={formData.leaveType}
          onChange={(e) => onChange('leaveType', e.target.value)}
          options={leaveTypeOptions}
          required
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

export const HalfDaySection = ({ formData, onChange }) => {
  const halfDayOptions = [
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' }
  ];

  if (!['CL', 'ML', 'EL', 'Vacation', 'RH', 'Late'].includes(formData.leaveType)) {
    return null;
  }

  return (
    <FormGroup>
      <FormLabel>Is it Half Day?</FormLabel>
      <RadioGroup
        name="hasHalfDay"
        value={formData.hasHalfDay}
        onChange={(e) => onChange('hasHalfDay', e.target.value)}
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

export const ClassSection = ({ formData, onChange }) => {
  const hasClassOptions = [
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' }
  ];

  return (
    <FormGroup>
      <FormLabel>Do you have a class?</FormLabel>
      <RadioGroup
        name="hasClass"
        value={formData.hasClass}
        onChange={(e) => {
          onChange('hasClass', e.target.value);
          if (e.target.value === 'no') {
            onChange('alterationMode', '');
          }
        }}
        options={hasClassOptions}
      />
    </FormGroup>
  );
};

export const AlterationSection = ({ formData, onChange, onSendNotification, notificationStatus, showAlterationMode, onMoveToAlteration }) => {
  if (formData.hasClass !== 'yes') {
    return null;
  }

  const alterationOptions = [
    { value: 'Moodle Activity', label: 'Moodle Activity' },
    { value: 'Staff Alteration', label: 'Staff Alteration' }
  ];

  return (
    <>
      {!showAlterationMode ? (
        <FormGroup>
          <Button
            type="button"
            onClick={onMoveToAlteration}
            variant="secondary"
          >
            Move to Alteration
          </Button>
        </FormGroup>
      ) : (
        <FormGroup>
          <FormLabel required>Alteration Mode</FormLabel>
          <FormSelect
            value={formData.alterationMode}
            onChange={(e) => onChange('alterationMode', e.target.value)}
            options={alterationOptions}
            placeholder="Select Alteration Mode"
            required
          />
        </FormGroup>
      )}

      {formData.alterationMode && (
        <>
          <FormGroup>
            <FormLabel required>Class Period</FormLabel>
            <FormInput
              value={formData.classPeriod}
              onChange={(e) => onChange('classPeriod', e.target.value)}
              required
              placeholder="e.g., Period 1, Period 2-3"
            />
          </FormGroup>

          <FormGroup>
            <FormLabel required>Subject Code</FormLabel>
            <FormInput
              value={formData.subjectCode}
              onChange={(e) => onChange('subjectCode', e.target.value)}
              required
              placeholder="e.g., CSE101"
            />
          </FormGroup>

          <FormGroup>
            <FormLabel required>Subject Name</FormLabel>
            <FormInput
              value={formData.subjectName}
              onChange={(e) => onChange('subjectName', e.target.value)}
              required
              placeholder="e.g., Data Structures"
            />
          </FormGroup>
        </>
      )}

      {formData.alterationMode === 'Moodle Activity' && (
        <FormGroup>
          <FormLabel>Moodle Link</FormLabel>
          <FormInput
            type="url"
            value={formData.moodleLink}
            onChange={(e) => onChange('moodleLink', e.target.value)}
            placeholder="https://moodle.example.com/..."
          />
        </FormGroup>
      )}

      {formData.alterationMode === 'Staff Alteration' && (
        <>
          <FormGroup>
            <FormLabel required>Altered Faculty Email</FormLabel>
            <FormInput
              type="email"
              value={formData.alteredFaculty}
              onChange={(e) => onChange('alteredFaculty', e.target.value)}
              required
              placeholder="faculty@example.com"
            />
          </FormGroup>
          <Button
            type="button"
            onClick={onSendNotification}
            variant="secondary"
          >
            Send Notification to Faculty
          </Button>
          <NotificationStatus status={notificationStatus} />
        </>
      )}
    </>
  );
};