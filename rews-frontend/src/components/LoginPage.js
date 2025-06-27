import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/LoginPage.css';
import { FaUser, FaLock, FaBuilding, FaExclamationCircle } from 'react-icons/fa';

const API_URL = 'http://localhost:5001/api/v1';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      // Make API call to login endpoint
      const response = await axios.post(
        `${API_URL}/auth/login`,
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      console.log(response.data)
      // If login successful, save the token and redirect
      if (response.data.status === 'success') {
        console.log('Login successful:', response.data);
        const { token, data } = response.data;
        
        // Store token in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirect to dashboard
        navigate('/Dashboard');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
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
            Welcome to the REWS portal. Please sign in to access your workplace services and support.
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
                  disabled={isLoading}
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
                  disabled={isLoading}
                  required
                />
              </div>
              
              <div className="form-footer">
                <button 
                  type="submit" 
                  className="login-button"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </button>
              </div>
            </form>
            
            <div className="login-help">
              <p>Having trouble signing in? Contact IT support at:</p>
              <p><strong>support@rews.com</strong> | <strong>+91-80-4567-8900</strong></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
