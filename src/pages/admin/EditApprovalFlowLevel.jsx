import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';  // 1. Import useParams
import { useNavigate } from 'react-router-dom'; // 2. Import useNavigate


function EditApprovalFlowLevel() {
  const { id } = useParams();  // 2. Extract id from route params
  const navigate = useNavigate(); // 3. Use navigate for redirection

  const [formData, setFormData] = useState({
    approvalFlowId: '',
    approverId: '',
    sequence: '',
    active: false,
  });

  useEffect(() => {
    if (!id) return;  // Avoid running if no id

    const token = localStorage.getItem('token');
    axios.get(`http://localhost:8080/api/approval-flow-levels/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        setFormData({
          approvalFlowId: response.data.approvalFlowId,
          approverId: response.data.approverId,
          sequence: response.data.sequence,
          active: response.data.active,
        });
      })
      .catch(error => {
        console.error('Failed to fetch Approval Flow Level:', error);
      });
  }, [id]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    axios.put(`http://localhost:8080/api/approval-flow-levels/${id}`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(() => {
      alert('Approval Flow Level updated successfully!');
      navigate('/admin-panel/approvalflowlevel');
    })
    .catch(error => {
      console.error('Failed to update:', error);
      alert('Update failed, see console for details.');
    });
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
          type="text"
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

      <button type="submit">Update Approval Flow Level</button>
    </form>
  );
}

export default EditApprovalFlowLevel;
