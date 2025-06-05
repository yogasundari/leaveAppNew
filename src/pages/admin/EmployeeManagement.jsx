import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/EmployeeManagement.css';

function EmployeeManagement() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const res = await axios.get('http://localhost:8080/api/employees', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Full API Response:', res.data);
      setEmployees(res.data);
    } catch (err) {
      console.error('Failed to fetch employees', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    navigate('/admin-panel/employee/add');
    console.log('Add Employee');
  };

  const handleEdit = (empId) => {
    navigate(`/admin-panel/employee/edit/${empId}`);
    console.log('Edit Employee', empId);
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
      fetchEmployees(); // Refresh the list after deletion
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete employee: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleView = (empId) => {
    navigate(`/admin-panel/employee/view/${empId}`);
    console.log('View Employee', empId);
  };

  const handleActivate = async (empId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:8080/api/employees/${empId}/activate`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert(`Employee ${empId} activated successfully.`);
      fetchEmployees(); // Refresh the list
    } catch (error) {
      console.error('Activate error:', error);
      alert('Failed to activate employee: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDeactivate = async (empId) => {
    const confirmDeactivate = window.confirm(`Are you sure you want to deactivate employee ${empId}?`);
    if (!confirmDeactivate) return;

    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:8080/api/employees/${empId}/deactivate`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert(`Employee ${empId} deactivated successfully.`);
      fetchEmployees(); // Refresh the list
    } catch (error) {
      console.error('Deactivate error:', error);
      alert('Failed to deactivate employee: ' + (error.response?.data?.message || error.message));
    }
  };

  if (loading) {
    return (
      <div className="employee-management">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="employee-management">
      <div className="employee-header">
        <h1 className="employee-title">Employee Management</h1>
        <button onClick={handleAdd} className="btn-add">
          + Add Employee
        </button>
      </div>

      {employees.length === 0 ? (
        <div className="empty-state">
          <h3>No Employees Found</h3>
          <p>Start by adding your first employee to the system.</p>
          <button onClick={handleAdd} className="btn-add">
            Add First Employee
          </button>
        </div>
      ) : (
        <div className="table-container">
          <table className="employee-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Designation</th>
                <th>Department</th>
                <th>Role</th>
                <th>Approval Flow</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id}>
                  <td>
                    <span className="employee-id">{emp.empId}</span>
                  </td>
                  <td>{emp.empName}</td>
                  <td>{emp.email}</td>
                  <td>{emp.designation}</td>
                  <td>
                    <span className="department-tag">
                      {emp.department?.deptName || 'N/A'}
                    </span>
                  </td>
                  <td>
                    <span className="role-tag">{emp.role}</span>
                  </td>
                  <td>{emp.approvalFlow?.name || 'N/A'}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        onClick={() => handleEdit(emp.empId)} 
                        className="btn-action btn-edit"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(emp.empId)} 
                        className="btn-action btn-delete"
                      >
                        Delete
                      </button>
                      <button 
                        onClick={() => handleActivate(emp.empId)} 
                        className="btn-action btn-activate"
                      >
                        Activate
                      </button>
                      <button 
                        onClick={() => handleDeactivate(emp.empId)} 
                        className="btn-action btn-deactivate"
                      >
                        Deactivate
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default EmployeeManagement;