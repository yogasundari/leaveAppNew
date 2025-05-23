// components/FormInput.js

import React from 'react';

const FormInput = ({ 
  name, 
  label, 
  value, 
  onChange, 
  disabled = false, 
  type = "text", 
  required = false,
  className = ""
}) => {
  return (
    <div className="form-group">
      <label className="form-label" htmlFor={name}>
        {label}
        {required && <span style={{ color: '#dc3545', marginLeft: '4px' }}>*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        disabled={disabled}
        onChange={onChange}
        required={required}
        className={`form-input ${required ? 'required' : ''} ${className}`}
        placeholder={disabled ? '' : `Enter ${label.toLowerCase()}`}
      />
    </div>
  );
};

export default FormInput;