import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear user data from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("empId");
    localStorage.removeItem("role");
    localStorage.removeItem("email");

    // Delay navigation for better UX
    setTimeout(() => {
      navigate("/login");
    }, 1000); // 1 second delay
  }, [navigate]);

  return <p>Logging out...</p>;
}
