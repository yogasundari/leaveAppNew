// pages/LeaveStatus.js

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import leaveService from '../services/leaveService';
import '../styles/Leave.css';

const LeaveStatus = () => {
  const { requestId } = useParams();
  const [approvalStatus, setApprovalStatus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (requestId) {
      loadApprovalStatus();
    }
  }, [requestId]);

  const loadApprovalStatus = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await leaveService.getLeaveApprovalStatus(requestId);
      console.log("Approval Status Data:", data);
      setApprovalStatus(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStatusCell = (status) => {
    return (
      <span 
        className="status-cell"
        style={{ color: leaveService.getStatusColor(status) }}
      >
        {status}
      </span>
    );
  };

  const renderContent = () => {
    if (loading) {
      return <p className="loading-message">Loading status...</p>;
    }
    
    if (error) {
      return (
        <div className="error-message">
          <p>Error: {error}</p>
          <button 
            onClick={loadApprovalStatus}
            className="view-status-btn"
            style={{ marginTop: '12px' }}
          >
            Retry
          </button>
        </div>
      );
    }
    
    if (approvalStatus.length === 0) {
      return <p className="no-data-message">No approval data found.</p>;
    }

    return (
      <table className="status-table">
        <thead>
          <tr>
            <th>Level</th>
            <th>Approver ID</th>
             <th>Approver Name</th>
            <th>Status</th>
            <th>Reason</th>
            <th>Action Time</th>
          </tr>
        </thead>
        <tbody>
          {approvalStatus.map((item) => (
            <tr key={item.approvalFlowLevel}>
              <td>{item.approvalFlowLevel}</td>
               <td>{item.empId}</td>
              <td>{item.empName || '-'}</td>
              <td>{renderStatusCell(item.status)}</td>
              <td>{item.reason || '-'}</td>
              <td>{leaveService.formatDate(item.actionTimestamp)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="leave-status-container">
      <h2 className="leave-status-title">
        Leave Approval Status - Request ID: {requestId}
      </h2>
      
      {renderContent()}
    </div>
  );
};

export default LeaveStatus;