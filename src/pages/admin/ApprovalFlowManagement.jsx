import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ApprovalFlowManagement() {
  const [approvalFlows, setApprovalFlows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch all approval flows
  const fetchApprovalFlows = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/approval-flows', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setApprovalFlows(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching approval flows:', err);
      setError('Failed to load approval flows.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovalFlows();
  }, []);

  const handleDelete = async (approvalFlowId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this approval flow?');
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8080/api/approval-flows/${approvalFlowId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Approval flow deleted successfully.');
      fetchApprovalFlows();
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete approval flow.');
    }
  };

  const handleEdit = (approvalFlowId) => {
     navigate(`/admin-panel/approvalflow/edit/${approvalFlowId}`);
    console.log("Edit leave type with ID:", approvalFlowId);
    // Navigate or open modal for editing
  };

  const handleAdd = () => {
    navigate(`/admin-panel/approvalflow/add`);
    alert('Add new approval flow');
  };

  if (loading) return <p>Loading approval flows...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="approval-flow-management">
      <div className="header">
        <h2>Approval Flow Management</h2>
        <button onClick={handleAdd}>+ Add Approval Flow</button>
      </div>

      {approvalFlows.length === 0 ? (
        <p>No approval flows found.</p>
      ) : (
        <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
                <th>Id</th>
              <th>Name</th>
              <th>Final Approver</th>
              <th>Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {approvalFlows.map((flow) => (
              <tr key={flow.approvalFlowId}>
                <td>{flow.approvalFlowId}</td>
                <td>{flow.name}</td>
                <td>{flow.finalApprover?.empName}</td>
                <td>{flow.active ? 'Active' : 'Inactive'}</td>
                <td>
                  <button onClick={() => handleEdit(flow.approvalFlowId)}>Edit</button>{' '}
                  <button onClick={() => handleDelete(flow.approvalFlowId)} style={{ color: 'red' }}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
