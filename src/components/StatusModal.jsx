// components/StatusModal.js

import React from 'react';
import leaveService from '../services/leaveService';

const StatusModal = ({ 
  selectedLeave, 
  statusDetails, 
  statusLoading, 
  statusError, 
  onClose 
}) => {
  if (!selectedLeave) return null;

  const TimelineItem = ({ item, index }) => {
    const statusColor = leaveService.getStatusColor(item.status);
    
    return (
      <div className="timeline-item">
        <span 
          className="timeline-dot"
          style={{ 
            backgroundColor: statusColor,
            color: statusColor 
          }}
        />
        <div className="timeline-content">
          <p className="approver-id">Approver ID: {item.empId}</p>
          <p className="status" style={{ color: statusColor }}>
            Status: {item.status}
          </p>
          <p className="reason">Reason: {item.reason || '-'}</p>
          <p className="timestamp">
            Action Time: {leaveService.formatDate(item.actionTimestamp)}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Status Details</h3>
        </div>
        
        <div className="modal-body">
          <p><strong>Leave Type:</strong> {selectedLeave.leaveTypeName}</p>
          <p><strong>Period:</strong> {selectedLeave.startDate} to {selectedLeave.endDate}</p>
          <p>
            <strong>Status:</strong> 
            <span 
              style={{ 
                color: leaveService.getStatusColor(selectedLeave.status),
                fontWeight: 'bold',
                marginLeft: '8px'
              }}
            >
              {selectedLeave.status}
            </span>
          </p>
          <p><strong>Reason:</strong> {selectedLeave.reason}</p>
          <p><strong>Applied On:</strong> {leaveService.formatDate(selectedLeave.createdAt)}</p>
          
          <hr className="modal-divider" />
          
          {statusLoading && (
            <p className="loading-message">Loading status tracking...</p>
          )}
          
          {statusError && (
            <p className="error-message">Error: {statusError}</p>
          )}
          
          {statusDetails && statusDetails.length > 0 && (
            <div className="tracking-section">
              <h4 className="tracking-title">Approval Tracking</h4>
              <div className="timeline">
                {statusDetails.map((item, index) => (
                  <TimelineItem key={index} item={item} index={index} />
                ))}
              </div>
            </div>
          )}
          
          {statusDetails && statusDetails.length === 0 && (
            <p className="no-data-message">No approval tracking data available.</p>
          )}
        </div>
        
        <div className="modal-footer">
          <button onClick={onClose} className="close-btn">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusModal;