import React, { useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { setupAxiosInterceptors } from './utils/auth';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import MyTickets from './components/MyTickets';
import CreateTicket from './components/CreateTicket';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import AdminDashboard from './components/AdminDashboard';
import AdminTickets from './components/AdminTickets';
import AdminTicketDetail from './components/AdminTicketDetail';
import AssignTicket from './components/AssignTicket';
import './App.css';

const App = () => {
  // Set up axios interceptors when the app loads - only once
  useEffect(() => {
    // Set up axios interceptors only once
    setupAxiosInterceptors();
    
    // Disable automatic redirection which can cause reload loops
    // Use React Router's Navigate component for redirects instead
    // This prevents the hard refresh caused by window.location.href
  }, []);

  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        
        {/* User Routes */}
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
        
        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/tickets"
          element={
            <AdminRoute>
              <AdminTickets />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/ticket/:ticketId"
          element={
            <AdminRoute>
              <AdminTicketDetail />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/assign-ticket/:ticketId"
          element={
            <AdminRoute>
              <AssignTicket />
            </AdminRoute>
          }
        />
        
        {/* Redirect any unknown paths to the login page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;
