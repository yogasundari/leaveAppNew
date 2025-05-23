import React, { useState } from "react";
import "../styles/Dashboard.css";
import { NavLink, useNavigate } from "react-router-dom";
import LeaveBalanceCard from "../components/LeaveBalanceCard";



export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const navigate = useNavigate();
  const handleLogout = () => {
    // Clear all user-related data from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("empId");
    localStorage.removeItem("role");
    localStorage.removeItem("email");

  };

  return (
    <div className="dashboard-container">
      {/* Top Navbar */}
      <header className="top-navbar">
        <button className="hamburger" onClick={toggleSidebar}>
          ☰
        </button>
      </header>
<nav className={`sidebar ${sidebarOpen ? "open" : ""}`}>
  <ul>
    <li><NavLink to="/dashboard" className={({ isActive }) => isActive ? "active" : ""}>Dashboard</NavLink></li>
    <li><NavLink to="/dashboard/leaverequests" className={({ isActive }) => isActive ? "active" : ""}>Leave Requests</NavLink></li>
    <li><NavLink to="/dashboard/profile-update" className={({ isActive }) => isActive ? "active" : ""}>Profile Update</NavLink></li>
    <li><NavLink to="/dashboard/leave-history" className={({ isActive }) => isActive ? "active" : ""}>Leave History</NavLink></li>
    <li><NavLink to="/dashboard/leave-approval" className={({ isActive }) => isActive ? "active" : ""}>Leave Approval</NavLink></li>
    <li><NavLink to="/dashboard/logout" className="logout-button">Logout</NavLink></li>


  </ul>
</nav>

      <main className="main-content">
        <h2>Welcome to the Dashboard</h2>
        <p>Content goes here.</p>
        <LeaveBalanceCard /> 
      </main>
    </div>
  );
}
