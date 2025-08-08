"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useCustomers } from '@/contexts/customer-context';
import dynamic from 'next/dynamic';

const CustomerList = dynamic(() => import('@/components/admin/customers/customer-list'), { ssr: false });

const CustomersOverviewPage: React.FC = () => {
  const { customers, customerStats, isLoading, error, fetchCustomers, fetchCustomerStats } = useCustomers();

  useEffect(() => {
    fetchCustomers();
    fetchCustomerStats();
  }, [fetchCustomers, fetchCustomerStats]);

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <nav className="text-sm text-gray-500">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/admin" className="hover:text-gray-900">Admin</Link>
          </li>
          <li>/</li>
          <li className="text-gray-900">Customers</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600 mt-1">Manage customer data, segments, and insights.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/customers/segments"
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-900 transition-colors"
          >
            Segments
          </Link>
          <Link
            href="/admin/customers/import-export"
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#e11d48] to-black text-white hover:opacity-90 transition-opacity"
          >
            Import / Export
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl p-4 bg-white border border-gray-200 min-h-[104px] flex flex-col justify-between">
          <div className="text-sm text-gray-500">Total Customers</div>
          <div className="mt-2 text-2xl font-semibold text-gray-900">{customerStats?.total_customers ?? (isLoading ? '—' : customers.length)}</div>
        </div>
        <div className="rounded-xl p-4 bg-white border border-gray-200 min-h-[104px] flex flex-col justify-between">
          <div className="text-sm text-gray-500">Active (30d)</div>
          <div className="mt-2 text-2xl font-semibold text-gray-900">{customerStats?.active_last_30_days ?? '—'}</div>
        </div>
        <div className="rounded-xl p-4 bg-white border border-gray-200 min-h-[104px] flex flex-col justify-between">
          <div className="text-sm text-gray-500">With Orders</div>
          <div className="mt-2 text-2xl font-semibold text-gray-900">{customerStats?.with_orders ?? '—'}</div>
        </div>
        <div className="rounded-xl p-4 bg-white border border-gray-200 min-h-[104px] flex flex-col justify-between">
          <div className="text-sm text-gray-500">Segments</div>
          <div className="mt-2 text-2xl font-semibold text-gray-900">{customerStats?.segments_count ?? '—'}</div>
        </div>
      </div>

      {/* Callouts */}
      <div className="rounded-2xl p-6 bg-gray-50 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Get started</h2>
        <p className="text-gray-600 mb-4">Use the sidebar to navigate to Analytics, Segments, or Import/Export. The detailed list and search will be built next.</p>
        <Link href="#" className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-100 text-gray-900 hover:bg-gray-200 transition-colors">Learn more</Link>
      </div>

      {/* Customer List */}
      <CustomerList />

      {error && (
        <div className="rounded-lg p-3 bg-red-50 border border-red-200 text-red-700">{error}</div>
      )}
    </div>
  );
};

export default CustomersOverviewPage;


