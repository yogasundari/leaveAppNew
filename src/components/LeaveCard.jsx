// components/LeaveCard.js

import React, { useState } from 'react';
import leaveService from '../services/leaveService';

const LeaveCard = ({ leave, onViewStatus, onWithdraw, onLeaveUpdate }) => {
  const { requestId, leaveTypeName, startDate, endDate, status, reason, createdAt } = leave;
  const [withdrawing, setWithdrawing] = useState(false);

  const getStatusBadgeClass = (status) => {
    const statusClasses = {
      APPROVED: 'status-approved',
      REJECTED: 'status-rejected',
      PENDING: 'status-pending'
    };
    return `leave-status-badge ${statusClasses[status] || ''}`;
  };

  // Only show withdraw button for PENDING status
  const canWithdraw = status === 'PENDING';

  const handleWithdraw = async () => {
    if (!window.confirm(`Are you sure you want to withdraw your ${leaveTypeName} leave request?`)) {
      return;
    }

    setWithdrawing(true);
    try {
      await leaveService.withdrawLeaveRequest(requestId);
      alert('Leave request withdrawn successfully!');
      // Call parent callback to refresh data if provided
      if (onLeaveUpdate) {
        onLeaveUpdate();
      }
    } catch (error) {
      alert(`Error withdrawing leave request: ${error.message}`);
    } finally {
      setWithdrawing(false);
    }
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
        <div className="card-actions">
          <button
            onClick={() => onViewStatus(leave)}
            className="view-status-btn"
          >
            View Status
          </button>
          {canWithdraw && (
            <button
              onClick={onWithdraw || handleWithdraw}
              className="withdraw-btn"
              disabled={withdrawing}
              style={{
                marginLeft: '10px',
                backgroundColor: withdrawing ? '#6c757d' : '#dc3545',
                color: 'white',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '4px',
                cursor: withdrawing ? 'not-allowed' : 'pointer',
                opacity: withdrawing ? 0.6 : 1
              }}
            >
              {withdrawing ? 'Withdrawing...' : 'Withdraw'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaveCard;