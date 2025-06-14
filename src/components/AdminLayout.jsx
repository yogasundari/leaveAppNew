import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../styles/Adminpanel.css"


export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const navigate = useNavigate();
  
  // Note: Avoid localStorage in production - use proper state management
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="admin-container">
      {/* Top Navbar */}
      <header className="top-navbar">
        <button className="hamburger" onClick={toggleSidebar}>
          ☰
        </button>
        <h1 className="app-title">Admin Dashboard</h1>
      </header>

      {/* Sidebar */}
      <nav className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <ul>
          <li>
            <NavLink 
              to="/admin-panel/employee" 
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={() => setSidebarOpen(false)}
            >
             Employee Management
            </NavLink>
          </li>
                    <li>
            <NavLink 
              to="/admin-panel/leave-type" 
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={() => setSidebarOpen(false)}
            >
              Leave Type Management
            </NavLink>
          </li>
           <li>
            <NavLink 
              to="/admin-panel/department" 
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={() => setSidebarOpen(false)}
            >
              Department Management
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/admin-panel/approvalflow" 
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={() => setSidebarOpen(false)}
            >
              ApprovalFlow Management
            </NavLink>
          </li>
                    <li>
            <NavLink 
              to="/admin-panel/approvalflowlevel" 
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={() => setSidebarOpen(false)}
            >
              ApprovalFlowLevel Management
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/admin-panel/leave-balance" 
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={() => setSidebarOpen(false)}
            >
              Leave Balance Management
            </NavLink>
          </li>
            <li>
            <NavLink 
              to="/admin-panel/leave-request-admin" 
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={() => setSidebarOpen(false)}
            >
              Leave Request Management
            </NavLink>
          </li>
                      <li>
            <NavLink 
              to="/dashboard" 
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={() => setSidebarOpen(false)}
            >
              Employee Dashboard
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}