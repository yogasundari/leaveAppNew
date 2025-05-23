// pages/LeaveHistory.js

import React, { useEffect, useState } from 'react';
import leaveService from '../services/leaveService';
import LeaveCard from '../components/LeaveCard';
import StatusModal from '../components/StatusModal';
import '../styles/Leave.css';

const LeaveHistory = () => {
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [statusDetails, setStatusDetails] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusError, setStatusError] = useState(null);

  useEffect(() => {
    loadLeaveHistory();
  }, []);

  const loadLeaveHistory = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await leaveService.getLeaveHistory();
      setLeaveHistory(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewStatus = async (leave) => {
    setSelectedLeave(leave);
    setStatusDetails(null);
    setStatusError(null);
    setStatusLoading(true);

    try {
      const data = await leaveService.getLeaveApprovalStatus(leave.requestId);
      setStatusDetails(data);
    } catch (error) {
      setStatusError(error.message);
    } finally {
      setStatusLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedLeave(null);
    setStatusDetails(null);
    setStatusError(null);
  };

  const renderContent = () => {
    if (loading) {
      return <p className="loading-message">Loading leave history...</p>;
    }
    
    if (error) {
      return (
        <div className="error-message">
          <p>Error: {error}</p>
          <button 
            onClick={loadLeaveHistory}
            className="view-status-btn"
            style={{ marginTop: '12px' }}
          >
            Retry
          </button>
        </div>
      );
    }
    
    if (leaveHistory.length === 0) {
      return <p className="no-data-message">No leave history found.</p>;
    }

    return (
      <>
        {leaveHistory.map((leave) => (
          <LeaveCard 
            key={leave.requestId} 
            leave={leave} 
            onViewStatus={handleViewStatus} 
          />
        ))}
      </>
    );
  };

  return (
    <div className="leave-history-container">
      <h2 className="leave-history-title">Leave Request History</h2>
      
      {renderContent()}

      {/* Status Modal */}
      <StatusModal
        selectedLeave={selectedLeave}
        statusDetails={statusDetails}
        statusLoading={statusLoading}
        statusError={statusError}
        onClose={closeModal}
      />
    </div>
  );
};

export default LeaveHistory;