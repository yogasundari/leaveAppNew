import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function EmployeeManagement() {
  const [employees, setEmployees] = useState([]);
const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

const fetchEmployees = async () => {
  try {
    const token = localStorage.getItem('token'); // or whatever key you used

    const res = await axios.get('http://localhost:8080/api/employees', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('Full API Response:', res.data);
    setEmployees(res.data); // adjust if response is nested (e.g., res.data.employees)
  } catch (err) {
    console.error('Failed to fetch employees', err);
  }
};


  const handleAdd = () => {
    // Redirect to add employee page or open a modal
    console.log('Add Employee');
  };

  const handleEdit = (empId) => {
    navigate(`/admin-panel/employee/edit/${empId}`);
    console.log('Edit Employee', id);
  };

const handleDelete = async (empId) => {
  const confirmDelete = window.confirm(`Are you sure you want to delete employee ${empId}? This action cannot be undone.`);
  if (!confirmDelete) return;

  try {
    const token = localStorage.getItem('token');
    await axios.delete(`http://localhost:8080/api/employees/${empId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    alert(`Employee ${empId} deleted successfully.`);
  } catch (error) {
    console.error('Delete error:', error);
    alert('Failed to delete employee: ' + (error.response?.data?.message || error.message));
  }
};

  const handleView = (empId) => {
    console.log('View Employee', empId);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Employees</h1>
        <button onClick={handleAdd} className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Employee
        </button>
      </div>
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Designation</th>
            <th className="border p-2">Department</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Approval Flow</th>
            <th className="border p-2">Actions</th>
  </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              <td className="border p-2">{emp.empId}</td>
              <td className="border p-2">{emp.empName}</td>
              <td className="border p-2">{emp.email}</td>
              <td className="border p-2">{emp.designation}</td>
              <td className="border p-2">{emp.department?.name}</td>
              <td className="border p-2">{emp.role}</td>
                        <th className="border p-2">{emp.approvalFlow?.name}</th>
              <td className="border p-2 space-x-2">
                <button onClick={() => handleEdit(emp.empId)} className="bg-yellow-400 px-2 py-1 rounded">
                  Edit
                </button>
                <button onClick={() => handleDelete(emp.empId)} className="bg-red-500 text-white px-2 py-1 rounded">
                  Delete
                </button>
                <button onClick={() => handleView(emp.empId)} className="bg-green-500 text-white px-2 py-1 rounded">
                  View
                </button>
                <button onClick={() => handleActivate(emp.empId)} className="bg-green-500 text-white px-2 py-1 rounded">
                  Activate
                </button>
                <button onClick={() => handleActivate(emp.empId)} className="bg-green-500 text-white px-2 py-1 rounded">
                  Deactivate
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeeManagement;
