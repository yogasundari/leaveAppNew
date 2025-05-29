// components/ProfileFormInput.jsx
import React from 'react';
import '../styles/ProfileFormInput.css'; // Optional

const ProfileFormInput = ({ label, name, type = 'text', value, onChange, disabled = false, required = false }) => {
  return (
    <div className="profile-form-group">
      <label htmlFor={name} className="profile-form-label">
        {label} {required && <span className="required">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className="profile-form-input"
      />
    </div>
  );
};

export default ProfileFormInput;
