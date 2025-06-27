import React, { useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { setupAxiosInterceptors } from './utils/auth';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import MyTickets from './components/MyTickets';
import CreateTicket from './components/CreateTicket';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

const App = () => {
  // Set up axios interceptors when the app loads
  useEffect(() => {
    setupAxiosInterceptors();
  }, []);

  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-tickets"
          element={
            <ProtectedRoute>
              <MyTickets />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-ticket"
          element={
            <ProtectedRoute>
              <CreateTicket />
            </ProtectedRoute>
          }
        />
        {/* Redirect any unknown paths to the login page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;
