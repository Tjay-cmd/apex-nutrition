"use client";

import React, { useState } from 'react';
import {
  Settings,
  Building2,
  Palette,
  Share2,
  FileText,
  Search,
  Globe,
  ChevronRight,
  Home
} from 'lucide-react';
import AdminNav from '@/components/admin/admin-nav';
import { useSettings } from '@/contexts/settings-context';
import { RoleGuard } from '@/components/auth/role-guard';
import SettingsStatus from '@/components/admin/settings/settings-status';
import CompanyInfoSection from '@/components/admin/settings/company-info-section';
import BrandingSection from '@/components/admin/settings/branding-section';
import SocialMediaSection from '@/components/admin/settings/social-media-section';
import LegalPagesSection from '@/components/admin/settings/legal-pages-section';
import SEOSection from '@/components/admin/settings/seo-section';

type SettingsSection = 'company' | 'branding' | 'social' | 'legal' | 'seo';

const SettingsPage: React.FC = () => {
  return (
    <RoleGuard allowedRoles={['admin', 'super_admin']}>
      <SettingsPageContent />
    </RoleGuard>
  );
};

const SettingsPageContent: React.FC = () => {
  const { settings, loading, error } = useSettings();
  const [activeSection, setActiveSection] = useState<SettingsSection>('company');

  const navigationItems = [
    {
      id: 'company' as SettingsSection,
      label: 'Company Information',
      icon: Building2,
      description: 'Business details, contact info, and hours'
    },
    {
      id: 'branding' as SettingsSection,
      label: 'Branding & Design',
      icon: Palette,
      description: 'Logo, colors, and visual identity'
    },
    {
      id: 'social' as SettingsSection,
      label: 'Social Media',
      icon: Share2,
      description: 'Social media links and integration'
    },
    {
      id: 'legal' as SettingsSection,
      label: 'Legal Pages',
      icon: FileText,
      description: 'Terms, privacy policy, and legal content'
    },
    {
      id: 'seo' as SettingsSection,
      label: 'SEO Settings',
      icon: Search,
      description: 'Meta tags, structured data, and SEO'
    }
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'company':
        return <CompanyInfoSection />;
      case 'branding':
        return <BrandingSection />;
      case 'social':
        return <SocialMediaSection />;
      case 'legal':
        return <LegalPagesSection />;
      case 'seo':
        return <SEOSection />;
      default:
        return <CompanyInfoSection />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading settings...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {error.includes('Access denied') ? 'Access Denied' : 'Error Loading Settings'}
              </h2>
              <p className="text-gray-600 mb-4">{error}</p>
              {error.includes('Access denied') ? (
                <a
                  href="/admin"
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors inline-block"
                >
                  Back to Admin Dashboard
                </a>
              ) : (
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-gray-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <AdminNav />

          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Settings className="h-8 w-8 mr-3 text-red-600" />
                Store Settings
              </h1>
              <p className="text-gray-600 mt-2">
                Manage your store's branding, information, and configuration
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors">
                <Globe className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-gray-200/50 shadow-xl p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Settings</h3>
              <nav className="space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full text-left p-3 rounded-xl transition-all duration-200 group ${
                        isActive
                          ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className={`h-5 w-5 ${
                          isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'
                        }`} />
                        <div className="flex-1">
                          <div className="font-medium">{item.label}</div>
                          <div className={`text-xs mt-1 ${
                            isActive ? 'text-red-100' : 'text-gray-500'
                          }`}>
                            {item.description}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-gray-200/50 shadow-xl p-8">
              {renderSection()}
            </div>
          </div>
        </div>
      </div>

      {/* Settings Status */}
      <SettingsStatus />
    </div>
  );
};

export default SettingsPage;