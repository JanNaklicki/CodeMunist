import React from "react";
import { Redirect, LinkProps } from "expo-router";
import { useAuth } from "../contexts/AuthProvider";

interface ProtectedRouteProps {
  permission: string;
  redirectTo?: LinkProps["href"];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  permission,
  redirectTo = "/auth",
  fallback,
  children,
}) => {
  const { hasPermission } = useAuth();

  if (!hasPermission(permission)) {
    return fallback ? <>{fallback}</> : <Redirect href={redirectTo} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
