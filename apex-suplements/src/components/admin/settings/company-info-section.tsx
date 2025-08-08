"use client";

import React, { useState, useEffect } from 'react';
import {
  Building2,
  Clock,
  MapPin,
  Phone,
  Mail,
  Globe,
  Eye,
  EyeOff,
  Save,
  CheckCircle,
  AlertCircle,
  Calendar,
  Globe as GlobeIcon
} from 'lucide-react';
import { useSettings } from '@/contexts/settings-context';
import { useSettingsForm } from '@/hooks/use-settings-form';
import type { CompanyInfo } from '@/types/settings';

const CompanyInfoSection: React.FC = () => {
  const { settings, updateSettings, validation } = useSettings();
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'contact' | 'address' | 'hours'>('details');

  const {
    formData,
    updateField,
    saveChanges,
    isSubmitting: isSaving,
    hasChanges,
    errors: formErrors
  } = useSettingsForm({
    section: 'company_info',
    autoSave: true,
    autoSaveDelay: 2000
  });

  const companyInfo = formData?.company_info || settings?.company_info;

  const tabs = [
    { id: 'details', label: 'Company Details', icon: Building2 },
    { id: 'contact', label: 'Contact Info', icon: Phone },
    { id: 'address', label: 'Address', icon: MapPin },
    { id: 'hours', label: 'Business Hours', icon: Clock }
  ];

  const timezones = [
    'Africa/Johannesburg',
    'UTC',
    'America/New_York',
    'Europe/London',
    'Asia/Tokyo',
    'Australia/Sydney'
  ];

  const daysOfWeek = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' }
  ];

  const handleFieldUpdate = (field: string, value: string) => {
    updateField(field, value);
  };

  const handleAddressUpdate = (field: string, value: string) => {
    updateField(`address.${field}`, value);
  };

  const handleContactUpdate = (field: string, value: string) => {
    updateField(`contact.${field}`, value);
  };

  const handleBusinessHoursUpdate = (day: string, value: string) => {
    updateField(`business_hours.${day}`, value);
  };

      const handleSave = async () => {
    console.log('=== SAVE BUTTON CLICKED ===');
    console.log('Has changes:', hasChanges);
    console.log('Form data:', formData);
    console.log('Is saving:', isSaving);

    if (!hasChanges) {
      console.log('No changes to save');
      alert('No changes to save');
      return;
    }

    console.log('Saving changes...');

    try {
      // Call the saveChanges function directly
      const result = await saveChanges();
      console.log('Save result:', result);

      if (result && result.success) {
        console.log('Save successful!');
        alert('Changes saved successfully!');
      } else {
        console.log('Save failed:', result?.error);
        alert(`Save failed: ${result?.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error during save:', error);
      alert(`Error during save: ${error}`);
    }
  };

  const renderCompanyDetails = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Name *
          </label>
          <input
            type="text"
            value={companyInfo?.name || ''}
            onChange={(e) => handleFieldUpdate('name', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors text-gray-900 placeholder-gray-500"
            placeholder="Apex Nutrition"
          />
          {formErrors?.company_info?.name && (
            <p className="text-red-500 text-sm mt-1">{formErrors.company_info.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Legal Name
          </label>
          <input
            type="text"
            value={companyInfo?.legal_name || ''}
            onChange={(e) => handleFieldUpdate('legal_name', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors text-gray-900 placeholder-gray-500"
            placeholder="Apex Nutrition (Pty) Ltd"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Registration Number
          </label>
          <input
            type="text"
            value={companyInfo?.registration_number || ''}
            onChange={(e) => handleFieldUpdate('registration_number', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors text-gray-900 placeholder-gray-500"
            placeholder="2024/123456/07"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            VAT Number
          </label>
          <input
            type="text"
            value={companyInfo?.vat_number || ''}
            onChange={(e) => handleFieldUpdate('vat_number', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors text-gray-900 placeholder-gray-500"
            placeholder="123456789"
          />
        </div>
      </div>
    </div>
  );

  const renderContactInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            value={companyInfo?.contact?.phone || ''}
            onChange={(e) => handleContactUpdate('phone', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors text-gray-900 placeholder-gray-500"
            placeholder="+27 11 123 4567"
          />
          {formErrors?.company_info?.contact?.phone && (
            <p className="text-red-500 text-sm mt-1">{formErrors.company_info.contact.phone}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            value={companyInfo?.contact?.email || ''}
            onChange={(e) => handleContactUpdate('email', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors text-gray-900 placeholder-gray-500"
            placeholder="info@apexnutrition.co.za"
          />
          {formErrors?.company_info?.contact?.email && (
            <p className="text-red-500 text-sm mt-1">{formErrors.company_info.contact.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Support Email
          </label>
          <input
            type="email"
            value={companyInfo?.contact?.support_email || ''}
            onChange={(e) => handleContactUpdate('support_email', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors text-gray-900 placeholder-gray-500"
            placeholder="support@apexnutrition.co.za"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Website
          </label>
          <input
            type="url"
            value={companyInfo?.contact?.website || ''}
            onChange={(e) => handleContactUpdate('website', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors text-gray-900 placeholder-gray-500"
            placeholder="https://apexnutrition.co.za"
          />
        </div>
      </div>
    </div>
  );

  const renderAddress = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Street Address *
          </label>
          <input
            type="text"
            value={companyInfo?.address?.street || ''}
            onChange={(e) => handleAddressUpdate('street', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors text-gray-900 placeholder-gray-500"
            placeholder="123 Main Street"
          />
          {formErrors?.company_info?.address?.street && (
            <p className="text-red-500 text-sm mt-1">{formErrors.company_info.address.street}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City *
          </label>
          <input
            type="text"
            value={companyInfo?.address?.city || ''}
            onChange={(e) => handleAddressUpdate('city', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors text-gray-900 placeholder-gray-500"
            placeholder="Johannesburg"
          />
          {formErrors?.company_info?.address?.city && (
            <p className="text-red-500 text-sm mt-1">{formErrors.company_info.address.city}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Province *
          </label>
          <input
            type="text"
            value={companyInfo?.address?.province || ''}
            onChange={(e) => handleAddressUpdate('province', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors text-gray-900 placeholder-gray-500"
            placeholder="Gauteng"
          />
          {formErrors?.company_info?.address?.province && (
            <p className="text-red-500 text-sm mt-1">{formErrors.company_info.address.province}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Postal Code *
          </label>
          <input
            type="text"
            value={companyInfo?.address?.postal_code || ''}
            onChange={(e) => handleAddressUpdate('postal_code', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors text-gray-900 placeholder-gray-500"
            placeholder="2000"
          />
          {formErrors?.company_info?.address?.postal_code && (
            <p className="text-red-500 text-sm mt-1">{formErrors.company_info.address.postal_code}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Country *
          </label>
          <input
            type="text"
            value={companyInfo?.address?.country || ''}
            onChange={(e) => handleAddressUpdate('country', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors text-gray-900 placeholder-gray-500"
            placeholder="South Africa"
          />
          {formErrors?.company_info?.address?.country && (
            <p className="text-red-500 text-sm mt-1">{formErrors.company_info.address.country}</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderBusinessHours = () => (
    <div className="space-y-6">
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Timezone
        </label>
                  <select
            value={companyInfo?.business_hours?.timezone || 'Africa/Johannesburg'}
            onChange={(e) => handleFieldUpdate('business_hours.timezone', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors text-gray-900"
          >
          {timezones.map((tz) => (
            <option key={tz} value={tz}>{tz}</option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        {daysOfWeek.map((day) => (
          <div key={day.key} className="flex items-center space-x-4">
            <div className="w-24">
              <label className="block text-sm font-medium text-gray-700">
                {day.label}
              </label>
            </div>
            <div className="flex-1">
              <input
                type="text"
                value={companyInfo?.business_hours?.[day.key as keyof typeof companyInfo.business_hours] || ''}
                onChange={(e) => handleBusinessHoursUpdate(day.key, e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors text-gray-900 placeholder-gray-500"
                placeholder="09:00-17:00"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-blue-600" />
          <span className="text-blue-800 font-medium">Business Hours Tips</span>
        </div>
        <ul className="text-blue-700 text-sm mt-2 space-y-1">
          <li>• Use format: "09:00-17:00" for open hours</li>
          <li>• Use "Closed" for days when business is closed</li>
          <li>• Use "24/7" for 24-hour operations</li>
          <li>• Use "By appointment" for appointment-only days</li>
        </ul>
      </div>
    </div>
  );

  const renderPreview = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Company Information Preview</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Live Preview</span>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Company Details */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-3">Company Details</h4>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-lg font-semibold text-gray-900">{companyInfo?.name || 'Company Name'}</p>
            {companyInfo?.legal_name && (
              <p className="text-sm text-gray-600 mt-1">{companyInfo.legal_name}</p>
            )}
            {companyInfo?.registration_number && (
              <p className="text-sm text-gray-600 mt-1">Reg: {companyInfo.registration_number}</p>
            )}
            {companyInfo?.vat_number && (
              <p className="text-sm text-gray-600 mt-1">VAT: {companyInfo.vat_number}</p>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-3">Contact Information</h4>
          <div className="bg-gray-50 rounded-lg p-4">
            {companyInfo?.contact?.phone && (
              <div className="flex items-center space-x-2 mb-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">{companyInfo.contact.phone}</span>
              </div>
            )}
            {companyInfo?.contact?.email && (
              <div className="flex items-center space-x-2 mb-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">{companyInfo.contact.email}</span>
              </div>
            )}
            {companyInfo?.contact?.support_email && (
              <div className="flex items-center space-x-2 mb-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">Support: {companyInfo.contact.support_email}</span>
              </div>
            )}
            {companyInfo?.contact?.website && (
              <div className="flex items-center space-x-2">
                <GlobeIcon className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">{companyInfo.contact.website}</span>
              </div>
            )}
          </div>
        </div>

        {/* Address */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-3">Address</h4>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
              <div className="text-sm text-gray-700">
                {companyInfo?.address?.street && <p>{companyInfo.address.street}</p>}
                {companyInfo?.address?.city && companyInfo?.address?.province && (
                  <p>{companyInfo.address.city}, {companyInfo.address.province}</p>
                )}
                {companyInfo?.address?.postal_code && <p>{companyInfo.address.postal_code}</p>}
                {companyInfo?.address?.country && <p>{companyInfo.address.country}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Business Hours */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-3">Business Hours</h4>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Timezone: {companyInfo?.business_hours?.timezone || 'Africa/Johannesburg'}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              {daysOfWeek.map((day) => (
                <div key={day.key} className="flex justify-between">
                  <span className="text-gray-600">{day.label}:</span>
                  <span className="text-gray-900">
                    {companyInfo?.business_hours?.[day.key as keyof typeof companyInfo.business_hours] || 'Not set'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Building2 className="h-6 w-6 text-red-600" />
          <h2 className="text-2xl font-bold text-gray-900">Company Information</h2>
        </div>

        <div className="flex items-center space-x-3">
          {hasChanges && (
            <div className="flex items-center space-x-2 text-orange-600">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Unsaved changes</span>
            </div>
          )}

          <button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
              isPreviewMode
                ? 'bg-red-600 text-white border-red-600 hover:bg-red-700'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {isPreviewMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            <span>{isPreviewMode ? 'Hide Preview' : 'Show Preview'}</span>
          </button>

          <button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {isPreviewMode ? (
        renderPreview()
      ) : (
        <div className="bg-white rounded-lg border border-gray-200">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      isActive
                        ? 'border-red-500 text-red-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'details' && renderCompanyDetails()}
            {activeTab === 'contact' && renderContactInfo()}
            {activeTab === 'address' && renderAddress()}
            {activeTab === 'hours' && renderBusinessHours()}
          </div>
        </div>
      )}

      {/* Validation Errors */}
      {validation && !validation.isValid && validation.errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <span className="text-red-800 font-medium">Validation Errors</span>
          </div>
          <ul className="text-red-700 text-sm space-y-1">
            {validation.errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CompanyInfoSection;