"use client";

import React from 'react';
import { useAuth } from '@/contexts/firebase-auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallback,
  redirectTo = '/auth/login'
}) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push(redirectTo);
    }
  }, [user, loading, router, redirectTo]);

  if (loading) {
    return fallback || (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-apex-red mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
};

// Higher-order component for protecting pages
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>,
  redirectTo?: string
) => {
  const ProtectedComponent = (props: P) => (
    <ProtectedRoute redirectTo={redirectTo}>
      <Component {...props} />
    </ProtectedRoute>
  );

  ProtectedComponent.displayName = `withAuth(${Component.displayName || Component.name})`;
  return ProtectedComponent;
};