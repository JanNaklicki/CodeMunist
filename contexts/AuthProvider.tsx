import React, { createContext, useContext, ReactNode } from "react";
import { useSession } from "./SessionContext";
import { rolePermissions, Roles } from "../constants/Roles";

interface AuthContextType {
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { role } = useSession(); // Get the role from SessionContext

  const hasPermission = (permission: string) => {
    const permissions = rolePermissions[role as Roles] || [];
    return permissions.includes(permission);
  };

  return (
    <AuthContext.Provider value={{ hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
