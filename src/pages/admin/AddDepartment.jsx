import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AddDepartment() {
  const navigate = useNavigate();
  const [department, setDepartment] = useState({
    deptName: '',
    deptType: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDepartment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!department.deptName.trim() || !department.deptType.trim()) {
      alert('Both Department Name and Department Type are required.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:8080/api/departments/create',
        department,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Department added successfully!');
      navigate('/admin-panel/department'); // Navigate to list or another page
    } catch (err) {
      console.error(err);
      alert('Failed to add department.');
    }
  };

  return (
    <div className="add-department-container">
      <h2>Add Department</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="deptName">Department Name</label>
          <input
            type="text"
            id="deptName"
            name="deptName"
            value={department.deptName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="deptType">Department Type</label>
          <input
            type="text"
            id="deptType"
            name="deptType"
            value={department.deptType}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Add Department</button>
      </form>
    </div>
  );
}
