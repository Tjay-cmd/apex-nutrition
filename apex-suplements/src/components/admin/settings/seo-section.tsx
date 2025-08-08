"use client";

import React, { useState, useCallback } from 'react';
import {
  Search,
  Eye,
  EyeOff,
  Save,
  AlertCircle,
  CheckCircle,
  X,
  Edit,
  Globe,
  Settings,
  Code,
  FileText,
  Map,
  Tag,
  Copy,
  ExternalLink,
  RefreshCw,
  Download,
  Upload,
  Plus,
  Trash2,
  Eye as PreviewIcon,
  BarChart3,
  TrendingUp,
  Target,
  Hash,
  Link,
  Image,
  Calendar,
  Clock,
  User,
  Building,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import { useSettings } from '@/contexts/settings-context';
import { useSettingsForm } from '@/hooks/use-settings-form';

const SEOSection: React.FC = () => {
  const { settings, updateSettings, validation } = useSettings();
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'meta' | 'structured' | 'sitemap' | 'preview'>('meta');
  const [selectedPage, setSelectedPage] = useState<string>('home');

  const {
    formData,
    updateField,
    saveChanges,
    isSubmitting: isSaving,
    hasChanges,
    errors: formErrors
  } = useSettingsForm({
    section: 'seo_settings',
    autoSave: true,
    autoSaveDelay: 2000
  });

  const seoData = formData?.seo_settings || settings?.seo_settings;

  const tabs = [
    { id: 'meta', label: 'Meta Tags', icon: Tag },
    { id: 'structured', label: 'Structured Data', icon: Code },
    { id: 'sitemap', label: 'Sitemap', icon: Map },
    { id: 'preview', label: 'SEO Preview', icon: PreviewIcon }
  ];

  const pages = [
    {
      id: 'home',
      name: 'Homepage',
      description: 'Main landing page SEO settings',
      icon: Globe
    },
    {
      id: 'products',
      name: 'Products',
      description: 'Product listing page SEO settings',
      icon: Settings
    },
    {
      id: 'about',
      name: 'About Us',
      description: 'About page SEO settings',
      icon: Building
    },
    {
      id: 'contact',
      name: 'Contact',
      description: 'Contact page SEO settings',
      icon: Mail
    },
    {
      id: 'blog',
      name: 'Blog',
      description: 'Blog page SEO settings',
      icon: FileText
    },
    {
      id: 'legal',
      name: 'Legal Pages',
      description: 'Legal pages SEO settings',
      icon: FileText
    }
  ];

  const currentPageData = seoData?.[selectedPage as keyof typeof seoData];

  const handlePageSelect = useCallback((pageId: string) => {
    setSelectedPage(pageId);
  }, []);

  const handleSave = async () => {
    if (!hasChanges) {
      alert('No changes to save');
      return;
    }

    try {
      const result = await saveChanges();
      if (result && result.success) {
        alert('SEO settings saved successfully!');
      } else {
        alert(`Save failed: ${result?.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error during save:', error);
      alert(`Error during save: ${error}`);
    }
  };

  const renderMetaTagsTab = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Page SEO Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pages.map((page) => {
            const Icon = page.icon;
            const pageData = seoData?.[page.id as keyof typeof seoData];
            const isSelected = selectedPage === page.id;

            return (
              <div
                key={page.id}
                onClick={() => handlePageSelect(page.id)}
                className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                  isSelected
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-red-300'
                }`}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <Icon className="h-5 w-5 text-gray-500" />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{page.name}</h4>
                    <p className="text-sm text-gray-500">{page.description}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {pageData?.title ? '✓ Title set' : '✗ No title'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {pageData?.description ? '✓ Desc set' : '✗ No desc'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedPage && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              {pages.find(p => p.id === selectedPage)?.name} - SEO Settings
            </h3>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Page Title
                </label>
                <input
                  type="text"
                  value={currentPageData?.title || ''}
                  onChange={(e) => updateField(`${selectedPage}.title`, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors text-gray-900"
                  placeholder="Enter page title..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Description
                </label>
                <textarea
                  value={currentPageData?.description || ''}
                  onChange={(e) => updateField(`${selectedPage}.description`, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors text-gray-900 resize-none"
                  rows={3}
                  placeholder="Enter meta description..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Keywords
              </label>
              <input
                type="text"
                value={currentPageData?.keywords || ''}
                onChange={(e) => updateField(`${selectedPage}.keywords`, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors text-gray-900"
                placeholder="Enter keywords separated by commas..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Canonical URL
              </label>
              <input
                type="url"
                value={currentPageData?.canonical_url || ''}
                onChange={(e) => updateField(`${selectedPage}.canonical_url`, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors text-gray-900"
                placeholder="https://apexsupplements.com/page-url"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderStructuredDataTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Structured Data</h3>
        <button className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          <Plus className="h-4 w-4" />
          <span>Add Structured Data</span>
        </button>
      </div>

      {selectedPage && (
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">
              {pages.find(p => p.id === selectedPage)?.name} - Structured Data
            </h4>

            <div className="space-y-4">
              <div className="text-center py-8 text-gray-500">
                <Code className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p>No structured data added yet.</p>
                <p className="text-sm">Click "Add Structured Data" to get started.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderSitemapTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Sitemap Configuration</h3>
        <div className="flex items-center space-x-2">
          <button className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Download className="h-4 w-4" />
            <span>Download XML</span>
          </button>
          <button className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="h-4 w-4" />
            <span>Add Page</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sitemap URL
            </label>
            <input
              type="text"
              value={seoData?.sitemap?.url || ''}
              onChange={(e) => updateField('sitemap.url', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors text-gray-900"
              placeholder="https://apexsupplements.com/sitemap.xml"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Modified
            </label>
            <input
              type="datetime-local"
              value={seoData?.sitemap?.lastModified || ''}
              onChange={(e) => updateField('sitemap.lastModified', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors text-gray-900"
            />
          </div>
        </div>

        <div>
          <h4 className="text-md font-medium text-gray-700 mb-3">Sitemap Pages</h4>
          <div className="text-center py-8 text-gray-500">
            <Map className="h-12 w-12 mx-auto mb-2 text-gray-400" />
            <p>No sitemap pages configured yet.</p>
            <p className="text-sm">Click "Add Page" to get started.</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPreviewTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">SEO Preview</h3>
      {selectedPage && (
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">
              {pages.find(p => p.id === selectedPage)?.name} - Search Result Preview
            </h4>

            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="text-blue-600 text-sm mb-1">
                  {seoData?.global?.website_url || 'https://apexsupplements.com'}
                </div>
                <div className="text-xl text-blue-800 font-medium mb-1">
                  {currentPageData?.title || 'Page Title'}
                </div>
                <div className="text-sm text-gray-600">
                  {currentPageData?.description || 'Page description will appear here...'}
                </div>
              </div>

              <div className="space-y-3">
                <h5 className="font-medium text-gray-900">Meta Tags</h5>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Title:</span>
                      <span className="text-sm text-gray-600">{currentPageData?.title || 'Not set'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Description:</span>
                      <span className="text-sm text-gray-600">{currentPageData?.description || 'Not set'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Keywords:</span>
                      <span className="text-sm text-gray-600">{currentPageData?.keywords || 'Not set'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderPreview = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">SEO Settings Overview</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Live Preview</span>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      </div>

      <div className="space-y-6">
        {pages.map((page) => {
          const pageData = seoData?.[page.id as keyof typeof seoData];
          const Icon = page.icon;

          return (
            <div key={page.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <Icon className="h-5 w-5 text-gray-500" />
                  <div>
                    <h4 className="font-medium text-gray-900">{page.name}</h4>
                    <p className="text-sm text-gray-500">{page.description}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Title:</span>
                  <span className="ml-2 text-gray-600">
                    {pageData?.title ? '✓ Set' : '✗ Not set'}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Description:</span>
                  <span className="ml-2 text-gray-600">
                    {pageData?.description ? '✓ Set' : '✗ Not set'}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Keywords:</span>
                  <span className="ml-2 text-gray-600">
                    {pageData?.keywords ? '✓ Set' : '✗ Not set'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Search className="h-6 w-6 text-red-600" />
          <h2 className="text-2xl font-bold text-gray-900">SEO Settings</h2>
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

          <div className="p-6">
            {activeTab === 'meta' && renderMetaTagsTab()}
            {activeTab === 'structured' && renderStructuredDataTab()}
            {activeTab === 'sitemap' && renderSitemapTab()}
            {activeTab === 'preview' && renderPreviewTab()}
          </div>
        </div>
      )}

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

export default SEOSection;