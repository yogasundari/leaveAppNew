import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../services/authService";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [empId, setEmpId] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

useEffect(() => {
  const storedToken = localStorage.getItem("resetToken");
  const storedEmpId = localStorage.getItem("empId");
  if (storedToken) setToken(storedToken);
  if (storedEmpId) setEmpId(storedEmpId);
}, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
try {
  await resetPassword({ empId, token, newPassword });
  setMessage("Password reset successful! You can now login.");
  localStorage.removeItem("resetToken");
  localStorage.removeItem("empId");
} catch (error) {
  setMessage("Error: " + (error.response?.data?.message || error.message));
}

  };

  return (
    <div>
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Employee ID"
          value={empId}
          onChange={(e) => setEmpId(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Reset Token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          required
          style={{ display: "none" }}
          disabled={true}
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="submit">Reset Password</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
