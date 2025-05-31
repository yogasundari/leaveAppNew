import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/AddApprovalFlowLevel.css'; // Assuming you have some styles

function AddApprovalFlowLevel() {
  const [formData, setFormData] = useState({
    approvalFlowId: '',
    approverId: '',
    sequence: '',
    active: false,
  });

  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    const payload = {
      approvalFlow: { approvalFlowId: parseInt(formData.approvalFlowId) },
      approver: { empId: formData.approverId },
      sequence: parseInt(formData.sequence),
      active: formData.active,
    };

    try {
      await axios.post('http://localhost:8080/api/approval-flow-levels', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Approval Flow Level added successfully!');
      navigate('/admin-panel/approvalflowlevel');
    } catch (error) {
      console.error('Failed to add Approval Flow Level:', error);
      alert('Failed to add Approval Flow Level. See console for details.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Approval Flow ID:</label>
        <input
          type="number"
          name="approvalFlowId"
          value={formData.approvalFlowId}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Approver ID:</label>
        <input
          type="text"
          name="approverId"
          value={formData.approverId}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Sequence:</label>
        <input
          type="number"
          name="sequence"
          value={formData.sequence}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Active:</label>
        <input
          type="checkbox"
          name="active"
          checked={formData.active}
          onChange={handleChange}
        />
      </div>

      <button type="submit">Add Approval Flow Level</button>
    </form>
  );
}

export default AddApprovalFlowLevel;
