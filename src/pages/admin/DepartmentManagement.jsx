import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function DepartmentManagement() {
  const [departments, setDepartments] = useState([]);
  const [newDepartmentName, setNewDepartmentName] = useState('');
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  // Fetch departments on load
  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/departments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDepartments(res.data);
    } catch (err) {
      console.error('Error fetching departments:', err);
    }
  };
  const handleEdit = (departmentId) => {
     navigate(`/admin-panel/department/edit/${departmentId}`);
    console.log("Edit leave type with ID:", departmentId);
    // Navigate or open modal for editing
  };
  const handleAdd = async () => {
navigate(`/admin-panel/department/add`);
  };



  return (
  <div className="department-management">
    <div className="department-header">
      <h2 className="department-title">Department Management</h2>
      <button className="btn-add-department" onClick={handleAdd}>
        Add
      </button>
    </div>

    <table className="department-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Department Name</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {departments.map((dept) => (
          <tr key={dept.departmentId}>
            <td>{dept.departmentId}</td>
            <td>{dept.deptName}</td>
            <td>
              <button
                onClick={() => handleEdit(dept.departmentId)}
                className="btn-edit"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(dept.departmentId)}
                className="btn-delete"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

}
