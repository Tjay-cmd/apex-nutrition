"use client";

import React, { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { AnalyticsFilters } from '@/types/analytics';

interface AdvancedDateSelectorProps {
  filters: AnalyticsFilters;
  onFiltersChange: (filters: AnalyticsFilters) => void;
  showTimeGranularity?: boolean;
  showRelativeDates?: boolean;
  showCustomPresets?: boolean;
}

type TimeGranularity = 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year';
type RelativeDateType = 'today' | 'yesterday' | 'this_week' | 'last_week' | 'this_month' | 'last_month' | 'this_quarter' | 'last_quarter' | 'this_year' | 'last_year';

const AdvancedDateSelector: React.FC<AdvancedDateSelectorProps> = ({
  filters,
  onFiltersChange,
  showTimeGranularity = true,
  showRelativeDates = true,
  showCustomPresets = true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'presets' | 'relative' | 'custom' | 'granularity'>('presets');
  const [timeGranularity, setTimeGranularity] = useState<TimeGranularity>('day');

  const presetRanges = [
    { label: 'Last 7 days', days: 7 },
    { label: 'Last 30 days', days: 30 },
    { label: 'Last 90 days', days: 90 },
    { label: 'Last 6 months', days: 180 },
    { label: 'Last year', days: 365 },
    { label: 'All time', type: 'all_time' }
  ];

  const relativeDates: { label: string; type: RelativeDateType; description: string }[] = [
    { label: 'Today', type: 'today', description: 'Current day' },
    { label: 'Yesterday', type: 'yesterday', description: 'Previous day' },
    { label: 'This Week', type: 'this_week', description: 'Current week (Mon-Sun)' },
    { label: 'Last Week', type: 'last_week', description: 'Previous week' },
    { label: 'This Month', type: 'this_month', description: 'Current month' },
    { label: 'Last Month', type: 'last_month', description: 'Previous month' },
    { label: 'This Quarter', type: 'this_quarter', description: 'Current quarter' },
    { label: 'Last Quarter', type: 'last_quarter', description: 'Previous quarter' },
    { label: 'This Year', type: 'this_year', description: 'Current year' },
    { label: 'Last Year', type: 'last_year', description: 'Previous year' }
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
    const newFilters = { ...filters };

    if (preset.type === 'all_time') {
      delete newFilters.date_from;
      delete newFilters.date_to;
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

  const handleRelativeDateSelect = (relativeType: RelativeDateType) => {
    const now = new Date();
    let startDate: Date;
    let endDate: Date;

    switch (relativeType) {
      case 'today':
        startDate = new Date(now);
        endDate = new Date(now);
        break;
      case 'yesterday':
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 1);
        endDate = new Date(startDate);
        break;
      case 'this_week':
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - startDate.getDay() + 1);
        endDate = new Date(now);
        break;
      case 'last_week':
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - startDate.getDay() - 6);
        endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 6);
        break;
      case 'this_month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now);
        break;
      case 'last_month':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        endDate = new Date(now.getFullYear(), now.getMonth(), 0);
        break;
      case 'this_quarter':
        const quarter = Math.floor(now.getMonth() / 3);
        startDate = new Date(now.getFullYear(), quarter * 3, 1);
        endDate = new Date(now);
        break;
      case 'last_quarter':
        const lastQuarter = Math.floor(now.getMonth() / 3) - 1;
        const lastQuarterYear = lastQuarter < 0 ? now.getFullYear() - 1 : now.getFullYear();
        const lastQuarterMonth = lastQuarter < 0 ? 9 : lastQuarter * 3;
        startDate = new Date(lastQuarterYear, lastQuarterMonth, 1);
        endDate = new Date(lastQuarterYear, lastQuarterMonth + 3, 0);
        break;
      case 'this_year':
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now);
        break;
      case 'last_year':
        startDate = new Date(now.getFullYear() - 1, 0, 1);
        endDate = new Date(now.getFullYear() - 1, 11, 31);
        break;
      default:
        return;
    }

    const newFilters = {
      ...filters,
      date_from: startDate.toISOString().split('T')[0],
      date_to: endDate.toISOString().split('T')[0]
    };

    onFiltersChange(newFilters);
    setIsOpen(false);
  };

  const handleCustomDateChange = (field: 'date_from' | 'date_to', value: string) => {
    const newFilters = { ...filters, [field]: value };
    onFiltersChange(newFilters);
  };

  const handleGranularityChange = (granularity: TimeGranularity) => {
    setTimeGranularity(granularity);
    // Update filters with granularity
    onFiltersChange({ ...filters, time_granularity: granularity });
  };

  const handleClearFilters = () => {
    const newFilters = { ...filters };
    delete newFilters.date_from;
    delete newFilters.date_to;
    delete newFilters.time_granularity;
    onFiltersChange(newFilters);
    setIsOpen(false);
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
        <div className="absolute top-full left-0 mt-2 w-96 bg-white rounded-2xl shadow-lg border border-gray-200 z-50">
          <div className="p-4">
            {/* Tab Navigation */}
            <div className="flex space-x-1 mb-4 border-b border-gray-200">
              {showCustomPresets && (
                <button
                  onClick={() => setActiveTab('presets')}
                  className={`px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                    activeTab === 'presets' ? 'text-apex-red border-b-2 border-apex-red' : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Presets
                </button>
              )}
              {showRelativeDates && (
                <button
                  onClick={() => setActiveTab('relative')}
                  className={`px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                    activeTab === 'relative' ? 'text-apex-red border-b-2 border-apex-red' : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Relative
                </button>
              )}
              <button
                onClick={() => setActiveTab('custom')}
                className={`px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                  activeTab === 'custom' ? 'text-apex-red border-b-2 border-apex-red' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Custom
              </button>
              {showTimeGranularity && (
                <button
                  onClick={() => setActiveTab('granularity')}
                  className={`px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                    activeTab === 'granularity' ? 'text-apex-red border-b-2 border-apex-red' : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Granularity
                </button>
              )}
            </div>

            {/* Tab Content */}
            <div className="space-y-4">
              {/* Presets Tab */}
              {activeTab === 'presets' && showCustomPresets && (
                <div>
                  <h4 className="text-xs font-medium text-gray-600 mb-3">Quick Select</h4>
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
              )}

              {/* Relative Dates Tab */}
              {activeTab === 'relative' && showRelativeDates && (
                <div>
                  <h4 className="text-xs font-medium text-gray-600 mb-3">Relative Dates</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {relativeDates.map((relative) => (
                      <button
                        key={relative.type}
                        onClick={() => handleRelativeDateSelect(relative.type)}
                        className="text-left px-3 py-2 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="font-medium">{relative.label}</div>
                        <div className="text-xs text-gray-500">{relative.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Custom Range Tab */}
              {activeTab === 'custom' && (
                <div>
                  <h4 className="text-xs font-medium text-gray-600 mb-3">Custom Range</h4>
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
              )}

              {/* Time Granularity Tab */}
              {activeTab === 'granularity' && showTimeGranularity && (
                <div>
                  <h4 className="text-xs font-medium text-gray-600 mb-3">Time Granularity</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {(['hour', 'day', 'week', 'month', 'quarter', 'year'] as TimeGranularity[]).map((granularity) => (
                      <button
                        key={granularity}
                        onClick={() => handleGranularityChange(granularity)}
                        className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                          timeGranularity === granularity
                            ? 'bg-apex-red text-white'
                            : 'hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        {granularity.charAt(0).toUpperCase() + granularity.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Clear Button */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
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

export default AdvancedDateSelector;