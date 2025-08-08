"use client";

import React, { useState, useCallback } from 'react';
import {
  Share2,
  Eye,
  EyeOff,
  Save,
  AlertCircle,
  CheckCircle,
  X,
  ExternalLink,
  TestTube,
  Globe,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  MessageCircle,
  Heart,
  Mail,
  Phone,
  MapPin,
  Link,
  Copy,
  RefreshCw
} from 'lucide-react';
import { useSettings } from '@/contexts/settings-context';
import { useSettingsForm } from '@/hooks/use-settings-form';

interface SocialPlatform {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  placeholder: string;
  validation: RegExp;
  errorMessage: string;
}

const SocialMediaSection: React.FC = () => {
  const { settings, updateSettings, validation } = useSettings();
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'links' | 'preview' | 'testing'>('links');
  const [testingLinks, setTestingLinks] = useState(false);
  const [testResults, setTestResults] = useState<Record<string, { status: 'success' | 'error' | 'pending'; message: string }>>({});

  const {
    formData,
    updateField,
    saveChanges,
    isSubmitting: isSaving,
    hasChanges,
    errors: formErrors
  } = useSettingsForm({
    section: 'social_media',
    autoSave: true,
    autoSaveDelay: 2000
  });

  const socialData = formData?.social_media || settings?.social_media;

  const tabs = [
    { id: 'links', label: 'Social Links', icon: Share2 },
    { id: 'preview', label: 'Preview Cards', icon: Eye },
    { id: 'testing', label: 'Link Testing', icon: TestTube }
  ];

  const socialPlatforms: SocialPlatform[] = [
    {
      id: 'facebook',
      name: 'Facebook',
      icon: Facebook,
      color: '#1877f2',
      placeholder: 'https://facebook.com/apexnutrition',
      validation: /^https?:\/\/(www\.)?facebook\.com\/.+/,
      errorMessage: 'Please enter a valid Facebook URL'
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: Instagram,
      color: '#e4405f',
      placeholder: 'https://instagram.com/apexnutrition',
      validation: /^https?:\/\/(www\.)?instagram\.com\/.+/,
      errorMessage: 'Please enter a valid Instagram URL'
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: Twitter,
      color: '#1da1f2',
      placeholder: 'https://twitter.com/apexnutrition',
      validation: /^https?:\/\/(www\.)?twitter\.com\/.+/,
      errorMessage: 'Please enter a valid Twitter URL'
    },
    {
      id: 'youtube',
      name: 'YouTube',
      icon: Youtube,
      color: '#ff0000',
      placeholder: 'https://youtube.com/@apexnutrition',
      validation: /^https?:\/\/(www\.)?youtube\.com\/.+/,
      errorMessage: 'Please enter a valid YouTube URL'
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: Linkedin,
      color: '#0077b5',
      placeholder: 'https://linkedin.com/company/apexnutrition',
      validation: /^https?:\/\/(www\.)?linkedin\.com\/.+/,
      errorMessage: 'Please enter a valid LinkedIn URL'
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      icon: MessageCircle,
      color: '#000000',
      placeholder: 'https://tiktok.com/@apexnutrition',
      validation: /^https?:\/\/(www\.)?tiktok\.com\/.+/,
      errorMessage: 'Please enter a valid TikTok URL'
    },
    {
      id: 'pinterest',
      name: 'Pinterest',
      icon: Heart,
      color: '#bd081c',
      placeholder: 'https://pinterest.com/apexnutrition',
      validation: /^https?:\/\/(www\.)?pinterest\.com\/.+/,
      errorMessage: 'Please enter a valid Pinterest URL'
    }
  ];

  const handleSocialLinkUpdate = useCallback((platform: string, value: string) => {
    updateField(platform, value);
  }, [updateField]);

  const validateUrl = useCallback((url: string, validation: RegExp): boolean => {
    if (!url) return true; // Empty URLs are valid (optional)
    return validation.test(url);
  }, []);

  const getPlatformError = useCallback((platform: string): string | null => {
    const platformData = socialPlatforms.find(p => p.id === platform);
    if (!platformData) return null;

    const url = socialData?.[platform as keyof typeof socialData] as string;
    if (!url) return null;

    return validateUrl(url, platformData.validation) ? null : platformData.errorMessage;
  }, [socialData, validateUrl]);

  const handleSave = async () => {
    if (!hasChanges) {
      alert('No changes to save');
      return;
    }

    try {
      const result = await saveChanges();
      if (result && result.success) {
        alert('Social media settings saved successfully!');
      } else {
        alert(`Save failed: ${result?.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error during save:', error);
      alert(`Error during save: ${error}`);
    }
  };

  const testAllLinks = useCallback(async () => {
    setTestingLinks(true);
    const results: Record<string, { status: 'success' | 'error' | 'pending'; message: string }> = {};

    // Simulate link testing
    for (const platform of socialPlatforms) {
      const url = socialData?.[platform.id as keyof typeof socialData] as string;
      if (!url) {
        results[platform.id] = { status: 'pending', message: 'No URL provided' };
        continue;
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Simulate test results (in real implementation, this would make actual HTTP requests)
      const isValid = validateUrl(url, platform.validation);
      if (isValid) {
        results[platform.id] = { status: 'success', message: 'Link is accessible' };
      } else {
        results[platform.id] = { status: 'error', message: 'Invalid URL format' };
      }
    }

    setTestResults(results);
    setTestingLinks(false);
  }, [socialData, validateUrl]);

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  }, []);

  const renderSocialLinksTab = () => (
    <div className="space-y-8">
      {/* Social Media Links */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">Social Media Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {socialPlatforms.map((platform) => {
            const Icon = platform.icon;
            const url = socialData?.[platform.id as keyof typeof socialData] as string;
            const error = getPlatformError(platform.id);

            return (
              <div key={platform.id} className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: platform.color }}
                  >
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">
                      {platform.name}
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        value={url || ''}
                        onChange={(e) => handleSocialLinkUpdate(platform.id, e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors text-gray-900 placeholder-gray-500 ${
                          error ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder={platform.placeholder}
                      />
                      {url && (
                        <button
                          onClick={() => copyToClipboard(url)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    {error && (
                      <p className="text-red-500 text-sm mt-1">{error}</p>
                    )}
                    {url && !error && (
                      <div className="flex items-center space-x-2 text-green-600 text-sm">
                        <CheckCircle className="h-4 w-4" />
                        <span>Valid {platform.name} URL</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Social Media Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <Globe className="h-5 w-5 text-blue-600" />
          <span className="text-blue-800 font-medium">Social Media Tips</span>
        </div>
        <ul className="text-blue-700 text-sm mt-2 space-y-1">
          <li>• Use complete URLs including https:// for all social media links</li>
          <li>• Ensure your social media profiles are public and accessible</li>
          <li>• Keep your social media links updated and active</li>
          <li>• Consider using branded hashtags in your social media content</li>
        </ul>
      </div>
    </div>
  );

  const renderPreviewTab = () => (
    <div className="space-y-8">
      {/* Social Media Preview Cards */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">Social Media Preview Cards</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {socialPlatforms.map((platform) => {
            const Icon = platform.icon;
            const url = socialData?.[platform.id as keyof typeof socialData] as string;

            if (!url) return null;

            return (
              <div key={platform.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: platform.color }}
                    >
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{platform.name}</h4>
                      <p className="text-sm text-gray-500">Social Media</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Link className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600 truncate">{url}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-600">Active</span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => window.open(url, '_blank')}
                      className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>Visit Profile</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Social Media Summary */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Social Media Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {socialPlatforms.filter(p => socialData?.[p.id as keyof typeof socialData]).length}
            </div>
            <div className="text-sm text-gray-600">Active Platforms</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {socialPlatforms.filter(p => {
                const url = socialData?.[p.id as keyof typeof socialData] as string;
                return url && validateUrl(url, p.validation);
              }).length}
            </div>
            <div className="text-sm text-gray-600">Valid Links</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {socialPlatforms.filter(p => {
                const url = socialData?.[p.id as keyof typeof socialData] as string;
                return url && !validateUrl(url, p.validation);
              }).length}
            </div>
            <div className="text-sm text-gray-600">Invalid Links</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {Math.round((socialPlatforms.filter(p => socialData?.[p.id as keyof typeof socialData]).length / socialPlatforms.length) * 100)}%
            </div>
            <div className="text-sm text-gray-600">Coverage</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTestingTab = () => (
    <div className="space-y-8">
      {/* Link Testing */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Link Testing</h3>
          <button
            onClick={testAllLinks}
            disabled={testingLinks}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {testingLinks ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Testing...</span>
              </>
            ) : (
              <>
                <TestTube className="h-4 w-4" />
                <span>Test All Links</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {socialPlatforms.map((platform) => {
            const Icon = platform.icon;
            const url = socialData?.[platform.id as keyof typeof socialData] as string;
            const testResult = testResults[platform.id];

            return (
              <div key={platform.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: platform.color }}
                  >
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{platform.name}</h4>
                    <p className="text-sm text-gray-500 truncate">{url || 'No URL provided'}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {testResult ? (
                    <div className={`flex items-center space-x-2 text-sm ${
                      testResult.status === 'success' ? 'text-green-600' :
                      testResult.status === 'error' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {testResult.status === 'success' && <CheckCircle className="h-4 w-4" />}
                      {testResult.status === 'error' && <AlertCircle className="h-4 w-4" />}
                      {testResult.status === 'pending' && <RefreshCw className="h-4 w-4 animate-spin" />}
                      <span>{testResult.message}</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                      <span>Not tested</span>
                    </div>
                  )}

                  {url && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => window.open(url, '_blank')}
                        className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
                      >
                        <ExternalLink className="h-3 w-3" />
                        <span>Open Link</span>
                      </button>
                      <button
                        onClick={() => copyToClipboard(url)}
                        className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-700"
                      >
                        <Copy className="h-3 w-3" />
                        <span>Copy URL</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Testing Results Summary */}
      {Object.keys(testResults).length > 0 && (
        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Testing Results</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {Object.values(testResults).filter(r => r.status === 'success').length}
              </div>
              <div className="text-sm text-gray-600">Successful</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {Object.values(testResults).filter(r => r.status === 'error').length}
              </div>
              <div className="text-sm text-gray-600">Failed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {Object.values(testResults).filter(r => r.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderPreview = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Social Media Preview</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Live Preview</span>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Active Social Media Links */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-3">Active Social Media Links</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {socialPlatforms.map((platform) => {
              const Icon = platform.icon;
              const url = socialData?.[platform.id as keyof typeof socialData] as string;

              if (!url) return null;

              return (
                <div key={platform.id} className="text-center">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-2"
                    style={{ backgroundColor: platform.color }}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">{platform.name}</p>
                  <p className="text-xs text-gray-500 truncate">{url}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Social Media Statistics */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-3">Statistics</h4>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-gray-900">
                  {socialPlatforms.filter(p => socialData?.[p.id as keyof typeof socialData]).length}
                </div>
                <div className="text-xs text-gray-600">Active Platforms</div>
              </div>
              <div>
                <div className="text-lg font-bold text-green-600">
                  {socialPlatforms.filter(p => {
                    const url = socialData?.[p.id as keyof typeof socialData] as string;
                    return url && validateUrl(url, p.validation);
                  }).length}
                </div>
                <div className="text-xs text-gray-600">Valid Links</div>
              </div>
              <div>
                <div className="text-lg font-bold text-red-600">
                  {socialPlatforms.filter(p => {
                    const url = socialData?.[p.id as keyof typeof socialData] as string;
                    return url && !validateUrl(url, p.validation);
                  }).length}
                </div>
                <div className="text-xs text-gray-600">Invalid Links</div>
              </div>
              <div>
                <div className="text-lg font-bold text-blue-600">
                  {Math.round((socialPlatforms.filter(p => socialData?.[p.id as keyof typeof socialData]).length / socialPlatforms.length) * 100)}%
                </div>
                <div className="text-xs text-gray-600">Coverage</div>
              </div>
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
          <Share2 className="h-6 w-6 text-red-600" />
          <h2 className="text-2xl font-bold text-gray-900">Social Media</h2>
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
            {activeTab === 'links' && renderSocialLinksTab()}
            {activeTab === 'preview' && renderPreviewTab()}
            {activeTab === 'testing' && renderTestingTab()}
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

export default SocialMediaSection;