// components/form/FormComponents.js
import React from 'react';

export const FormGroup = ({ children, className = '' }) => (
  <div className={`form-group ${className}`}>
    {children}
  </div>
);

export const FormLabel = ({ children, required = false }) => (
  <label className="form-label">
    {children}
    {required && <span style={{ color: '#dc3545' }}>*</span>}
  </label>
);

export const FormInput = ({ type = 'text', value, onChange, required = false, disabled = false, ...props }) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    required={required}
    disabled={disabled}
    className="form-input"
    {...props}
  />
);

export const FormSelect = ({ value, onChange, options, required = false, placeholder = '', ...props }) => (
  <select
    value={value}
    onChange={onChange}
    required={required}
    className="form-select"
    {...props}
  >
    {placeholder && <option value="">{placeholder}</option>}
    {options.map((option, index) => (
      <option key={index} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);

export const FormTextarea = ({ value, onChange, required = false, ...props }) => (
  <textarea
    value={value}
    onChange={onChange}
    required={required}
    className="form-textarea"
    {...props}
  />
);

export const RadioGroup = ({ name, value, onChange, options }) => (
  <div className="radio-group">
    {options.map((option, index) => (
      <label key={index} className="radio-option">
        <input
          type="radio"
          name={name}
          value={option.value}
          checked={value === option.value}
          onChange={onChange}
        />
        {option.label}
      </label>
    ))}
  </div>
);

export const Button = ({ type = 'button', onClick, disabled = false, variant = 'primary', children, ...props }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`btn btn-${variant}`}
    {...props}
  >
    {children}
  </button>
);

export const ErrorMessage = ({ message }) => (
  message ? <div className="error-message">{message}</div> : null
);

export const SuccessMessage = ({ message }) => (
  message ? <div className="success-message">{message}</div> : null
);

export const NotificationStatus = ({ status }) => (
  status ? <div className="notification-status">{status}</div> : null
);