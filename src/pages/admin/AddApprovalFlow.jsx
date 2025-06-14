import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AddApprovalFlow({ onClose, onCreated }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    finalApproverId: '',
    active: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.finalApproverId.trim()) {
      alert('Name and Final Approver ID are required.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const payload = {
        name: formData.name,
        finalApprover: {
          empId: formData.finalApproverId
        },
        active: formData.active
      };

      await axios.post(
        'http://localhost:8080/api/approval-flows/create',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert('Approval Flow created successfully!');
      navigate ('/admin-panel/approvalflow'); // Redirect to approval flow management page
      if (onCreated) onCreated();
      if (onClose) onClose();
    } catch (error) {
      console.error('Failed to create approval flow:', error);
      alert('Error creating approval flow.');
    }
  };

  return (
    <div className="add-approval-flow-container">
      <h2>Add Approval Flow</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Flow Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter flow name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="finalApproverId">Final Approver ID</label>
          <input
            type="text"
            id="finalApproverId"
            name="finalApproverId"
            value={formData.finalApproverId}
            onChange={handleChange}
            placeholder="e.g., TSAI002"
            required
          />
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="active"
              checked={formData.active}
              onChange={handleChange}
            />
            Active
          </label>
        </div>

        <button type="submit">Create Approval Flow</button>
        <button type="button" onClick={onClose} style={{ marginLeft: '10px' }}>
          Cancel
        </button>
      </form>
    </div>
  );
}
