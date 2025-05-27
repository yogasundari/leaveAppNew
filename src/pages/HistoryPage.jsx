import React, { useEffect, useState } from 'react';

// Utility function to format dates
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// LeaveCard component
function LeaveCard({ leave, onViewStatus, onWithdraw }) {
  const { requestId, leaveTypeName, startDate, endDate, status, reason, createdAt } = leave;

  const cardStyle = {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '15px',
    marginBottom: '15px',
    backgroundColor:
      status === 'APPROVED'
        ? '#e6f4ea'
        : status === 'REJECTED'
        ? '#fdecea'
        : '#fffbe6',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  };

  const statusColor = {
    APPROVED: 'green',
    REJECTED: 'red',
    PENDING: 'orange',
  };

  // Only show withdraw button for PENDING status
  const canWithdraw = status === 'PENDING';

  return (
    <div style={cardStyle}>
      <h3>
        <strong>Leave Type:</strong> {leaveTypeName}
        <span style={{ color: statusColor[status], marginLeft: '10px' }}>
          ({status})
        </span>
      </h3>
      <p><strong>Period:</strong> {startDate} to {endDate}</p>
      <p><strong>Reason:</strong> {reason}</p>
      <small>Requested on: {formatDate(createdAt)}</small>
      <br />
      <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
        <button
          onClick={() => onViewStatus(leave)}
          style={{
            padding: '6px 12px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          View Status
        </button>
        {canWithdraw && (
          <button
            onClick={() => onWithdraw(leave)}
            style={{
              padding: '6px 12px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Withdraw
          </button>
        )}
      </div>
    </div>
  );
}

export default function HistoryPage() {
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [statusDetails, setStatusDetails] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusError, setStatusError] = useState(null);
  const [withdrawing, setWithdrawing] = useState(false);

  useEffect(() => {
    loadLeaveHistory();
  }, []);

  const loadLeaveHistory = () => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:8080/api/leave-request/leave-history', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load leave history');
        return res.json();
      })
      .then((data) => {
        setLeaveHistory(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  const handleViewStatus = (leave) => {
    setSelectedLeave(leave);
    setStatusDetails(null);
    setStatusError(null);
    setStatusLoading(true);

    const token = localStorage.getItem('token');
    fetch(`http://localhost:8080/api/leave-approval/status/${leave.requestId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch status details');
        return res.json();
      })
      .then((data) => {
        setStatusDetails(data);
        setStatusLoading(false);
      })
      .catch((err) => {
        setStatusError(err.message);
        setStatusLoading(false);
      });
  };

  const handleWithdraw = (leave) => {
    if (!window.confirm(`Are you sure you want to withdraw your ${leave.leaveTypeName} leave request?`)) {
      return;
    }

    setWithdrawing(true);
    const token = localStorage.getItem('token');
    
    fetch(`http://localhost:8080/api/leave-request/withdraw/${leave.requestId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to withdraw leave request');
        return res.text(); // Use text() in case response is empty
      })
      .then(() => {
        alert('Leave request withdrawn successfully!');
        // Reload the leave history to reflect the changes
        loadLeaveHistory();
      })
      .catch((err) => {
        alert(`Error withdrawing leave request: ${err.message}`);
      })
      .finally(() => {
        setWithdrawing(false);
      });
  };

  const closeModal = () => {
    setSelectedLeave(null);
    setStatusDetails(null);
    setStatusError(null);
  };

  if (loading) return <p>Loading leave history...</p>;
  if (error) return <p>Error: {error}</p>;
  if (leaveHistory.length === 0) return <p>No leave history found.</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Leave Request History</h2>
      {withdrawing && (
        <div style={{ 
          position: 'fixed', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'rgba(0,0,0,0.8)', 
          color: 'white', 
          padding: '20px', 
          borderRadius: '8px',
          zIndex: 1001
        }}>
          Processing withdrawal...
        </div>
      )}
      {leaveHistory.map((leave) => (
        <LeaveCard 
          key={leave.requestId} 
          leave={leave} 
          onViewStatus={handleViewStatus}
          onWithdraw={handleWithdraw}
        />
      ))}

      {/* Modal */}
      {selectedLeave && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000
          }}
        >
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '10px',
            width: '450px',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
          }}>
            <h3>Status Details</h3>
            <p><strong>Leave Type:</strong> {selectedLeave.leaveTypeName}</p>
            <p><strong>Period:</strong> {selectedLeave.startDate} to {selectedLeave.endDate}</p>
            <p><strong>Status:</strong> {selectedLeave.status}</p>
            <p><strong>Reason:</strong> {selectedLeave.reason}</p>
            <p><strong>Applied On:</strong> {formatDate(selectedLeave.createdAt)}</p>

            <hr />

            {statusLoading && <p>Loading status tracking...</p>}
            {statusError && <p style={{ color: 'red' }}>Error: {statusError}</p>}

            {statusDetails && (
              <div>
                <h4>Approval Tracking</h4>
                <div style={{ position: 'relative', marginLeft: '20px', paddingLeft: '20px', borderLeft: '3px solid #ddd' }}>
                  {statusDetails.map((item, idx) => {
                    // Determine color based on status
                    let dotColor = '#ffa500'; // default orange for pending
                    if (item.status === 'APPROVED') dotColor = 'green';
                    else if (item.status === 'REJECTED') dotColor = 'red';

                    return (
                      <div key={idx} style={{ position: 'relative', marginBottom: idx === statusDetails.length - 1 ? 0 : '40px' }}>
                        {/* Dot */}
                        <span
                          style={{
                            position: 'absolute',
                            left: '-12px',
                            top: '0',
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            backgroundColor: dotColor,
                            border: '3px solid white',
                            boxShadow: '0 0 0 2px ' + dotColor,
                          }}
                        ></span>

                        {/* Content */}
                        <div style={{ paddingLeft: '10px' }}>
                          <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>Approver ID: {item.empId}</p>
                          <p style={{ margin: '0 0 3px 0' }}>
                            Status: <span style={{ color: dotColor, fontWeight: 'bold' }}>{item.status}</span>
                          </p>
                          <p style={{ margin: '0 0 3px 0' }}>Reason: {item.reason || '-'}</p>
                          <p style={{ margin: 0, fontSize: '0.85em', color: '#555' }}>
                            Action Time: {formatDate(item.actionTimestamp)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <button
              onClick={closeModal}
              style={{
                marginTop: '15px',
                padding: '8px 16px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}