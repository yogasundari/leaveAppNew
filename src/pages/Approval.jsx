import React, { useEffect, useState } from "react";

const API_BASE = "http://localhost:8080/api/leave-approval";

export default function Approval() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionReason, setActionReason] = useState({}); // store reason input per approvalId
  const [processingId, setProcessingId] = useState(null); // to disable buttons when processing

  // Fetch pending requests on mount
 useEffect(() => {
  const token = localStorage.getItem("token");  // Or get your token from wherever you store it

  fetch(`${API_BASE}/approver/pending-requests`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch requests");
      return res.json();
    })
    .then((data) => {
      setRequests(data);
      setLoading(false);
    })
    .catch((err) => {
      console.error("Error fetching requests:", err);
      setLoading(false);
    });
}, []);

  const handleAction = async (approvalId, status) => {
    const reason = actionReason[approvalId] || "";
    if (!reason.trim()) {
      alert("Please enter a reason before proceeding.");
      return;
    }

    setProcessingId(approvalId);
const dataToSend = {
  status: "APPROVED",
  reason: "Looks good."
};

console.log("Data being sent:", dataToSend);
    try {
      const res = await fetch(`${API_BASE}/process/${approvalId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },

         body: JSON.stringify(dataToSend),
      });

      if (!res.ok) throw new Error("Failed to update approval status");

      // Update UI locally to remove/mark processed requests
      setRequests((prev) => prev.filter((r) => r.approvalId !== approvalId));
      setActionReason((prev) => {
        const copy = { ...prev };
        delete copy[approvalId];
        return copy;
      });
    } catch (err) {
      alert("Error processing request: " + err.message);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return <p>Loading pending requests...</p>;

  if (requests.length === 0) return <p>No pending leave approvals.</p>;

  return (
    <div style={{ maxWidth: 900, margin: "auto", padding: 20 }}>
      <h1>Pending Leave Approvals</h1>
      {requests.map((req) => (
        <div
          key={req.approvalId}
          style={{
            border: "1px solid #ccc",
            padding: 15,
            marginBottom: 15,
            borderRadius: 8,
            backgroundColor: "#f9f9f9",
          }}
        >
          <h3>
            {req.empName} ({req.empId}) — {req.leaveType}
          </h3>
          <p>
            <strong>From:</strong> {req.startDate} &nbsp; | &nbsp;{" "}
            <strong>To:</strong> {req.endDate}
          </p>
          <p>
            <strong>Reason:</strong> {req.reason}
          </p>

          {req.alterations.length > 0 && (
            <div style={{ marginTop: 10, paddingLeft: 15 }}>
              <strong>Alterations:</strong>
              {req.alterations.map((alt, i) => (
                <div
                  key={i}
                  style={{
                    border: "1px solid #ddd",
                    marginTop: 5,
                    padding: 8,
                    borderRadius: 6,
                    backgroundColor: "#fff",
                  }}
                >
                  <p>
                    <strong>Type:</strong> {alt.alterationType}
                  </p>
                  <p>
                    <strong>Subject:</strong> {alt.subjectName} ({alt.subjectCode})
                  </p>
                  <p>
                    <strong>Class Date:</strong> {alt.classDate} &nbsp;|&nbsp;{" "}
                    <strong>Class Period:</strong> {alt.classPeriod}
                  </p>
                  {alt.moodleActivityLink && (
                    <p>
                      <strong>Moodle Link:</strong>{" "}
                      <a href={alt.moodleActivityLink} target="_blank" rel="noreferrer">
                        {alt.moodleActivityLink}
                      </a>
                    </p>
                  )}
                  {alt.replacementEmpId && (
                    <p>
                      <strong>Replacement Employee ID:</strong> {alt.replacementEmpId}
                    </p>
                  )}
                  {alt.notificationStatus && (
                    <p>
                      <strong>Notification Status:</strong> {alt.notificationStatus}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: 15 }}>
            <textarea
              rows={2}
              placeholder="Enter reason for approve/reject"
              value={actionReason[req.approvalId] || ""}
              onChange={(e) =>
                setActionReason((prev) => ({
                  ...prev,
                  [req.approvalId]: e.target.value,
                }))
              }
              style={{ width: "100%", padding: 8, borderRadius: 4, resize: "vertical" }}
              disabled={processingId === req.approvalId}
            />

            <button
              onClick={() => handleAction(req.approvalId, "APPROVED")}
              disabled={processingId === req.approvalId}
              style={{
                marginTop: 8,
                marginRight: 8,
                padding: "8px 16px",
                backgroundColor: "#4caf50",
                color: "white",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              Approve
            </button>

            <button
              onClick={() => handleAction(req.approvalId, "REJECTED")}
              disabled={processingId === req.approvalId}
              style={{
                marginTop: 8,
                padding: "8px 16px",
                backgroundColor: "#f44336",
                color: "white",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
