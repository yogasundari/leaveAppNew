import React, { useEffect, useState } from "react";

const LeaveBalanceCard = () => {
  const [leaveBalance, setLeaveBalance] = useState(null);

  useEffect(() => {
    const fetchLeaveBalance = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/leave-balance/me", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch leave balance");
        }
        const data = await response.json();
        setLeaveBalance(data);
      } catch (error) {
        console.error("Error fetching leave balance:", error);
      }
    };

    fetchLeaveBalance();
  }, []);

  if (!leaveBalance) {
    return <p>Loading leave balances...</p>;
  }

  return (
    <div className="leave-card">
      <h3>Leave Balance</h3>
      <div className="leave-grid">
        {Object.entries(leaveBalance).map(([type, value]) => (
          <div key={type} className="leave-box">
            <h4>{type}</h4>
            <p>Total: {value.total}</p>
            <p>Used: {value.used}</p>
            <p>Remaining: {value.total - value.used}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaveBalanceCard;
