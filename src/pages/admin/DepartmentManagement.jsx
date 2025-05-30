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
    <div className="container">
      <h2>Department Management</h2>

      <div>
        <button onClick={handleAdd}>Add</button>
      </div>
      <table >
        <thead>
          <tr>
            <th>ID</th>
            <th>Department Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((dept) => (
            <tr key={dept.id}>
              <td>{dept.departmentId}</td>
              <td>{editId === dept.id ? (
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                ) : (
                  dept.deptName
                )}
              </td>
               <td className="p-2 border">
                <button
                  onClick={() => handleEdit(dept.departmentId)}
                  className="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(dept.departmentId)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
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
