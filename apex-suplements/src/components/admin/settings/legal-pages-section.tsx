"use client";

import React, { useState, useCallback } from 'react';
import {
  FileText,
  Eye,
  EyeOff,
  Save,
  AlertCircle,
  CheckCircle,
  X,
  Edit,
  History,
  Calendar,
  User,
  Globe
} from 'lucide-react';
import { useSettings } from '@/contexts/settings-context';
import { useSettingsForm } from '@/hooks/use-settings-form';

const LegalPagesSection: React.FC = () => {
  const { settings, updateSettings, validation } = useSettings();
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'versions' | 'preview'>('editor');
  const [selectedPage, setSelectedPage] = useState<string>('terms_of_service');
  const [isEditing, setIsEditing] = useState(false);

  const {
    formData,
    updateField,
    saveChanges,
    isSubmitting: isSaving,
    hasChanges,
    errors: formErrors
  } = useSettingsForm({
    section: 'legal_pages',
    autoSave: true,
    autoSaveDelay: 2000
  });

  const legalData = formData?.legal_pages || settings?.legal_pages;

  const tabs = [
    { id: 'editor', label: 'Editor', icon: Edit },
    { id: 'versions', label: 'Version History', icon: History },
    { id: 'preview', label: 'Preview', icon: Eye }
  ];

  const legalPages = [
    {
      id: 'terms_of_service',
      name: 'Terms of Service',
      description: 'Legal terms and conditions for using our services'
    },
    {
      id: 'privacy_policy',
      name: 'Privacy Policy',
      description: 'How we collect, use, and protect your personal information'
    },
    {
      id: 'shipping_policy',
      name: 'Shipping Policy',
      description: 'Information about shipping methods, costs, and delivery times'
    },
    {
      id: 'returns_policy',
      name: 'Returns Policy',
      description: 'Our return and refund policy for products'
    },
    {
      id: 'cookie_policy',
      name: 'Cookie Policy',
      description: 'How we use cookies and similar technologies'
    },
    {
      id: 'disclaimer',
      name: 'Disclaimer',
      description: 'Legal disclaimers and liability limitations'
    }
  ];

  const currentPageData = legalData?.[selectedPage as keyof typeof legalData];

  const handlePageSelect = useCallback((pageId: string) => {
    setSelectedPage(pageId);
    setIsEditing(false);
  }, []);

  const handleContentUpdate = useCallback((content: string) => {
    if (isEditing) {
      updateField(`${selectedPage}.draft_content`, content);
    } else {
      updateField(`${selectedPage}.content`, content);
    }
  }, [selectedPage, isEditing, updateField]);

  const handleSave = async () => {
    if (!hasChanges) {
      alert('No changes to save');
      return;
    }

    try {
      const result = await saveChanges();
      if (result && result.success) {
        alert('Legal page saved successfully!');
      } else {
        alert(`Save failed: ${result?.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error during save:', error);
      alert(`Error during save: ${error}`);
    }
  };

  const handlePublish = useCallback(async () => {
    if (!currentPageData?.draft_content) {
      alert('No draft content to publish');
      return;
    }

    try {
      await updateField(`${selectedPage}.content`, currentPageData.draft_content);
      await updateField(`${selectedPage}.version`, '1.0.1');
      await updateField(`${selectedPage}.published_at`, new Date().toISOString());
      await updateField(`${selectedPage}.published_by`, 'Current User');
      await updateField(`${selectedPage}.is_published`, true);
      await updateField(`${selectedPage}.last_updated`, new Date().toISOString());

      setIsEditing(false);
      alert('Page published successfully!');
    } catch (error) {
      console.error('Error publishing page:', error);
      alert('Error publishing page');
    }
  }, [currentPageData, selectedPage, updateField]);

  const handleCreateDraft = useCallback(() => {
    setIsEditing(true);
    updateField(`${selectedPage}.draft_content`, currentPageData?.content || '');
    updateField(`${selectedPage}.draft_version`, '1.0.1');
    updateField(`${selectedPage}.draft_updated_at`, new Date().toISOString());
    updateField(`${selectedPage}.draft_updated_by`, 'Current User');
  }, [currentPageData, selectedPage, updateField]);

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (pageData: any) => {
    if (pageData?.draft_content && pageData.draft_content !== pageData.content) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          Draft Available
        </span>
      );
    }
    if (pageData?.is_published) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Published
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        Draft
      </span>
    );
  };

  const renderEditorTab = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Legal Pages</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {legalPages.map((page) => {
            const pageData = legalData?.[page.id as keyof typeof legalData];
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
                  <FileText className="h-5 w-5 text-gray-500" />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{page.name}</h4>
                    <p className="text-sm text-gray-500">{page.description}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  {getStatusBadge(pageData)}
                  <div className="text-xs text-gray-500">
                    {pageData?.last_updated ? formatDate(pageData.last_updated) : 'Not created'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedPage && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              {legalPages.find(p => p.id === selectedPage)?.name}
            </h3>
            <div className="flex items-center space-x-2">
              {currentPageData?.draft_content && currentPageData.draft_content !== currentPageData.content && (
                <button
                  onClick={handlePublish}
                  className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Publish Draft</span>
                </button>
              )}
              {!isEditing && (
                <button
                  onClick={handleCreateDraft}
                  className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                  <span>Create Draft</span>
                </button>
              )}
            </div>
          </div>

          <div className="border border-gray-300 rounded-lg">
            <div className="p-4">
              <textarea
                value={isEditing ? currentPageData?.draft_content || '' : currentPageData?.content || ''}
                onChange={(e) => handleContentUpdate(e.target.value)}
                className="w-full h-96 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors text-gray-900 resize-none"
                placeholder="Start writing your legal content here..."
              />
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Version:</span>
                <span className="ml-2 text-gray-600">
                  {isEditing ? currentPageData?.draft_version : currentPageData?.version || '1.0.0'}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Status:</span>
                <span className="ml-2">{getStatusBadge(currentPageData)}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Last Updated:</span>
                <span className="ml-2 text-gray-600">
                  {isEditing
                    ? currentPageData?.draft_updated_at
                      ? formatDate(currentPageData.draft_updated_at)
                      : 'Just now'
                    : currentPageData?.last_updated
                      ? formatDate(currentPageData.last_updated)
                      : 'Never'
                  }
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderVersionsTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Version History</h3>
      {selectedPage && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-gray-900">
              {legalPages.find(p => p.id === selectedPage)?.name}
            </h4>
            {getStatusBadge(currentPageData)}
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-medium text-gray-700 mb-2">Current Version</h5>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Version:</span>
                    <span className="text-sm font-medium">{currentPageData?.version || '1.0.0'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Published:</span>
                    <span className="text-sm text-gray-600">
                      {currentPageData?.published_at ? formatDate(currentPageData.published_at) : 'Not published'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">By:</span>
                    <span className="text-sm text-gray-600">{currentPageData?.published_by || 'Unknown'}</span>
                  </div>
                </div>
              </div>

              {currentPageData?.draft_content && (
                <div>
                  <h5 className="font-medium text-gray-700 mb-2">Draft Version</h5>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Version:</span>
                      <span className="text-sm font-medium">{currentPageData.draft_version}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Updated:</span>
                      <span className="text-sm text-gray-600">
                        {currentPageData.draft_updated_at ? formatDate(currentPageData.draft_updated_at) : 'Just now'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">By:</span>
                      <span className="text-sm text-gray-600">{currentPageData.draft_updated_by || 'Unknown'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderPreviewTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Page Preview</h3>
      {selectedPage && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-2xl font-bold text-gray-900">
              {legalPages.find(p => p.id === selectedPage)?.name}
            </h4>
            {getStatusBadge(currentPageData)}
          </div>

          <div className="prose max-w-none">
            <div className="text-gray-700 leading-relaxed">
              {currentPageData?.content ? (
                <div dangerouslySetInnerHTML={{ __html: currentPageData.content }} />
              ) : (
                <div className="text-gray-500 italic">
                  No content available. Start writing in the editor to see a preview here.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderPreview = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Legal Pages Overview</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Live Preview</span>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      </div>

      <div className="space-y-6">
        {legalPages.map((page) => {
          const pageData = legalData?.[page.id as keyof typeof legalData];

          return (
            <div key={page.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-gray-500" />
                  <div>
                    <h4 className="font-medium text-gray-900">{page.name}</h4>
                    <p className="text-sm text-gray-500">{page.description}</p>
                  </div>
                </div>
                {getStatusBadge(pageData)}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Version:</span>
                  <span className="ml-2 text-gray-600">{pageData?.version || '1.0.0'}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Last Updated:</span>
                  <span className="ml-2 text-gray-600">
                    {pageData?.last_updated ? formatDate(pageData.last_updated) : 'Never'}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Published:</span>
                  <span className="ml-2 text-gray-600">
                    {pageData?.is_published ? 'Yes' : 'No'}
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
          <FileText className="h-6 w-6 text-red-600" />
          <h2 className="text-2xl font-bold text-gray-900">Legal Pages</h2>
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
            {activeTab === 'editor' && renderEditorTab()}
            {activeTab === 'versions' && renderVersionsTab()}
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

export default LegalPagesSection;