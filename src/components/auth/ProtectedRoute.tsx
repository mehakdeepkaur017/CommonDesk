import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface">
        <div className="w-12 h-12 border-4 border-brand-indigo/20 border-t-brand-indigo rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    // Redirect to login but save the attempted url
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Role not authorized, redirect to their default home
    const redirectPath = user.role === 'ADMIN' ? '/admin' : '/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  // If user has no workspace, force pending approval screen
  if (!localStorage.getItem('commondesk_workspace')) {
    return <Navigate to="/auth/pending-approval" replace />;
  }

  return <Outlet />;
};
