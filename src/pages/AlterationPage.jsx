import React, { useState, useEffect } from 'react';
import leaveRequestService from '../services/leaveRequestService';

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
  
  const [requestId, setRequestId] = useState(null);
  const [notificationStatus, setNotificationStatus] = useState('');
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

useEffect(() => {
  let intervalId;

  if (statusCheckEnabled && notificationStatus === 'PENDING' && requestId) {
    console.log('🔄 Starting auto status check for request:', requestId);
    console.log('🔄 Current status:', notificationStatus);

    intervalId = setInterval(async () => {
      try {
        console.log('🔍 Auto-checking notification status for requestId:', requestId);
        console.log('🔍 Current frontend status:', notificationStatus);

        const statusArray = await leaveRequestService.checkNotificationStatus(requestId);
        const status = Array.isArray(statusArray) && statusArray.length > 0 ? statusArray[0] : '';

        console.log('📡 Backend returned status:', status);
        console.log('📡 Status type:', typeof status);

        if (status !== notificationStatus) {
          console.log('✅ Status changed from', notificationStatus, 'to', status);
          setNotificationStatus(status);

          if (status === 'APPROVED') {
            setCanSubmitLeave(true);
            alert('✅ Great! The replacement faculty has approved your alteration. You can now submit your leave request.');
            clearInterval(intervalId);
          } else if (status === 'REJECTED') {
            setCanSubmitLeave(false);
            alert('❌ The replacement faculty has rejected your alteration request. Please contact them or choose a different faculty.');
            clearInterval(intervalId);
          }
        } else {
          console.log('⏳ Status unchanged, still:', status);
        }
      } catch (error) {
        console.error('❌ Error auto-checking notification status:', error);
        console.error('❌ Error details:', error.message);
      }
    }, 10000);

    console.log('✅ Auto status check started, checking every 10 seconds');
  } else {
    console.log('❌ Auto check not started. statusCheckEnabled:', statusCheckEnabled, 'notificationStatus:', notificationStatus, 'requestId:', requestId);
  }

  return () => {
    if (intervalId) {
      console.log('🛑 Stopping auto status check');
      clearInterval(intervalId);
    }
  };
}, [statusCheckEnabled, notificationStatus, requestId]);


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
      alert('Missing empId or requestId. Make sure leave draft is created first.');
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
        body: JSON.stringify(payloads), // send array of alterations
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
        // If there are staff alterations, enable notification status check
        setStatusCheckEnabled(true);
        setCanSubmitLeave(false); // Keep disabled until approved
        setNotificationStatus('PENDING'); // Set initial status
      } else if (hasOnlyMoodleLink) {
        // If only moodle alterations, enable submit leave request immediately
        setCanSubmitLeave(true);
        setStatusCheckEnabled(false);
      }

      return data;
    } catch (error) {
      console.error('Error submitting alterations:', error);
      alert('Error submitting alterations');
    }
  };

  const checkNotificationStatus = async () => {
    try {
      const status = await leaveRequestService.checkNotificationStatus(requestId);
      setNotificationStatus(status);
      
      console.log("Notification status:", status);
      
      // Enable submit leave request only if status is APPROVED
      if (status === 'APPROVED') {
        setCanSubmitLeave(true);
        alert('Alteration approved! You can now submit your leave request.');
      } else {
        setCanSubmitLeave(false);
      }
    } catch (error) {
      console.error('Error checking notification status:', error);
      alert('Error checking notification status');
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
      
    } catch (error) {
      console.error('Error submitting leave request:', error);
      alert('Error submitting leave request');
    }
  };

  // Determine if submit leave request should be enabled
  const shouldEnableSubmitLeave = () => {
    if (!alterationsSubmitted) return false;
    
    const hasStaffAlteration = alterations.some(alt => alt.alterationType === 'STAFF_ALTERATION');
    const hasOnlyMoodleLink = alterations.every(alt => alt.alterationType === 'MOODLE_LINK');
    
    if (hasOnlyMoodleLink) {
      return true; // Enable immediately for moodle alterations
    } else if (hasStaffAlteration) {
      return notificationStatus === 'APPROVED'; // Enable only when approved for staff alterations
    }
    
    return false;
  };

  return (
    <div className="p-4 space-y-6 max-w-4xl mx-auto bg-white shadow rounded">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Leave Alteration Form</h2>
        <button
          onClick={addNewAlteration}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors"
        >
          <span className="text-lg font-bold">+</span>
          New Alteration
        </button>
      </div>
      
      {/* Display current requestId for debugging */}
      {requestId && (
        <div className="bg-gray-100 p-2 rounded">
          <p className="text-sm text-gray-600">Request ID: {requestId}</p>
          <p className="text-sm text-gray-600">Total Alterations: {alterations.length}</p>
          <p className="text-sm text-gray-600">Alterations Submitted: {alterationsSubmitted ? 'Yes' : 'No'}</p>
        </div>
      )}

      <div className="space-y-6">
        {alterations.map((alteration, index) => (
          <div key={alteration.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-700">
                Alteration #{index + 1}
              </h3>
              {alterations.length > 1 && (
                <button
                  onClick={() => removeAlteration(alteration.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block">
                Alteration Type:
                <select
                  value={alteration.alterationType}
                  onChange={(e) => handleChange(alteration.id, 'alterationType', e.target.value)}
                  className="block w-full border p-2 rounded mt-1"
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
                className="w-full border p-2 rounded"
                disabled={alterationsSubmitted}
              />

              <input 
                name="classPeriod" 
                value={alteration.classPeriod} 
                onChange={(e) => handleChange(alteration.id, 'classPeriod', e.target.value)}
                placeholder="Class Period" 
                className="w-full border p-2 rounded"
                disabled={alterationsSubmitted}
              />

              <input 
                name="subjectCode" 
                value={alteration.subjectCode} 
                onChange={(e) => handleChange(alteration.id, 'subjectCode', e.target.value)}
                placeholder="Subject Code" 
                className="w-full border p-2 rounded"
                disabled={alterationsSubmitted}
              />

              <input 
                name="subjectName" 
                value={alteration.subjectName} 
                onChange={(e) => handleChange(alteration.id, 'subjectName', e.target.value)}
                placeholder="Subject Name" 
                className="w-full border p-2 rounded"
                disabled={alterationsSubmitted}
              />

              {alteration.alterationType === 'MOODLE_LINK' && (
                <input 
                  name="moodleActivityLink" 
                  value={alteration.moodleActivityLink} 
                  onChange={(e) => handleChange(alteration.id, 'moodleActivityLink', e.target.value)}
                  placeholder="Moodle Activity Link" 
                  className="w-full border p-2 rounded"
                  disabled={alterationsSubmitted}
                />
              )}

              {alteration.alterationType === 'STAFF_ALTERATION' && (
                <input 
                  name="replacementEmpId" 
                  value={alteration.replacementEmpId} 
                  onChange={(e) => handleChange(alteration.id, 'replacementEmpId', e.target.value)}
                  placeholder="Replacement Emp ID" 
                  className="w-full border p-2 rounded"
                  disabled={alterationsSubmitted}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-4 pt-4 border-t">
        <button 
          onClick={handleSubmitAlterations} 
          className={`px-6 py-2 rounded transition-colors ${
            alterationsSubmitted 
              ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
          disabled={alterationsSubmitted}
        >
          {alterationsSubmitted ? 'Alterations Submitted' : `Submit All Alterations (${alterations.length})`}
        </button>

        {statusCheckEnabled && (
          <button 
            onClick={checkNotificationStatus} 
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded transition-colors"
          >
            Check Notification Status
          </button>
        )}



      {/* Auto-checking indicator for pending status */}
      {statusCheckEnabled && notificationStatus === 'PENDING' && (
        <div className="bg-blue-50 border border-blue-200 rounded p-3">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <p className="text-blue-800 text-sm">
              Waiting for replacement faculty approval... (Auto-checking every 15 seconds)
            </p>
          </div>
          <p className="text-blue-600 text-xs mt-1">
            The replacement faculty will receive a notification to approve your request.
          </p>
        </div>
      )}

      {/* Notification status display */}
      {notificationStatus && (
        <div className={`border rounded p-3 ${
          notificationStatus === 'APPROVED' 
            ? 'bg-green-50 border-green-200' 
            : notificationStatus === 'PENDING'
            ? 'bg-yellow-50 border-yellow-200'
            : 'bg-red-50 border-red-200'
        }`}>
          <p className={`${
            notificationStatus === 'APPROVED' 
              ? 'text-green-800' 
              : notificationStatus === 'PENDING'
              ? 'text-yellow-800'
              : 'text-red-800'
          }`}>
            <strong>Notification Status:</strong> {notificationStatus}
          </p>
          {notificationStatus === 'PENDING' && (
            <p className="text-yellow-700 text-sm mt-1">
              Please wait for approval before submitting leave request.
            </p>
          )}
          {notificationStatus === 'APPROVED' && (
            <p className="text-green-700 text-sm mt-1">
              ✅ Approved! You can now submit your leave request.
            </p>
          )}
          {notificationStatus === 'REJECTED' && (
            <p className="text-red-700 text-sm mt-1">
              ❌ Request was rejected. Please contact the replacement faculty or choose a different one.
            </p>
          )}
        </div>

      )}
              <button 
          onClick={submitLeaveRequest} 
          className={`px-6 py-2 rounded transition-colors ${
            shouldEnableSubmitLeave()
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-gray-400 text-gray-600 cursor-not-allowed'
          }`}
          disabled={!shouldEnableSubmitLeave()}
        >
          Submit Leave Request
        </button>
      </div>
    </div>
  );
}