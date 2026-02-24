import { useUserStore } from '@/store/userStore';
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export const RequireAdmin: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const user = useUserStore((s) => s.user);
  const location = useLocation();

  // Not logged in or not admin -> redirect to home
  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};