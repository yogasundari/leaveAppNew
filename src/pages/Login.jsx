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
      setMessage("Login successful!");
navigate("/dashboard"); 
      // Save token or user data if API returns it
      console.log("Response:", res.data);

      // Example: Redirect to dashboard
      // window.location.href = "/dashboard";
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
  Don’t have an account? <a href="/register">Register</a>
  <p className="forgot-password">
  <a href="/forgot-password">Forgot Password?</a>
</p>

</p>

    </div>
  );
};

export default Login;
