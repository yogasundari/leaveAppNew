import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LeaveRequestManagement = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

const token = localStorage.getItem('token'); 
useEffect(() => {
  axios.get('http://localhost:8080/api/leave-request/all', {
    headers: {
      Authorization: `Bearer ${token}`  
    }
  })
  .then((response) => {
    setLeaveRequests(response.data);
    setLoading(false);
  })
  .catch((err) => {
    setError('Failed to fetch leave requests');
    setLoading(false);
  });
}, []);

  if (loading) return <p>Loading leave requests...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Leave Request Management</h2>
      <table border="1" cellPadding="5" cellSpacing="0" style={{ width: '100%', textAlign: 'left' }}>
        <thead>
          <tr>
            <th>Emp ID</th>
            <th>Email</th>
            <th>Leave Type</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Reason</th>
            <th>Half Day</th>
            <th>session</th>
            <th>file Upload</th>
            <th>Status</th>
            <th>Earned Date</th>
            {/* Add other columns as needed */}
          </tr>
        </thead>
        <tbody>
          {leaveRequests.map((leave, index) => (
            <tr key={index}>
              <td>{leave.empId || '-'}</td>
              <td>{leave.email || '-'}</td>
              <td>{leave.typeName || '-'}</td>
              <td>{leave.startDate}</td>
              <td>{leave.endDate}</td>
              <td>{leave.startTime || '-'}</td>
              <td>{leave.endTime || '-'}</td>
              <td>{leave.reason}</td>
              <td>{leave.halfDay ? 'Yes' : 'No'}</td>
              <td>{leave.session || '-'}</td>
              <td>{leave.fileUpload || '-'}</td>
              <td>{leave.status || '-'}</td>
              <td>{leave.earnedDate || '-'}</td>
              {/* Add other data cells as needed */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveRequestManagement;
