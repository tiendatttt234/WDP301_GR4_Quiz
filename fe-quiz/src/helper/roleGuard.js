// RoleGuard.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

// Guard for admin routes - only allows users with admin role
export const AdminGuard = () => {
  const { user } = useAuth();
  
  // Check if user is authenticated and has admin role
  const isAdmin = user.roles.some(role => role.name === "admin");
  
  if (!user.accessToken) {
    // User is not logged in, redirect to login
    return <Navigate to="/login" replace />;
  }
  
  if (!isAdmin) {
    // User is logged in but not an admin, redirect to unauthorized page
    return <Navigate to="/unauthorized" replace />;
  }
  
  // User is an admin, allow access to the route
  return <Outlet />;
};

// Guard for user routes - prevents admins from accessing user routes
export const UserGuard = () => {
  const { user } = useAuth();
  
  // Check if user is authenticated
  if (!user.accessToken) {
    // User is not logged in, redirect to login
    return <Navigate to="/login" replace />;
  }
  
  // Allow all authenticated users to access these routes
  return <Outlet />;
};

// Guard for public routes - accessible by anyone
export const PublicGuard = () => {
  return <Outlet />;
};