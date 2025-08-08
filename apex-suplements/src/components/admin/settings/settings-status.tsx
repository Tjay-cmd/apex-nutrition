"use client";

import React from 'react';
import { CheckCircle, AlertCircle, Clock, Save, XCircle } from 'lucide-react';
import { useSettings } from '@/contexts/settings-context';

interface SettingsStatusProps {
  className?: string;
}

const SettingsStatus: React.FC<SettingsStatusProps> = ({ className = '' }) => {
  const {
    autoSaveStatus,
    hasUnsavedChanges,
    validation,
    error,
    clearError
  } = useSettings();

  const getStatusIcon = () => {
    switch (autoSaveStatus) {
      case 'saving':
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'saved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return hasUnsavedChanges ? <Save className="h-4 w-4 text-orange-500" /> : null;
    }
  };

  const getStatusText = () => {
    switch (autoSaveStatus) {
      case 'saving':
        return 'Saving...';
      case 'saved':
        return 'All changes saved';
      case 'error':
        return 'Save failed';
      default:
        return hasUnsavedChanges ? 'Unsaved changes' : 'All changes saved';
    }
  };

  const getStatusColor = () => {
    switch (autoSaveStatus) {
      case 'saving':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'saved':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return hasUnsavedChanges
          ? 'text-orange-600 bg-orange-50 border-orange-200'
          : 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (!hasUnsavedChanges && autoSaveStatus === 'idle' && validation.isValid && !error) {
    return null;
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 space-y-2 ${className}`}>
      {/* Auto-save Status */}
      {(hasUnsavedChanges || autoSaveStatus !== 'idle') && (
        <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg border ${getStatusColor()} shadow-lg`}>
          {getStatusIcon()}
          <span className="text-sm font-medium">{getStatusText()}</span>
        </div>
      )}

      {/* Validation Errors */}
      {!validation.isValid && validation.errors.length > 0 && (
        <div className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-red-200 bg-red-50 text-red-600 shadow-lg">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm font-medium">
            {validation.errors.length} validation error{validation.errors.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      {/* Validation Warnings */}
      {validation.warnings.length > 0 && (
        <div className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-yellow-200 bg-yellow-50 text-yellow-600 shadow-lg">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm font-medium">
            {validation.warnings.length} warning{validation.warnings.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-center justify-between space-x-2 px-3 py-2 rounded-lg border border-red-200 bg-red-50 text-red-600 shadow-lg">
          <div className="flex items-center space-x-2">
            <XCircle className="h-4 w-4" />
            <span className="text-sm font-medium">{error}</span>
          </div>
          <button
            onClick={clearError}
            className="text-red-400 hover:text-red-600 transition-colors"
          >
            <XCircle className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default SettingsStatus;