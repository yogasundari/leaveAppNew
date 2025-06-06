import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LeaveBalanceManagement = () => {
  const [leaveData, setLeaveData] = useState({});
  const [editEmpCode, setEditEmpCode] = useState(null);
  const [editedData, setEditedData] = useState({});

   useEffect(() => {
    const token = localStorage.getItem('token'); // Adjust this if you store it with a different key

    axios.get('http://localhost:8080/api/leave-balance-all', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => setLeaveData(res.data))
    .catch(err => console.error(err));
  }, []);

  const handleEdit = (empCode) => {
    setEditEmpCode(empCode);
    setEditedData({ ...leaveData[empCode] }); // prefill form
  };

  const handleChange = (type, field, value) => {
    setEditedData(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: parseFloat(value)
      }
    }));
  };

const handleSave = async () => {
    const token = localStorage.getItem('token'); 
  try {
    await axios.patch(
      `http://localhost:8080/api/leave-balance/${editEmpCode}`,
      editedData,
      {
        headers: {
          Authorization: `Bearer ${token}`, 
          'Content-Type': 'application/json'
        }
      }
    );
    alert("Updated successfully!");
    setLeaveData(prev => ({ ...prev, [editEmpCode]: editedData }));
    setEditEmpCode(null);
  } catch (err) {
    alert("Error updating!");
    console.error(err);
  }
};


  return (
    <div style={{ padding: "2rem" }}>
      <h2>Employee Leave Balance (Admin Panel)</h2>
      {Object.entries(leaveData).map(([empCode, leaves]) => (
        <div key={empCode} style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
          <strong>{empCode}</strong>
          <table border="1" cellPadding="6" style={{ marginTop: "10px" }}>
            <thead>
              <tr>
                <th>Leave Type</th>
                <th>Total</th>
                <th>Used</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(leaves).map(([type, val]) => (
                <tr key={type}>
                  <td>{type}</td>
                  <td>
                    {editEmpCode === empCode ? (
                      <input
                        type="number"
                        value={editedData[type]?.total || 0}
                        onChange={(e) => handleChange(type, 'total', e.target.value)}
                      />
                    ) : val.total}
                  </td>
                  <td>
                    {editEmpCode === empCode ? (
                      <input
                        type="number"
                        value={editedData[type]?.used || 0}
                        onChange={(e) => handleChange(type, 'used', e.target.value)}
                      />
                    ) : val.used}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {editEmpCode === empCode ? (
            <div style={{ marginTop: "10px" }}>
              <button onClick={handleSave}>Save</button>
              <button onClick={() => setEditEmpCode(null)} style={{ marginLeft: "10px" }}>Cancel</button>
            </div>
          ) : (
            <button style={{ marginTop: "10px" }} onClick={() => handleEdit(empCode)}>Edit</button>
          )}
        </div>
      ))}
    </div>
  );
};

export default LeaveBalanceManagement;
