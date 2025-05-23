// components/LeaveCard.js

import React from 'react';
import leaveService from '../services/leaveService';

const LeaveCard = ({ leave, onViewStatus }) => {
  const { requestId, leaveTypeName, startDate, endDate, status, reason, createdAt } = leave;

  const getStatusBadgeClass = (status) => {
    const statusClasses = {
      APPROVED: 'status-approved',
      REJECTED: 'status-rejected',
      PENDING: 'status-pending'
    };
    return `leave-status-badge ${statusClasses[status] || ''}`;
  };

  return (
    <div 
      className="leave-card"
      style={{ backgroundColor: leaveService.getCardBackgroundColor(status) }}
    >
      <div className="leave-card-header">
        <h3 className="leave-type-title">{leaveTypeName}</h3>
        <span className={getStatusBadgeClass(status)}>
          {status}
        </span>
      </div>
      
      <div className="leave-card-content">
        <p><strong>Period:</strong> {startDate} to {endDate}</p>
        <p><strong>Reason:</strong> {reason}</p>
      </div>
      
      <div className="leave-card-footer">
        <small className="leave-request-date">
          Requested on: {leaveService.formatDate(createdAt)}
        </small>
        <button
          onClick={() => onViewStatus(leave)}
          className="view-status-btn"
        >
          View Status
        </button>
      </div>
    </div>
  );
};

export default LeaveCard;