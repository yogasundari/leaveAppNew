// src/pages/Register.jsx
import React, { useState } from "react";
import { registerUser } from "../services/authService";
import "../styles/Register.css";
import { useNavigate } from "react-router-dom";
import logo from "../assets/sec.jpg";


const Register = () => {
  const [formData, setFormData] = useState({
    empId: "",
    email: "",
    password: "",
    role: "EMPLOYEE"
  });

  const [message, setMessage] = useState("");
const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
try {
  await registerUser(formData);
  setMessage("Registration successful! Redirecting to login...");
  setTimeout(() => {
    navigate("/login");
  }, 1500);
} catch (error) {
  setMessage("Registration failed: " + (error.response?.data?.message || error.message));
}
  };

  return (
    <div className="register-container">
      <img src={logo} alt="College Logo" className="logo" />
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="empId" placeholder="Employee ID" value={formData.empId} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="EMPLOYEE">EMPLOYEE</option>
          
        </select>
        <button type="submit">Register</button>
      </form>
      {message && <p>{message}</p>}
        <p>Already have an account? <a href="/login">Login here</a></p>
    </div>
  );
};

export default Register;
