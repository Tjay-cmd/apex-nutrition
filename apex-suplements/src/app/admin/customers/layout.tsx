"use client";

import React from 'react';
import { RoleGuard } from '@/components/auth/role-guard';
import CustomerSidebar from '@/components/admin/customers/customer-sidebar';

interface CustomersLayoutProps {
  children: React.ReactNode;
}

const CustomersLayout: React.FC<CustomersLayoutProps> = ({ children }) => {
  return (
    <RoleGuard allowedRoles={['admin', 'super_admin']}>
      <div className="px-4 sm:px-6 lg:px-8 py-6 bg-white text-gray-900 min-h-screen">
        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3">
            <CustomerSidebar />
          </div>
          <div className="lg:col-span-9">
            <div className="rounded-2xl bg-white border border-gray-200 shadow-sm">
              <div className="p-4 sm:p-6 lg:p-8">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
};

export default CustomersLayout;


