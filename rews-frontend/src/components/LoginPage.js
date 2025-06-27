import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/LoginPage.css";
import {
  FaUser,
  FaLock,
  FaBuilding,
  FaExclamationCircle,
} from "react-icons/fa";

const API_URL = "http://localhost:5001/api/v1";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Clear any existing tokens on component mount
  useEffect(() => {
    // Clear any existing authentication data
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Make API call to login endpoint
      const response = await axios.post(
        `${API_URL}/auth/login`,
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      // If login successful, save the token and redirect based on role
      if (response.data.status === "success") {
        console.log("Login successful:", response.data);
        const { token, data } = response.data;

        // Store token and user data in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Check user role and redirect accordingly
        if (data.user.role === "admin") {
          // Redirect admin users to admin dashboard
          navigate("/admin/dashboard");
        } else {
          // Redirect regular users to user dashboard
          navigate("/dashboard");
        }
      }
    } catch (apiError) {
      console.error("Authentication failed:", apiError);
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-left">
          <div className="login-brand">
            <FaBuilding className="brand-icon" />
            <h1>REWS</h1>
          </div>
          <h2>Real Estate & Workplace Solutions</h2>
          <p className="login-description">
            Welcome to the REWS portal. Please sign in to access your workplace
            services and support.
          </p>
        </div>

        <div className="login-right">
          <div className="login-form-container">
            <h2>Sign In</h2>
            <p>Enter your credentials to access your account</p>

            {error && (
              <div className="error-message">
                <FaExclamationCircle /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">
                  <FaUser /> Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">
                  <FaLock /> Password
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <div className="form-footer">
                <button
                  type="submit"
                  className="login-button"
                  disabled={loading}
                >
                  {loading ? "Signing In..." : "Sign In"}
                </button>
              </div>
            </form>

            <div className="login-help">
              <p>Having trouble signing in? Contact IT support at:</p>
              <p>
                <strong>support@rews.com</strong> |{" "}
                <strong>+91-80-4567-8900</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
