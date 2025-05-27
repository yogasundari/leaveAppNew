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

  // Debug: Log status information
  console.log('Leave ID:', requestId, 'Status:', status, 'Type:', typeof status);

  const cardStyle = {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '15px',
    marginBottom: '15px',
    backgroundColor:
      status === 'APPROVED' || status === 'approved'
        ? '#e6f4ea'
        : status === 'REJECTED' || status === 'rejected'
        ? '#fdecea'
        : status === 'WITHDRAWN' || status === 'withdrawn'
        ? '#f0f0f0'
        : '#fffbe6',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  };

  const statusColor = {
    APPROVED: 'green',
    REJECTED: 'red',
    PENDING: 'orange',
    WITHDRAWN: 'gray',
    approved: 'green',
    rejected: 'red',
    pending: 'orange',
    withdrawn: 'gray',
  };

  const buttonStyle = {
    marginTop: '10px',
    padding: '6px 12px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  };

  // Check if status is pending (case-insensitive)
  const isPending = status?.toString().toLowerCase() === 'pending';

  return (
    <div style={cardStyle}>
      <h3>
        <strong>Leave Type:</strong> {leaveTypeName}
        <span style={{ color: statusColor[status] || 'orange', marginLeft: '10px' }}>
          ({status})
        </span>
      </h3>
      <p><strong>Period:</strong> {startDate} to {endDate}</p>
      <p><strong>Reason:</strong> {reason}</p>
      <small>Requested on: {formatDate(createdAt)}</small>
      
      {/* Debug info - remove this after fixing the issue */}
      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '5px',
        margin: '10px 0',
        borderRadius: '3px',
        fontSize: '12px',
        color: '#6c757d'
      }}>
        Debug: Status = "{status}" | Type = {typeof status} | Is Pending = {isPending ? 'YES' : 'NO'}
      </div>
      
      <br />
      <button onClick={() => onViewStatus(leave)} style={buttonStyle}>View Status</button>

      {/* More robust pending check */}
      {isPending && (
        <button
          onClick={() => onWithdraw(requestId)}
          style={{
            ...buttonStyle,
            backgroundColor: '#dc3545',
            marginLeft: '10px'
          }}
        >
          Withdraw
        </button>
      )}
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

  useEffect(() => {
    // Using in-memory storage instead of localStorage for demo
    const token = 'demo-token'; // Replace with actual token logic
    
    // Simulate API call with sample data for demonstration
    setTimeout(() => {
      const sampleData = [
        {
          requestId: 1,
          leaveTypeName: 'Annual Leave',
          startDate: '2024-01-15',
          endDate: '2024-01-20',
          status: 'PENDING',
          reason: 'Family vacation',
          createdAt: '2024-01-10T10:30:00Z'
        },
        {
          requestId: 2,
          leaveTypeName: 'Sick Leave',
          startDate: '2024-01-08',
          endDate: '2024-01-10',
          status: 'APPROVED',
          reason: 'Medical appointment',
          createdAt: '2024-01-05T09:15:00Z'
        },
        {
          requestId: 3,
          leaveTypeName: 'Personal Leave',
          startDate: '2024-01-25',
          endDate: '2024-01-26',
          status: 'pending', // lowercase to test case sensitivity
          reason: 'Personal matters',
          createdAt: '2024-01-20T14:45:00Z'
        }
      ];
      
      setLeaveHistory(sampleData);
      setLoading(false);
    }, 1000);

    // Uncomment and modify this for actual API call:
    /*
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
        console.log('API Response:', data); // Debug: Check what data you're getting
        setLeaveHistory(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
    */
  }, []);

  const handleViewStatus = (leave) => {
    setSelectedLeave(leave);
    setStatusDetails(null);
    setStatusError(null);
    setStatusLoading(true);

    // Simulate status details for demo
    setTimeout(() => {
      const sampleStatus = [
        {
          empId: 'EMP001',
          status: 'PENDING',
          reason: 'Awaiting approval',
          actionTimestamp: '2024-01-10T10:30:00Z'
        }
      ];
      setStatusDetails(sampleStatus);
      setStatusLoading(false);
    }, 500);

    // Uncomment for actual API call:
    /*
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
    */
  };

  const handleWithdraw = (requestId) => {
    console.log('Withdrawing leave with ID:', requestId);
    
    // Simulate withdraw API call
    setTimeout(() => {
      setLeaveHistory((prev) =>
        prev.map((leave) =>
          leave.requestId === requestId
            ? { ...leave, status: 'WITHDRAWN' }
            : leave
        )
      );
      alert('Leave request withdrawn successfully!');
    }, 500);

    // Uncomment for actual API call:
    /*
    const token = localStorage.getItem('token');

    fetch(`http://localhost:8080/api/leave-request/withdraw/${requestId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to withdraw leave');
        return res.json();
      })
      .then(() => {
        setLeaveHistory((prev) =>
          prev.map((leave) =>
            leave.requestId === requestId
              ? { ...leave, status: 'WITHDRAWN' }
              : leave
          )
        );
        alert('Leave request withdrawn successfully!');
      })
      .catch((err) => {
        alert('Error withdrawing leave: ' + err.message);
      });
    */
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
      {leaveHistory.map((leave) => (
        <LeaveCard
          key={leave.requestId}
          leave={leave}
          onViewStatus={handleViewStatus}
          onWithdraw={handleWithdraw}
        />
      ))}

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
                    let dotColor = '#ffa500';
                    if (item.status === 'APPROVED') dotColor = 'green';
                    else if (item.status === 'REJECTED') dotColor = 'red';

                    return (
                      <div key={idx} style={{ position: 'relative', marginBottom: idx === statusDetails.length - 1 ? 0 : '40px' }}>
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