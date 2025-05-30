import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function EditLeaveType() {
  const { id } = useParams(); // LeaveType ID from route params
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    leaveTypeId: '',
    typeName: '',
    maxAllowedPerYear: '',
    maxAllowedPerMonth: '',
    minAllowedDays: '',
    academicYearStart: '',
    academicYearEnd: '',
    canBeCarriedForward: false,
    maxCarryForward: '',
    active: true
  });

  useEffect(() => {
    // Fetch leave type by ID
    axios.get(`http://localhost:8080/api/leave-types/${id}`)
      .then(res => {
        setFormData(res.data);
      })
      .catch(err => {
        console.error('Error fetching leave type:', err);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormData(prev => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:8080/api/leave-types/${id}`, formData,
         { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(formData);
      alert('Leave type updated successfully');
      navigate('/admin-panel/leave-type'); // or any redirect route
    } catch (err) {
      console.error('Error updating leave type:', err);
      alert('Failed to update leave type');
    }
  };

  return (
    <div className="edit-leave-type-container">
      <h1>Edit Leave Type</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="typeName">Leave Type Name</label>
          <input
            type="text"
            id="typeName"
            name="typeName"
            value={formData.typeName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="maxAllowedPerYear">Max Allowed Per Year</label>
          <input
            type="number"
            id="maxAllowedPerYear"
            name="maxAllowedPerYear"
            value={formData.maxAllowedPerYear}
            onChange={handleChange}
          />
        </div>


        <div className="form-group">
          <label htmlFor="academicYearStart">Academic Year Start</label>
          <input
            type="date"
            id="academicYearStart"
            name="academicYearStart"
            value={formData.academicYearStart}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="academicYearEnd">Academic Year End</label>
          <input
            type="date"
            id="academicYearEnd"
            name="academicYearEnd"
            value={formData.academicYearEnd}
            onChange={handleChange}
          />
        </div>


        <div className="form-group">
          <label htmlFor="active">Active</label>
          <input
            type="checkbox"
            id="active"
            name="active"
            checked={formData.active}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}
