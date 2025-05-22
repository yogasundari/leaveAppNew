import React, { useState } from "react";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="dashboard-container">
      {/* Top Navbar */}
      <header className="top-navbar">
        <button className="hamburger" onClick={toggleSidebar}>
          ☰
        </button>
      </header>

      {/* Side Navbar */}
      <nav className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <ul>
          <li>Dashboard</li>
          <li>Leave Requests</li>
          <li>Profile</li>
          <li>Logout</li>
        </ul>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <h2>Welcome to the Dashboard</h2>
        <p>Content goes here.</p>
      </main>
    </div>
  );
}
