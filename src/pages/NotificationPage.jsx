import React, { useEffect, useState } from 'react';
import notificationService from '../services/NotificationService';

function NotificationItem({ message, onApprove, onReject }) {
  const match = message.match(/\(ID:\s*(\d+)\)/);
  const alterationId = match ? match[1] : null;

  return (
    <div style={{
      border: '1px solid #ccc',
      padding: '10px',
      margin: '10px 0',
      borderRadius: '5px',
      backgroundColor: '#f9f9f9'
    }}>
      <p>{message}</p>
      {alterationId && (
        <div>
          <button onClick={() => onApprove(alterationId)} style={{ marginRight: '10px' }}>Approve</button>
          <button onClick={() => onReject(alterationId)}>Reject</button>
        </div>
      )}
    </div>
  );
}

function NotificationPage({ empId }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = () => {
    notificationService.getNotifications(empId)
      .then(data => {
        setNotifications(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load notifications.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchNotifications();
  }, [empId]);

const handleApprove = async (id) => {
  try {
    await notificationService.approveAlteration(id);
    alert(`Approved alteration with ID: ${id}`);
    // Remove approved item from the list
    setNotifications(prev => prev.filter(msg => !msg.includes(`(ID: ${id})`)));
  } catch {
    alert('Approval failed');
  }
};

const handleReject = async (id) => {
  try {
    await notificationService.rejectAlteration(id);
    alert(`Rejected alteration with ID: ${id}`);
    // Remove rejected item from the list
    setNotifications(prev => prev.filter(msg => !msg.includes(`(ID: ${id})`)));
  } catch {
    alert('Rejection failed');
  }
};


  if (loading) return <p>Loading notifications...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ maxWidth: '600px', margin: '20px auto', fontFamily: 'Arial, sans-serif' }}>
      <h2>Notifications for Employee ID: {empId}</h2>
      {notifications.length === 0 && <p>No notifications found.</p>}
      {notifications.map((msg, idx) => (
        <NotificationItem
          key={idx}
          message={msg}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      ))}
    </div>
  );
}

export default NotificationPage;
