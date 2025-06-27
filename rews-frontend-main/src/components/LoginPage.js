import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Change this line
import '../styles/LoginPage.css'; // Import CSS styling

const LoginPage = () => {
  // State variables for email and password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }

    // Dummy login validation (replace with real API call)
    const validCredentials = [
      { email: 'admin@example.com', password: 'admin123' }, // Admin credentials
      { email: 'user@example.com', password: 'userpassword' }    // User credentials
    ];

    const isValidUser  = validCredentials.some(
      (cred) => cred.email === email && cred.password === password
    );

    if (isValidUser ) {
      alert('Login successful!');
      // Redirect to dashboard
     navigate('/Dashboard'); // Change this line
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>REWS</h2>
        <h3>Login Portal</h3>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
           
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-group">
          
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit">Sign In</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
