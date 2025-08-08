"use client";

import React, { useState } from 'react';
import {
  Clock,
  Mail,
  Calendar,
  Settings,
  Plus,
  Edit,
  Trash2,
  Play,
  Pause,
  CheckCircle,
  AlertCircle,
  FileText,
  Users,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { AnalyticsFilters } from '@/types/analytics';

interface ScheduledReport {
  id: string;
  name: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  format: 'csv' | 'pdf' | 'excel';
  recipients: string[];
  filters: AnalyticsFilters;
  isActive: boolean;
  lastRun?: string;
  nextRun?: string;
  createdAt: string;
}

interface ScheduledReportsProps {
  onScheduleReport: (report: Omit<ScheduledReport, 'id' | 'createdAt' | 'lastRun' | 'nextRun'>) => void;
  onUpdateReport: (id: string, updates: Partial<ScheduledReport>) => void;
  onDeleteReport: (id: string) => void;
  onToggleReport: (id: string, isActive: boolean) => void;
}

const ScheduledReports: React.FC<ScheduledReportsProps> = ({
  onScheduleReport,
  onUpdateReport,
  onDeleteReport,
  onToggleReport
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<ScheduledReport | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    frequency: 'weekly' as 'daily' | 'weekly' | 'monthly' | 'quarterly',
    format: 'pdf' as 'csv' | 'pdf' | 'excel',
    recipients: '',
    filters: {} as AnalyticsFilters
  });

  // Mock data - in real app, this would come from props or API
  const scheduledReports: ScheduledReport[] = [
    {
      id: '1',
      name: 'Weekly Revenue Report',
      description: 'Weekly revenue summary and trends',
      frequency: 'weekly',
      format: 'pdf',
      recipients: ['admin@apex.com', 'finance@apex.com'],
      filters: {},
      isActive: true,
      lastRun: '2024-01-15T10:00:00Z',
      nextRun: '2024-01-22T10:00:00Z',
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      name: 'Monthly Customer Analytics',
      description: 'Monthly customer acquisition and retention metrics',
      frequency: 'monthly',
      format: 'excel',
      recipients: ['marketing@apex.com'],
      filters: { customer_type: 'all' },
      isActive: true,
      lastRun: '2024-01-01T09:00:00Z',
      nextRun: '2024-02-01T09:00:00Z',
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '3',
      name: 'Daily Order Summary',
      description: 'Daily order processing and fulfillment status',
      frequency: 'daily',
      format: 'csv',
      recipients: ['operations@apex.com'],
      filters: { status: 'processing' },
      isActive: false,
      lastRun: '2024-01-15T18:00:00Z',
      nextRun: '2024-01-16T18:00:00Z',
      createdAt: '2024-01-01T00:00:00Z'
    }
  ];

  const frequencyOptions = [
    { value: 'daily', label: 'Daily', icon: Clock },
    { value: 'weekly', label: 'Weekly', icon: Calendar },
    { value: 'monthly', label: 'Monthly', icon: Calendar },
    { value: 'quarterly', label: 'Quarterly', icon: Calendar }
  ];

  const formatOptions = [
    { value: 'csv', label: 'CSV', icon: FileText },
    { value: 'pdf', label: 'PDF', icon: FileText },
    { value: 'excel', label: 'Excel', icon: FileText }
  ];

  const handleOpenModal = (report?: ScheduledReport) => {
    if (report) {
      setEditingReport(report);
      setFormData({
        name: report.name,
        description: report.description,
        frequency: report.frequency,
        format: report.format,
        recipients: report.recipients.join(', '),
        filters: report.filters
      });
    } else {
      setEditingReport(null);
      setFormData({
        name: '',
        description: '',
        frequency: 'weekly',
        format: 'pdf',
        recipients: '',
        filters: {}
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    const reportData = {
      name: formData.name,
      description: formData.description,
      frequency: formData.frequency,
      format: formData.format,
      recipients: formData.recipients.split(',').map(email => email.trim()).filter(Boolean),
      filters: formData.filters,
      isActive: true
    };

    if (editingReport) {
      onUpdateReport(editingReport.id, reportData);
    } else {
      onScheduleReport(reportData);
    }

    setIsModalOpen(false);
    setEditingReport(null);
  };

  const getFrequencyIcon = (frequency: string) => {
    const option = frequencyOptions.find(opt => opt.value === frequency);
    return option ? option.icon : Clock;
  };

  const getFormatIcon = (format: string) => {
    const option = formatOptions.find(opt => opt.value === format);
    return option ? option.icon : FileText;
  };

  const getNextRunDate = (frequency: string, lastRun?: string) => {
    if (!lastRun) return 'Not scheduled';

    const lastRunDate = new Date(lastRun);
    const nextRunDate = new Date(lastRunDate);

    switch (frequency) {
      case 'daily':
        nextRunDate.setDate(nextRunDate.getDate() + 1);
        break;
      case 'weekly':
        nextRunDate.setDate(nextRunDate.getDate() + 7);
        break;
      case 'monthly':
        nextRunDate.setMonth(nextRunDate.getMonth() + 1);
        break;
      case 'quarterly':
        nextRunDate.setMonth(nextRunDate.getMonth() + 3);
        break;
    }

    return nextRunDate.toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Scheduled Reports</h3>
          <p className="text-sm text-gray-600">Automated report generation and delivery</p>
        </div>
        <Button
          onClick={() => handleOpenModal()}
          className="bg-apex-red hover:bg-apex-red/90 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Schedule Report
        </Button>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {scheduledReports.map((report) => {
          const FrequencyIcon = getFrequencyIcon(report.frequency);
          const FormatIcon = getFormatIcon(report.format);

          return (
            <div key={report.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-medium text-gray-900">{report.name}</h4>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      report.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {report.isActive ? 'Active' : 'Paused'}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{report.description}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <FrequencyIcon className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-700">{report.frequency}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FormatIcon className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-700">{report.format.toUpperCase()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-700">{report.recipients.length} recipients</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-700">
                        Next: {getNextRunDate(report.frequency, report.lastRun)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onToggleReport(report.id, !report.isActive)}
                    className={report.isActive ? 'text-orange-600' : 'text-green-600'}
                  >
                    {report.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenModal(report)}
                    className="text-blue-600"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDeleteReport(report.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {scheduledReports.length === 0 && (
        <div className="text-center py-8">
          <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Scheduled Reports</h3>
          <p className="text-gray-600 mb-4">Create your first automated report to get started</p>
          <Button
            onClick={() => handleOpenModal()}
            className="bg-apex-red hover:bg-apex-red/90 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Schedule Report
          </Button>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <Clock className="h-6 w-6 text-apex-red" />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {editingReport ? 'Edit Scheduled Report' : 'Schedule New Report'}
                  </h2>
                  <p className="text-sm text-gray-600">Configure automated report delivery</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </Button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Report Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Report Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter report name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-apex-red focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Enter report description"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-apex-red focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Schedule Configuration */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Schedule Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Frequency
                    </label>
                    <select
                      value={formData.frequency}
                      onChange={(e) => setFormData({ ...formData, frequency: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-apex-red focus:border-transparent"
                    >
                      {frequencyOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Format
                    </label>
                    <select
                      value={formData.format}
                      onChange={(e) => setFormData({ ...formData, format: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-apex-red focus:border-transparent"
                    >
                      {formatOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Recipients */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recipients</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Addresses (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.recipients}
                    onChange={(e) => setFormData({ ...formData, recipients: e.target.value })}
                    placeholder="admin@apex.com, finance@apex.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-apex-red focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter email addresses separated by commas
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Reports will be automatically generated and sent via email
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!formData.name || !formData.recipients}
                  className="bg-apex-red hover:bg-apex-red/90 text-white"
                >
                  {editingReport ? 'Update Report' : 'Schedule Report'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduledReports;