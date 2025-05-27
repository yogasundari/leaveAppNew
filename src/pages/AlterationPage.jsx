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

  const token = localStorage.getItem('token');

  // Load requestId from localStorage on component mount
  useEffect(() => {
    const storedRequestId = localStorage.getItem('requestId');
    if (storedRequestId) {
      setRequestId(parseInt(storedRequestId, 10));
    }
  }, []);

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
      
      // Check if any alteration is STAFF_ALTERATION
      const hasStaffAlteration = alterations.some(alt => alt.alterationType === 'STAFF_ALTERATION');
      if (hasStaffAlteration) {
        setStatusCheckEnabled(true);
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
      
      if (status === 'ACCEPTED') {
        setCanSubmitLeave(true);
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
    } catch (error) {
      console.error('Error submitting leave request:', error);
      alert('Error submitting leave request');
    }
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
              />

              <input 
                name="classPeriod" 
                value={alteration.classPeriod} 
                onChange={(e) => handleChange(alteration.id, 'classPeriod', e.target.value)}
                placeholder="Class Period" 
                className="w-full border p-2 rounded" 
              />

              <input 
                name="subjectCode" 
                value={alteration.subjectCode} 
                onChange={(e) => handleChange(alteration.id, 'subjectCode', e.target.value)}
                placeholder="Subject Code" 
                className="w-full border p-2 rounded" 
              />

              <input 
                name="subjectName" 
                value={alteration.subjectName} 
                onChange={(e) => handleChange(alteration.id, 'subjectName', e.target.value)}
                placeholder="Subject Name" 
                className="w-full border p-2 rounded" 
              />

              {alteration.alterationType === 'MOODLE_LINK' && (
                <input 
                  name="moodleActivityLink" 
                  value={alteration.moodleActivityLink} 
                  onChange={(e) => handleChange(alteration.id, 'moodleActivityLink', e.target.value)}
                  placeholder="Moodle Activity Link" 
                  className="w-full border p-2 rounded" 
                />
              )}

              {alteration.alterationType === 'STAFF_ALTERATION' && (
                <input 
                  name="replacementEmpId" 
                  value={alteration.replacementEmpId} 
                  onChange={(e) => handleChange(alteration.id, 'replacementEmpId', e.target.value)}
                  placeholder="Replacement Emp ID" 
                  className="w-full border p-2 rounded" 
                />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-4 pt-4 border-t">
        <button 
          onClick={handleSubmitAlterations} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition-colors"
        >
          Submit All Alterations ({alterations.length})
        </button>

        {statusCheckEnabled && (
          <button 
            onClick={checkNotificationStatus} 
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded transition-colors"
          >
            Check Notification Status
          </button>
        )}

        {canSubmitLeave && (
          <button 
            onClick={submitLeaveRequest} 
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
          >
            Submit Leave Request
          </button>
        )}
      </div>

      {notificationStatus && (
        <div className="bg-blue-50 border border-blue-200 rounded p-3">
          <p className="text-blue-800">
            <strong>Notification Status:</strong> {notificationStatus}
          </p>
        </div>
      )}
    </div>
  );
}