import React from 'react';
import '../styles/ProfileFormInput.css'; // Optional

const ProfileFormInput = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  disabled = false,
  required = false,
  options = null
}) => {
  return (
    <div className="profile-form-group">
      <label htmlFor={name} className="profile-form-label">
        {label} {required && <span className="required">*</span>}
      </label>

      {options ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className="profile-form-input"
        >
          <option value="">Select {label}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
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
      )}
    </div>
  );
};

export default ProfileFormInput;
