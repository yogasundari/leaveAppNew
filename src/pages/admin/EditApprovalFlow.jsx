import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

export default function EditApprovalFlow() {
  const { id } = useParams(); // get id from route params
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    finalApproverId: '',
    active: true,
  });

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFlowAndEmployees = async () => {
      try {
        const token = localStorage.getItem('token');
        const [flowRes, employeeRes] = await Promise.all([
          axios.get(`http://localhost:8080/api/approval-flows/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`http://localhost:8080/api/employees`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const flow = flowRes.data;
        setFormData({
          name: flow.name || '',
          finalApproverId: flow.finalApprover?.empId || '',
          active: flow.active,
        });

        setEmployees(employeeRes.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch approval flow or employee list');
        setLoading(false);
      }
    };

    fetchFlowAndEmployees();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:8080/api/approval-flows/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Approval flow updated successfully');
      navigate('/admin-panel/approvalflow'); // redirect to list page
    } catch (err) {
      console.error(err);
      alert('Failed to update approval flow');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="edit-approval-flow-container">
      <h2>Edit Approval Flow</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Flow Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
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
    placeholder="Enter employee ID (e.g., TSAI003)"
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

        <button type="submit">Update Flow</button>
        <button type="button" onClick={() => navigate(-1)} style={{ marginLeft: '10px' }}>
          Cancel
        </button>
      </form>
    </div>
  );
}
