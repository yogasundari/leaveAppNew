import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";


export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
 const navigate = useNavigate();
    const role = localStorage.getItem("role");

  return (
    <div className="dashboard-container">
      {/* Top Navbar */}
      <header className="top-navbar">
        <button className="hamburger" onClick={toggleSidebar}>☰</button>
        <h1 className="app-title"> Dashboard</h1>
      </header>

      <nav className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <ul>
        
          <li><NavLink to="/dashboard/leaverequests" className={({ isActive }) => (isActive ? "active" : "")}>Leave Requests</NavLink></li>
          <li><NavLink to="/dashboard/profile-update" className={({ isActive }) => (isActive ? "active" : "")}>Profile Update</NavLink></li>
          <li><NavLink to="/dashboard/leave-history" className={({ isActive }) => (isActive ? "active" : "")}>Leave History</NavLink></li>
          <li><NavLink to="/dashboard/leave-approval" className={({ isActive }) => (isActive ? "active" : "")}>Leave Approval</NavLink></li>
          <li><NavLink to="/dashboard/notifications" className={({ isActive }) => (isActive ? "active" : "")}>Notifications</NavLink></li>
          <li><NavLink to="/dashboard/logout" className="logout-button">Logout</NavLink></li>
              {role === "ADMIN" && (
          <li><NavLink to="/admin-panel" className={({ isActive }) => (isActive ? "active" : "")}>Admin Panel</NavLink></li>
          )}
        </ul>
      </nav>

      <main className="main-content">
        
        <Outlet />
      </main>
    </div>
  );
}
