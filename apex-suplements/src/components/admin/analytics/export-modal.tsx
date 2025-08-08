"use client";

import React, { useState } from 'react';
import {
  X,
  Download,
  FileText,
  FileSpreadsheet,
  File,
  Settings,
  Eye,
  Calendar,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { analyticsExportService, type ExportOptions } from '@/lib/analytics-export';
import type { AnalyticsSummary, AnalyticsFilters } from '@/types/analytics';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: AnalyticsSummary;
  filters: AnalyticsFilters;
}

type ExportFormat = 'csv' | 'pdf' | 'excel';

const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  data,
  filters
}) => {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('csv');
  const [includeCharts, setIncludeCharts] = useState(false);
  const [includeInsights, setIncludeInsights] = useState(true);
  const [customTitle, setCustomTitle] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const formatOptions = [
    {
      value: 'csv' as ExportFormat,
      label: 'CSV',
      description: 'Comma-separated values file',
      icon: FileText,
      color: 'text-green-600'
    },
    {
      value: 'excel' as ExportFormat,
      label: 'Excel',
      description: 'Microsoft Excel spreadsheet',
      icon: FileSpreadsheet,
      color: 'text-blue-600'
    },
    {
      value: 'pdf' as ExportFormat,
      label: 'PDF',
      description: 'Portable Document Format',
      icon: File,
      color: 'text-red-600'
    }
  ];

  const handleExport = async () => {
    setIsExporting(true);
    setExportError(null);
    setExportSuccess(false);

    try {
      const options: ExportOptions = {
        format: selectedFormat,
        data,
        filters,
        includeCharts,
        includeInsights,
        customTitle: customTitle || undefined,
        customDescription: customDescription || undefined
      };

      const result = await analyticsExportService.exportData(options);

      if (result.success && result.data && result.filename) {
        analyticsExportService.downloadFile(result.data, result.filename);
        setExportSuccess(true);
        setTimeout(() => {
          onClose();
          setExportSuccess(false);
        }, 2000);
      } else {
        setExportError(result.error || 'Export failed');
      }
    } catch (error) {
      setExportError(error instanceof Error ? error.message : 'Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  const handleClose = () => {
    if (!isExporting) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
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
            onClick={handleClose}
            disabled={isExporting}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Format Selection */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Export Format</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {formatOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.value}
                    onClick={() => setSelectedFormat(option.value)}
                    className={`p-4 border-2 rounded-xl transition-all duration-200 ${
                      selectedFormat === option.value
                        ? 'border-apex-red bg-apex-red/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`h-6 w-6 ${option.color}`} />
                      <div className="text-left">
                        <div className="font-medium text-gray-900">{option.label}</div>
                        <div className="text-sm text-gray-600">{option.description}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Export Options */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Export Options</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Eye className="h-5 w-5 text-gray-600" />
                  <div>
                    <div className="font-medium text-gray-900">Include Charts</div>
                    <div className="text-sm text-gray-600">Add visual charts to the export</div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeCharts}
                    onChange={(e) => setIncludeCharts(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-apex-red/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-apex-red"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Settings className="h-5 w-5 text-gray-600" />
                  <div>
                    <div className="font-medium text-gray-900">Include Insights</div>
                    <div className="text-sm text-gray-600">Add business insights and recommendations</div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeInsights}
                    onChange={(e) => setIncludeInsights(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-apex-red/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-apex-red"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Custom Title & Description */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Customization</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Report Title (Optional)
                </label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="Enter custom report title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-apex-red focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Report Description (Optional)
                </label>
                <textarea
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                  placeholder="Enter custom report description"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-apex-red focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Export Summary */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Export Summary</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Data Points:</span>
                <span className="font-medium text-gray-900">
                  {data.revenue.revenue_by_period.length} revenue records
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Date Range:</span>
                <span className="font-medium text-gray-900">
                  {filters.date_from && filters.date_to
                    ? `${new Date(filters.date_from).toLocaleDateString()} - ${new Date(filters.date_to).toLocaleDateString()}`
                    : 'All time'
                  }
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Format:</span>
                <span className="font-medium text-gray-900 uppercase">{selectedFormat}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">File Size:</span>
                <span className="font-medium text-gray-900">~{Math.round(data.revenue.revenue_by_period.length * 0.1)}KB</span>
              </div>
            </div>
          </div>

          {/* Error/Success Messages */}
          {exportError && (
            <div className="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-sm text-red-700">{exportError}</span>
            </div>
          )}

          {exportSuccess && (
            <div className="flex items-center space-x-2 p-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm text-green-700">Export completed successfully!</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Generated on {new Date().toLocaleString()}
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isExporting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleExport}
              disabled={isExporting}
              className="bg-apex-red hover:bg-apex-red/90 text-white"
            >
              {isExporting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;