"use client";

import React from 'react';
import { X, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { AnalyticsSummary, AnalyticsFilters } from '@/types/analytics';

interface ExportModalSimpleProps {
  isOpen: boolean;
  onClose: () => void;
  data: AnalyticsSummary;
  filters: AnalyticsFilters;
}

const ExportModalSimple: React.FC<ExportModalSimpleProps> = ({
  isOpen,
  onClose,
  data,
  filters
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Download className="h-6 w-6 text-apex-red" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Export Analytics Report</h2>
              <p className="text-sm text-gray-600">Generate and download your analytics data</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6">
          <p className="text-gray-600 mb-4">
            Export functionality is being tested. This is a simplified version.
          </p>
          <div className="text-sm text-gray-500">
            <p>Total Revenue: R{data.revenue.total_revenue.toLocaleString()}</p>
            <p>Total Orders: {data.orders.total_orders}</p>
            <p>Total Customers: {data.customers.total_customers}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-6 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={onClose}
            className="mr-3"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              console.log('Export clicked');
              onClose();
            }}
            className="bg-apex-red hover:bg-apex-red/90 text-white"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExportModalSimple; 