import React, { useState, useEffect } from 'react';
import leaveRequestService from '../services/leaveRequestService';
import '../styles/Alteration.css';
import { useNavigate } from 'react-router-dom';

export default function AlterationPage() {
  const [alterations, setAlterations] = useState([
    {
      id: 1,
      alterationType: 'MOODLE_LINK',
      classDate: '',
      classPeriod: '',
      subjectCode: '',
      subjectName: '',
      moodleActivityLink: '',
      replacementEmpId: '',
    }
  ]);
  const navigate = useNavigate();

  const [requestId, setRequestId] = useState(null);
  const [notificationStatusList, setNotificationStatusList] = useState([]);
  const [notificationStatus, setNotificationStatus] = useState('');
  const [statusSummary, setStatusSummary] = useState(null);
  const [statusCheckEnabled, setStatusCheckEnabled] = useState(false);
  const [canSubmitLeave, setCanSubmitLeave] = useState(false);
  const [alterationsSubmitted, setAlterationsSubmitted] = useState(false);

  const token = localStorage.getItem('token');

  // Load requestId from localStorage on component mount
  useEffect(() => {
    const storedRequestId = localStorage.getItem('requestId');
    if (storedRequestId) {
      setRequestId(parseInt(storedRequestId, 10));
    }
  }, []);

  // Auto status checking with proper error handling
  useEffect(() => {
    let intervalId;

    if (statusCheckEnabled && requestId) {
      console.log('🔄 Starting auto status check for request:', requestId);

      intervalId = setInterval(async () => {
        try {
          console.log('🔍 Auto-checking notification status for requestId:', requestId);

          const statusResult = await leaveRequestService.checkNotificationStatus(requestId);
          
          setNotificationStatusList(statusResult.statusList);
          setNotificationStatus(statusResult.overallStatus);
          setStatusSummary(statusResult.summary);
          
          console.log('📡 Status Result:', statusResult);

          if (statusResult.canSubmit && !canSubmitLeave) {
            setCanSubmitLeave(true);
            clearInterval(intervalId);
            setStatusCheckEnabled(false);
          } else if (!statusResult.canSubmit) {
            console.log('⏳ Still waiting for approvals...');
          }
        } catch (error) {
          console.error('❌ Error auto-checking notification status:', error);
        }
      }, 10000);

      console.log('✅ Auto status check started');
    } else {
      console.log('❌ Auto check not started. statusCheckEnabled:', statusCheckEnabled, 'requestId:', requestId);
    }

    return () => {
      if (intervalId) {
        console.log('🛑 Stopping auto status check');
        clearInterval(intervalId);
      }
    };
  }, [statusCheckEnabled, requestId, canSubmitLeave]);

  const handleChange = (alterationId, field, value) => {
    setAlterations(prev => 
      prev.map(alt => 
        alt.id === alterationId 
          ? { ...alt, [field]: value }
          : alt
      )
    );
  };

  const addNewAlteration = () => {
    const newId = Math.max(...alterations.map(alt => alt.id)) + 1;
    const newAlteration = {
      id: newId,
      alterationType: 'MOODLE_LINK',
      classDate: '',
      classPeriod: '',
      subjectCode: '',
      subjectName: '',
      moodleActivityLink: '',
      replacementEmpId: '',
    };
    setAlterations(prev => [...prev, newAlteration]);
  };

  const removeAlteration = (alterationId) => {
    if (alterations.length > 1) {
      setAlterations(prev => prev.filter(alt => alt.id !== alterationId));
    }
  };

  const handleSubmitAlterations = async () => {
    const empId = localStorage.getItem('empId');
    const requestId = parseInt(localStorage.getItem('requestId'), 10);
    
    console.log("Submitting alterations with empId:", empId, "and requestId:", requestId);

    if (!empId || isNaN(requestId)) {
      console.log('Missing empId or requestId. Make sure leave draft is created first.');
      return;
    }

    // Validate all alterations
    const invalidAlterations = alterations.filter(alt => 
      !alt.classDate || !alt.classPeriod || !alt.subjectCode || !alt.subjectName ||
      (alt.alterationType === 'MOODLE_LINK' && !alt.moodleActivityLink) ||
      (alt.alterationType === 'STAFF_ALTERATION' && !alt.replacementEmpId)
    );

    if (invalidAlterations.length > 0) {
      alert('Please fill all required fields for all alterations.');
      return;
    }

    const payloads = alterations.map(alt => ({
      empId,
      requestId,
      alterationType: alt.alterationType,
      classDate: alt.classDate,
      classPeriod: alt.classPeriod,
      subjectName: alt.subjectName,
      subjectCode: alt.subjectCode,
      ...(alt.alterationType === 'MOODLE_LINK' && { moodleActivityLink: alt.moodleActivityLink }),
      ...(alt.alterationType === 'STAFF_ALTERATION' && { replacementEmpId: alt.replacementEmpId })
    }));

    console.log("Submitting payloads:", payloads);

    try {
      const res = await fetch('http://localhost:8080/api/leave-alteration/assign', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payloads),
      });

      if (!res.ok) {
        alert('Failed to submit alterations');
        return;
      }

      const data = await res.text();
      console.log("Server response:", data);
      alert('All alterations submitted successfully');
      
      setAlterationsSubmitted(true);
      
      // Check if any alteration is STAFF_ALTERATION
      const hasStaffAlteration = alterations.some(alt => alt.alterationType === 'STAFF_ALTERATION');
      const hasOnlyMoodleLink = alterations.every(alt => alt.alterationType === 'MOODLE_LINK');
      
      if (hasStaffAlteration) {
        setStatusCheckEnabled(true);
        setCanSubmitLeave(false);
        setNotificationStatus('PENDING');
      } else if (hasOnlyMoodleLink) {
        setCanSubmitLeave(true);
        setStatusCheckEnabled(false);
      }

      return data;
    } catch (error) {
      console.error('Error submitting alterations:', error);
      alert('Error submitting alterations');
    }
  };

  // Manual status check with updated service
  const checkNotificationStatus = async () => {
    try {
      const statusResult = await leaveRequestService.checkNotificationStatus(requestId);
      
      setNotificationStatusList(statusResult.statusList);
      setNotificationStatus(statusResult.overallStatus);
      setStatusSummary(statusResult.summary);
      setCanSubmitLeave(statusResult.canSubmit);

      console.log("🔍 Manual check - Status Result:", statusResult);

      if (statusResult.canSubmit) {
        alert('✅ All alterations approved! You can now submit your leave request.');
      } else if (statusResult.overallStatus === 'REJECTED') {
        alert('❌ Some alterations were rejected. Please contact the replacement faculty.');
      } else {
        alert(`⏳ Status: ${statusResult.summary.approved}/${statusResult.summary.total} approved. Still waiting for remaining approvals...`);
      }
    } catch (error) {
      console.error('❌ Error checking notification status:', error);
      alert('⚠️ Error checking notification status');
    }
  };

  const submitLeaveRequest = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/leave-request/submit/${requestId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        alert('Failed to submit leave request');
        return;
      }

      alert('Leave request submitted successfully');
      
      // Reset the form state after successful submission
      setCanSubmitLeave(false);
      setStatusCheckEnabled(false);
      setAlterationsSubmitted(false);
      setNotificationStatus('');
      setNotificationStatusList([]);
      setStatusSummary(null);
       navigate('/dashboard/leave-history'); // Redirect to leave requests page
    } catch (error) {
      console.error('Error submitting leave request:', error);
      alert('Error submitting leave request');
    }
  };

  const shouldEnableSubmitLeave = () => {
    if (!alterationsSubmitted) return false;
    
    const hasStaffAlteration = alterations.some(alt => alt.alterationType === 'STAFF_ALTERATION');
    const hasOnlyMoodleLink = alterations.every(alt => alt.alterationType === 'MOODLE_LINK');
    
    if (hasOnlyMoodleLink) {
      return true;
    } else if (hasStaffAlteration) {
      return canSubmitLeave && notificationStatus === 'APPROVED';
    }
    
    return false;
  };

  return (
    <div className="alteration-container">
      <div className="header">
        <h2 className="title">Leave Alteration Form</h2>
        <button
          onClick={addNewAlteration}
          className="btn btn-success add-btn"
        >
          <span className="plus-icon">+</span>
          New Alteration
        </button>
      </div>
      
      {requestId && (
        <div className="debug-info">
          <p>Request ID: {requestId}</p>
          <p>Total Alterations: {alterations.length}</p>
          <p>Alterations Submitted: {alterationsSubmitted ? 'Yes' : 'No'}</p>
        </div>
      )}

      <div className="alterations-list">
        {alterations.map((alteration, index) => (
          <div key={alteration.id} className="alteration-card">
            <div className="alteration-header">
              <h3 className="alteration-title">
                Alteration #{index + 1}
              </h3>
              {alterations.length > 1 && (
                <button
                  onClick={() => removeAlteration(alteration.id)}
                  className="btn btn-danger remove-btn"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="form-grid">
              <label className="form-field">
                Alteration Type:
                <select
                  value={alteration.alterationType}
                  onChange={(e) => handleChange(alteration.id, 'alterationType', e.target.value)}
                  className="form-input"
                  disabled={alterationsSubmitted}
                >
                  <option value="MOODLE_LINK">Moodle Link</option>
                  <option value="STAFF_ALTERATION">Staff Alteration</option>
                </select>
              </label>

              <input 
                type="date" 
                name="classDate" 
                value={alteration.classDate} 
                onChange={(e) => handleChange(alteration.id, 'classDate', e.target.value)}
                placeholder="Class Date" 
                className="form-input"
                disabled={alterationsSubmitted}
              />

              <input 
                name="classPeriod" 
                value={alteration.classPeriod} 
                onChange={(e) => handleChange(alteration.id, 'classPeriod', e.target.value)}
                placeholder="Class Period" 
                className="form-input"
                disabled={alterationsSubmitted}
              />

              <input 
                name="subjectCode" 
                value={alteration.subjectCode} 
                onChange={(e) => handleChange(alteration.id, 'subjectCode', e.target.value)}
                placeholder="Subject Code" 
                className="form-input"
                disabled={alterationsSubmitted}
              />

              <input 
                name="subjectName" 
                value={alteration.subjectName} 
                onChange={(e) => handleChange(alteration.id, 'subjectName', e.target.value)}
                placeholder="Subject Name" 
                className="form-input"
                disabled={alterationsSubmitted}
              />

              {alteration.alterationType === 'MOODLE_LINK' && (
                <input 
                  name="moodleActivityLink" 
                  value={alteration.moodleActivityLink} 
                  onChange={(e) => handleChange(alteration.id, 'moodleActivityLink', e.target.value)}
                  placeholder="Moodle Activity Link" 
                  className="form-input"
                  disabled={alterationsSubmitted}
                />
              )}

              {alteration.alterationType === 'STAFF_ALTERATION' && (
                <input 
                  name="replacementEmpId" 
                  value={alteration.replacementEmpId} 
                  onChange={(e) => handleChange(alteration.id, 'replacementEmpId', e.target.value)}
                  placeholder="Replacement Emp ID" 
                  className="form-input"
                  disabled={alterationsSubmitted}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="action-buttons">
        <button 
          onClick={handleSubmitAlterations} 
          className={`btn ${alterationsSubmitted ? 'btn-disabled' : 'btn-primary'}`}
          disabled={alterationsSubmitted}
        >
          {alterationsSubmitted ? 'Alterations Submitted' : `Submit All Alterations (${alterations.length})`}
        </button>

        {statusCheckEnabled && (
          <button 
            onClick={checkNotificationStatus} 
            className="btn btn-warning"
          >
            Check Notification Status
          </button>
        )}

        <button 
          onClick={submitLeaveRequest} 
          className={`btn ${shouldEnableSubmitLeave() ? 'btn-success' : 'btn-disabled'}`}
          disabled={!shouldEnableSubmitLeave()}
        >
          Submit Leave Request
        </button>
      </div>

      {statusCheckEnabled && notificationStatus === 'PENDING' && (
        <div className="status-pending">
          <div className="status-header">
            <div className="spinner"></div>
            <p className="status-text">
              Waiting for replacement faculty approval...
            </p>
          </div>
          <p className="status-subtext">
            Auto-checking every 10 seconds. The replacement faculty will receive a notification to approve your request.
          </p>
          {statusSummary && (
            <p className="status-progress">
              Progress: {statusSummary.approved}/{statusSummary.total} approved
            </p>
          )}
        </div>
      )}

      {notificationStatusList && notificationStatusList.length > 0 && (
        <div className="notification-status">
          <div className="status-header-main">
            <p className="status-title">📝 Replacement Faculty Status:</p>
            {statusSummary && (
              <span className="status-badge">
                {statusSummary.approved}/{statusSummary.total} Approved
              </span>
            )}
          </div>

          <div className="status-list">
            {notificationStatusList.map((status, index) => {
              let statusClass = '';
              let message = '';
              let icon = '';

              if (status === 'APPROVED') {
                statusClass = 'status-approved';
                message = 'Approved';
                icon = '✅';
              } else if (status === 'PENDING' || status === null) {
                statusClass = 'status-pending-item';
                message = 'Pending';
                icon = '⏳';
              } else if (status === 'REJECTED') {
                statusClass = 'status-rejected';
                message = 'Rejected';
                icon = '❌';
              }

              return (
                <div key={index} className={`status-item ${statusClass}`}>
                  <p className="status-faculty">
                    {icon} <strong>Replacement Faculty #{index + 1}:</strong> {message}
                  </p>
                  {status === 'PENDING' && (
                    <p className="status-waiting">
                      Notification sent, waiting for response...
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {notificationStatus && (
            <div className="overall-status">
              <p className="overall-status-text">
                Overall Status: 
                <span className={`status-badge-overall ${notificationStatus.toLowerCase()}`}>
                  {notificationStatus}
                </span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}