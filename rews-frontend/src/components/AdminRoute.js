import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';
import { getCurrentUser, isAdmin } from '../utils/userManager';

const AdminRoute = ({ children }) => {
  // Check if user is authenticated
  if (!isAuthenticated()) {
    console.log('User not authenticated, redirecting to login');
    return <Navigate to="/" replace />;
  }
  
  // Check if user is an admin
  if (!isAdmin()) {
    console.log('User is not an admin, redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }
  
  // User is authenticated and is an admin

  return children;
};

export default AdminRoute;
