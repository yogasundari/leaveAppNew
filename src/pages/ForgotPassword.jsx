import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../services/authService";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");
  const [empId, setEmpId] = useState("");
  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await forgotPassword({ email });
    setMessage("If this email is registered, you will receive a reset token.");
    localStorage.setItem("resetToken", response.token); // store token silently
    localStorage.setItem("empId", ""); // optionally store empId here or later
    navigate("/reset-password");  // redirect without query params
  } catch (error) {
    setMessage("Error: " + (error.response?.data?.message || error.message));
  }
};


  const goToReset = () => {
    navigate(`/reset-password?token=${token}&empId=${empId}`);
  };

  return (
    <div>
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" disabled={!email}>
          Send Reset Token
        </button>
      </form>

      {message && <p>{message}</p>}

      {token && (
        <div>
          <p>Your reset token: <b>{token}</b></p>
          <input
            type="text"
            placeholder="Enter your Employee ID"
            value={empId}
            onChange={(e) => setEmpId(e.target.value)}
            required
          />
          <button onClick={goToReset} disabled={!empId}>
            Go to Reset Password
          </button>
        </div>
      )}
    </div>
  );
}
