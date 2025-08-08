"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { useCustomers } from '@/contexts/customer-context';
import { CUSTOMER_STATUS_OPTIONS, CUSTOMER_TIER_OPTIONS, CUSTOMER_SORT_FIELDS, Customer } from '@/types/customers';

const StatusBadge: React.FC<{ status: Customer['status'] }> = ({ status }) => {
  const styles: Record<Customer['status'], string> = {
    active: 'bg-green-50 text-green-700 border-green-200',
    inactive: 'bg-gray-50 text-gray-700 border-gray-200',
    suspended: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    deleted: 'bg-red-50 text-red-700 border-red-200',
  };
  return (
    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded border ${styles[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const CustomerList: React.FC = () => {
  const {
    customers,
    isLoading,
    error,
    filters,
    sort,
    pagination,
    setFilters,
    setSort,
    setPagination,
    fetchCustomers,
  } = useCustomers();

  const [searchTerm, setSearchTerm] = useState<string>(filters.search || '');
  const [status, setStatus] = useState<string>(filters.status?.[0] || '');
  const [tier, setTier] = useState<string>(filters.tier?.[0] || '');
  const [sortField, setSortField] = useState<string>(sort.field);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>(sort.direction);

  // Sync local control states when context changes externally
  useEffect(() => {
    setSearchTerm(filters.search || '');
    setStatus(filters.status?.[0] || '');
    setTier(filters.tier?.[0] || '');
    setSortField(sort.field);
    setSortDir(sort.direction);
  }, [filters, sort]);

  // Debounced search
  useEffect(() => {
    const id = setTimeout(() => {
      setFilters({ ...filters, search: searchTerm || undefined, page: 1 } as any);
      setPagination({ ...pagination, page: 1 });
      fetchCustomers();
    }, 400);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const applyFilters = () => {
    const nextFilters = {
      ...filters,
      status: status ? [status] : undefined,
      tier: tier ? [tier] : undefined,
    };
    setFilters(nextFilters);
    setPagination({ ...pagination, page: 1 });
    fetchCustomers();
  };

  const applySort = () => {
    setSort({ field: sortField as any, direction: sortDir });
    setPagination({ ...pagination, page: 1 });
    fetchCustomers();
  };

  const goToPage = (page: number) => {
    setPagination({ ...pagination, page });
    fetchCustomers();
  };

  const rows = useMemo(() => customers, [customers]);

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
          <div className="flex flex-col min-w-0">
            <label className="text-sm text-gray-600">Search</label>
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Name, email, phone, tag..."
              className="h-10 px-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <label className="text-sm text-gray-600">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="h-10 px-3 rounded-lg border border-gray-300 bg-white text-gray-900"
            >
              <option value="">All</option>
              {CUSTOMER_STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col min-w-0">
            <label className="text-sm text-gray-600">Tier</label>
            <select
              value={tier}
              onChange={(e) => setTier(e.target.value)}
              className="h-10 px-3 rounded-lg border border-gray-300 bg-white text-gray-900"
            >
              <option value="">All</option>
              {CUSTOMER_TIER_OPTIONS.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col min-w-0">
            <label className="text-sm text-gray-600">Sort</label>
            <div className="flex gap-2">
              <select
                value={sortField}
                onChange={(e) => setSortField(e.target.value)}
                className="h-10 px-3 rounded-lg border border-gray-300 bg-white text-gray-900 flex-1"
              >
                {CUSTOMER_SORT_FIELDS.map((f) => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>
              <select
                value={sortDir}
                onChange={(e) => setSortDir(e.target.value as 'asc' | 'desc')}
                className="h-10 px-3 rounded-lg border border-gray-300 bg-white text-gray-900"
              >
                <option value="asc">Asc</option>
                <option value="desc">Desc</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 justify-end w-full">
          <button onClick={applyFilters} className="h-10 px-4 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300 whitespace-nowrap">Apply Filters</button>
          <button onClick={applySort} className="h-10 px-4 rounded-lg bg-gradient-to-r from-[#e11d48] to-black text-white whitespace-nowrap">Apply Sort</button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-xl">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Email</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Phone</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Tags</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Created</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-500">Loading customers…</td>
              </tr>
            )}
            {!isLoading && rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-500">No customers found.</td>
              </tr>
            )}
            {!isLoading && rows.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-900">
                  <div className="font-medium">{c.profile.display_name || `${c.profile.first_name} ${c.profile.last_name}`}</div>
                  <div className="text-xs text-gray-500">{c.profile.company || '—'}</div>
                </td>
                <td className="px-4 py-3 text-gray-700">{c.contact.email}</td>
                <td className="px-4 py-3 text-gray-700">{c.contact.phone || '—'}</td>
                <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                <td className="px-4 py-3 text-gray-700">{c.segmentation.tags?.length || 0}</td>
                <td className="px-4 py-3 text-gray-700">{new Date(c.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">Page {pagination.page} of {Math.max(1, pagination.total_pages || 1)}</div>
        <div className="flex gap-2">
          <button
            className="h-9 px-3 rounded border border-gray-300 bg-white text-gray-900 disabled:opacity-50"
            onClick={() => goToPage(Math.max(1, pagination.page - 1))}
            disabled={pagination.page <= 1}
          >
            Previous
          </button>
          <button
            className="h-9 px-3 rounded border border-gray-300 bg-white text-gray-900 disabled:opacity-50"
            onClick={() => goToPage(Math.min(pagination.total_pages || pagination.page + 1, (pagination.total_pages || pagination.page + 1)))}
            disabled={pagination.page >= (pagination.total_pages || 1)}
          >
            Next
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg p-3 bg-red-50 border border-red-200 text-red-700">{error}</div>
      )}
    </div>
  );
};

export default CustomerList;


