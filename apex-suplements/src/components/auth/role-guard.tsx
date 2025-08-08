"use client";

import React from 'react';
import { useAuth } from '@/contexts/firebase-auth-context';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: ('customer' | 'admin' | 'super_admin')[];
  fallback?: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  allowedRoles,
  fallback
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-apex-red mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to access this page.</p>
          <a
            href="/auth/login"
            className="inline-flex items-center px-4 py-2 bg-apex-red text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Login
          </a>
        </div>
      </div>
    );
  }

  if (!allowedRoles.includes(user.role)) {
    return fallback || (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this page. Required role: {allowedRoles.join(' or ')}
          </p>
          <a
            href="/"
            className="inline-flex items-center px-4 py-2 bg-apex-red text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Go Home
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};