"use client";

import React, { useState } from 'react';
import {
  Filter,
  X,
  Calendar,
  DollarSign,
  User,
  Mail,
  Search,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { OrderFilters } from '@/types/order';

interface AdvancedOrderFiltersProps {
  filters: OrderFilters;
  onFiltersChange: (filters: OrderFilters) => void;
  onClearFilters: () => void;
  isExpanded: boolean;
  onToggleExpanded: () => void;
}

const AdvancedOrderFilters: React.FC<AdvancedOrderFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  isExpanded,
  onToggleExpanded
}) => {
  const [localFilters, setLocalFilters] = useState<OrderFilters>(filters);

  const handleFilterChange = (key: keyof OrderFilters, value: string | number | undefined) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
  };

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters: OrderFilters = {};
    setLocalFilters(clearedFilters);
    onClearFilters();
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== undefined && value !== '');

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
      {/* Filter Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-apex-red" />
          <h3 className="text-lg font-semibold text-gray-900">Advanced Filters</h3>
          {hasActiveFilters && (
            <span className="bg-apex-red text-white text-xs px-2 py-1 rounded-full">
              Active
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearFilters}
              className="text-gray-600 hover:text-gray-800"
            >
              <X className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleExpanded}
            className="text-apex-red border-apex-red hover:bg-apex-red hover:text-white"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-4 w-4 mr-1" />
                Collapse
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-1" />
                Expand
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Filter Content */}
      {isExpanded && (
        <div className="p-6 space-y-6">
          {/* Search and Customer Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Search className="h-4 w-4 mr-1" />
                Search Orders
              </label>
              <input
                type="text"
                placeholder="Search by order ID, customer name, or email..."
                value={localFilters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-apex-red focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Mail className="h-4 w-4 mr-1" />
                Customer Email
              </label>
              <input
                type="email"
                placeholder="Filter by specific customer email..."
                value={localFilters.customer_email || ''}
                onChange={(e) => handleFilterChange('customer_email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-apex-red focus:border-transparent"
              />
            </div>
          </div>

          {/* Status and Payment Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order Status
              </label>
              <select
                value={localFilters.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-apex-red focus:border-transparent"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Status
              </label>
              <select
                value={localFilters.payment_status || ''}
                onChange={(e) => handleFilterChange('payment_status', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-apex-red focus:border-transparent"
              >
                <option value="">All Payment Statuses</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
          </div>

          {/* Date Range Filters */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              Date Range
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">From Date</label>
                <input
                  type="date"
                  value={localFilters.date_from || ''}
                  onChange={(e) => handleFilterChange('date_from', e.target.value || undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-apex-red focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">To Date</label>
                <input
                  type="date"
                  value={localFilters.date_to || ''}
                  onChange={(e) => handleFilterChange('date_to', e.target.value || undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-apex-red focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Amount Range Filters */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <DollarSign className="h-4 w-4 mr-1" />
              Amount Range (ZAR)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Minimum Amount</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={localFilters.min_amount || ''}
                  onChange={(e) => handleFilterChange('min_amount', e.target.value ? parseFloat(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-apex-red focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Maximum Amount</label>
                <input
                  type="number"
                  placeholder="1000.00"
                  value={localFilters.max_amount || ''}
                  onChange={(e) => handleFilterChange('max_amount', e.target.value ? parseFloat(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-apex-red focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={handleClearFilters}
              className="text-gray-600 hover:text-gray-800"
            >
              <X className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
            <Button
              onClick={handleApplyFilters}
              className="bg-apex-red hover:bg-apex-red/90 text-white"
            >
              <Filter className="h-4 w-4 mr-2" />
              Apply Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedOrderFilters;