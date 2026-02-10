import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../hooks/store";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: number[]; // Array of role_ids
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && user?.role_id && !allowedRoles.includes(user.role_id)) {
    // Redirect to appropriate dashboard based on their actual role if they try to access unauthorized route
    if (user.role_id === 1 || user.role_id === 2 || user.role_id === 3) {
      return <Navigate to="/dashboard" replace />;
    } else if (user.role_id === 4) {
      return <Navigate to={`/student/dashboard/${user.id}`} replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
