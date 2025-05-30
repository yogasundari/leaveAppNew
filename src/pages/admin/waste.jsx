import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

export default function EditDepartment({ onUpdated }) {
  const { id } = useParams();  // get departmentId from route params
  const navigate = useNavigate();

  const [department, setDepartment] = useState({
    deptName: '',
    deptType: '',
    active: true,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    const fetchDepartment = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `http://localhost:8080/api/departments/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setDepartment(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch department data');
        setLoading(false);
      }
    };

    fetchDepartment();
  }, [id]);

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
      alert('Department Name and Type are required.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:8080/api/departments/${id}`,
        {
          deptName: department.deptName,
          deptType: department.deptType,
          active: department.active,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Department updated successfully!');
    
      if (onUpdated) onUpdated();

      // Navigate back or to departments list after update
      navigate('/admin-panel/department'); 
    } catch (err) {
      alert('Failed to update department');
      console.error(err);
    }
  };

  if (loading) return <p>Loading department data...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="edit-department-container">
      <h2>Edit Department</h2>
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

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="active"
              checked={department.active}
              onChange={(e) =>
                setDepartment((prev) => ({
                  ...prev,
                  active: e.target.checked,
                }))
              }
            />
            Active
          </label>
        </div>

        <button type="submit">Update Department</button>
        <button
          type="button"
          onClick={() => navigate('/admin-panel/department')}
          style={{ marginLeft: '10px' }}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}
