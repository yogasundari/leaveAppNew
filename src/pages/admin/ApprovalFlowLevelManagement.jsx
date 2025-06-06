import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ApprovalFlowLevelManagement() {
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch active approval flow levels
  const fetchLevels = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/approval-flow-levels/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLevels(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching approval flow levels:', err);
      setError('Failed to load approval flow levels.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLevels();
  }, []);

  // Delete an approval flow level
  const handleDelete = async (levelId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this approval flow level?');
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8080/api/approval-flow-levels/${levelId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Approval flow level deleted successfully.');
      fetchLevels();
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete approval flow level.');
    }
  };

  // Navigate to edit page
  const handleEdit = (flowLevelId) => {
    navigate(`/admin-panel/approvalflowlevel/edit/${flowLevelId}`);
    console.log("Edit approval flow level with ID:", flowLevelId);
  };

  // Navigate to add page
  const handleAdd = () => {
    navigate(`/admin-panel/approvalflowlevel/add`);
    alert('Add new approval flow');
  };

  if (loading) return <p>Loading approval flow levels...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="approval-flow-level-management">
      <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Approval Flow Level Management</h2>
        <button onClick={handleAdd}>+ Add Approval Flow Level</button>
      </div>

      {levels.length === 0 ? (
        <p>No approval flow levels found.</p>
      ) : (
        <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20 }}>
          <thead>
            <tr>
              <th>FlowlevelId</th>
              <th>FlowID</th>
              <th>Sequence</th>
              <th>Approver</th>
              <th>Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {levels.map((level) => (
              <tr key={level.flowLevelId}>
                <td>{level.flowLevelId}</td>
                <td>{level.approvalFlowId}</td>
                 <td>{level.sequence}</td>
                <td>{level.approverId}</td>
              <td>{level.active ? 'Active' : 'Inactive'}</td>
                <td>
                  <button onClick={() => handleEdit(level.flowLevelId)}>Edit</button>{' '}
                  <button onClick={() => handleDelete(level.flowLevelId)} style={{ color: 'red' }}>
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
