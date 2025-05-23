// src/pages/Login.jsx
import React, { useState } from "react";
import { loginUser } from "../services/authService";
import "../styles/Login.css"; // optional
import { useNavigate } from "react-router-dom";
import logo from "../assets/sec.jpg";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await loginUser(formData);
    
    // Store token locally
    localStorage.setItem("token", res.data.token);  // adjust this if token path is different
    console.log("empid is stoing in local storage", res.data.empId);
    localStorage.setItem("empId", res.data.empId);
    localStorage.setItem("email", res.data.email);
    localStorage.setItem("role", res.data.role);

    setMessage("Login successful!");
    console.log("Response:", res.data);
    navigate("/dashboard");
  } catch (error) {
    setMessage("Login failed: " + (error.response?.data?.message || error.message));
  }
};


  return (
    <div className="login-container">
     <img src={logo} alt="College Logo" className="logo" />
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
      <p className="redirect-text">
          Don’t have an account? <a href="/register">Register</a></p>
       <p className="forgot-password">
      <a href="/forgot-password">Forgot Password?</a>
      </p>



    </div>
  );
};

export default Login;
