"use client";

import React, { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { AnalyticsFilters } from '@/types/analytics';

interface DateRangeSelectorProps {
  filters: AnalyticsFilters;
  onFiltersChange: (filters: AnalyticsFilters) => void;
}

const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  filters,
  onFiltersChange
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const presetRanges = [
    { label: 'Last 7 days', days: 7 },
    { label: 'Last 30 days', days: 30 },
    { label: 'Last 90 days', days: 90 },
    { label: 'This month', type: 'this_month' },
    { label: 'Last month', type: 'last_month' },
    { label: 'All time', type: 'all_time' }
  ];

  const getDateRangeLabel = () => {
    if (filters.date_from && filters.date_to) {
      const from = new Date(filters.date_from).toLocaleDateString();
      const to = new Date(filters.date_to).toLocaleDateString();
      return `${from} - ${to}`;
    }
    return 'All time';
  };

  const handlePresetSelect = (preset: { label: string; days?: number; type?: string }) => {
    let newFilters = { ...filters };

    if (preset.type === 'all_time') {
      delete newFilters.date_from;
      delete newFilters.date_to;
    } else if (preset.type === 'this_month') {
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      newFilters.date_from = firstDay.toISOString().split('T')[0];
      newFilters.date_to = now.toISOString().split('T')[0];
    } else if (preset.type === 'last_month') {
      const now = new Date();
      const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      newFilters.date_from = firstDayLastMonth.toISOString().split('T')[0];
      newFilters.date_to = lastDayLastMonth.toISOString().split('T')[0];
    } else if (preset.days) {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - preset.days);
      newFilters.date_from = startDate.toISOString().split('T')[0];
      newFilters.date_to = endDate.toISOString().split('T')[0];
    }

    onFiltersChange(newFilters);
    setIsOpen(false);
  };

  const handleCustomDateChange = (field: 'date_from' | 'date_to', value: string) => {
    const newFilters = { ...filters, [field]: value };
    onFiltersChange(newFilters);
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 border-gray-300"
      >
        <Calendar className="h-4 w-4" />
        <span>{getDateRangeLabel()}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl shadow-lg border border-gray-200 z-50">
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Date Range</h3>

            {/* Preset Ranges */}
            <div className="mb-4">
              <h4 className="text-xs font-medium text-gray-600 mb-2">Quick Select</h4>
              <div className="grid grid-cols-2 gap-2">
                {presetRanges.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => handlePresetSelect(preset)}
                    className="text-left px-3 py-2 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Date Range */}
            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-xs font-medium text-gray-600 mb-2">Custom Range</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">From</label>
                  <input
                    type="date"
                    value={filters.date_from || ''}
                    onChange={(e) => handleCustomDateChange('date_from', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-apex-red focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">To</label>
                  <input
                    type="date"
                    value={filters.date_to || ''}
                    onChange={(e) => handleCustomDateChange('date_to', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-apex-red focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Clear Button */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onFiltersChange({ ...filters, date_from: undefined, date_to: undefined });
                  setIsOpen(false);
                }}
                className="w-full text-gray-600 hover:text-gray-800"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangeSelector;