"use client";

import React, { useState, useCallback } from 'react';
import {
  Palette,
  Type,
  Upload,
  Eye,
  EyeOff,
  Save,
  AlertCircle,
  CheckCircle,
  X,
  Download,
  Image as ImageIcon,
  Code,
  Settings,
  Sparkles
} from 'lucide-react';
import { useSettings } from '@/contexts/settings-context';
import { useSettingsForm } from '@/hooks/use-settings-form';

const BrandingSection: React.FC = () => {
  const { settings, updateSettings, validation } = useSettings();
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'logos' | 'colors' | 'typography' | 'css'>('logos');
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);

  const {
    formData,
    updateField,
    saveChanges,
    isSubmitting: isSaving,
    hasChanges,
    errors: formErrors
  } = useSettingsForm({
    section: 'branding',
    autoSave: true,
    autoSaveDelay: 2000
  });

  const brandingData = formData?.branding || settings?.branding;

  const tabs = [
    { id: 'logos', label: 'Logos & Icons', icon: ImageIcon },
    { id: 'colors', label: 'Color Scheme', icon: Palette },
    { id: 'typography', label: 'Typography', icon: Type },
    { id: 'css', label: 'Custom CSS', icon: Code }
  ];

  const colorSchemes = [
    {
      name: 'Apex Red',
      colors: {
        primary: '#e11d48',
        secondary: '#facc15',
        accent: '#f59e0b',
        background: '#ffffff',
        surface: '#f8fafc',
        text: '#1e293b',
        muted: '#64748b'
      }
    },
    {
      name: 'Dark Premium',
      colors: {
        primary: '#dc2626',
        secondary: '#fbbf24',
        accent: '#f97316',
        background: '#0f172a',
        surface: '#1e293b',
        text: '#f1f5f9',
        muted: '#94a3b8'
      }
    },
    {
      name: 'Light Modern',
      colors: {
        primary: '#ef4444',
        secondary: '#eab308',
        accent: '#f97316',
        background: '#ffffff',
        surface: '#f8fafc',
        text: '#0f172a',
        muted: '#64748b'
      }
    }
  ];

  const fontOptions = [
    { name: 'Inter', value: 'Inter', category: 'Sans-serif' },
    { name: 'Poppins', value: 'Poppins', category: 'Sans-serif' },
    { name: 'Roboto', value: 'Roboto', category: 'Sans-serif' },
    { name: 'Open Sans', value: 'Open Sans', category: 'Sans-serif' },
    { name: 'Playfair Display', value: 'Playfair Display', category: 'Serif' },
    { name: 'Merriweather', value: 'Merriweather', category: 'Serif' },
    { name: 'Source Code Pro', value: 'Source Code Pro', category: 'Monospace' }
  ];

  const handleLogoUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    try {
      // Simulate upload - in real implementation, this would upload to Firebase Storage
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        updateField('logo_url', result);
        setUploadingLogo(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Logo upload failed:', error);
      setUploadingLogo(false);
    }
  }, [updateField]);

  const handleFaviconUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingFavicon(true);
    try {
      // Simulate upload - in real implementation, this would upload to Firebase Storage
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        updateField('favicon_url', result);
        setUploadingFavicon(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Favicon upload failed:', error);
      setUploadingFavicon(false);
    }
  }, [updateField]);

  const handleColorSchemeSelect = useCallback((scheme: typeof colorSchemes[0]) => {
    updateField('color_scheme', scheme);
  }, [updateField]);

  const handleSave = async () => {
    if (!hasChanges) {
      alert('No changes to save');
      return;
    }

    try {
      const result = await saveChanges();
      if (result && result.success) {
        alert('Branding settings saved successfully!');
      } else {
        alert(`Save failed: ${result?.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error during save:', error);
      alert(`Error during save: ${error}`);
    }
  };

  const renderLogosTab = () => (
    <div className="space-y-8">
      {/* Logo Upload */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Logo</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Logo
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-red-500 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
                id="logo-upload"
                disabled={uploadingLogo}
              />
              <label htmlFor="logo-upload" className="cursor-pointer">
                {uploadingLogo ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
                    <span className="text-gray-600">Uploading...</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                    <p className="text-sm text-gray-600">Click to upload logo</p>
                    <p className="text-xs text-gray-500">PNG, JPG, SVG up to 5MB</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Logo
            </label>
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              {brandingData?.logo_url ? (
                <img
                  src={brandingData.logo_url}
                  alt="Current logo"
                  className="max-h-20 mx-auto"
                />
              ) : (
                <div className="text-center text-gray-500">
                  <ImageIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No logo uploaded</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Favicon Upload */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Favicon</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Favicon
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-red-500 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleFaviconUpload}
                className="hidden"
                id="favicon-upload"
                disabled={uploadingFavicon}
              />
              <label htmlFor="favicon-upload" className="cursor-pointer">
                {uploadingFavicon ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
                    <span className="text-gray-600">Uploading...</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                    <p className="text-sm text-gray-600">Click to upload favicon</p>
                    <p className="text-xs text-gray-500">ICO, PNG up to 1MB</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Favicon
            </label>
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              {brandingData?.favicon_url ? (
                <img
                  src={brandingData.favicon_url}
                  alt="Current favicon"
                  className="h-8 w-8 mx-auto"
                />
              ) : (
                <div className="text-center text-gray-500">
                  <ImageIcon className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No favicon uploaded</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderColorsTab = () => (
    <div className="space-y-8">
      {/* Color Scheme Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Color Scheme</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {colorSchemes.map((scheme) => (
            <div
              key={scheme.name}
              onClick={() => handleColorSchemeSelect(scheme)}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                brandingData?.color_scheme?.name === scheme.name
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-200 hover:border-red-300'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">{scheme.name}</h4>
                {brandingData?.color_scheme?.name === scheme.name && (
                  <CheckCircle className="h-5 w-5 text-red-600" />
                )}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(scheme.colors).map(([key, color]) => (
                  <div key={key} className="text-center">
                    <div
                      className="w-8 h-8 rounded border border-gray-200 mx-auto mb-1"
                      style={{ backgroundColor: color }}
                    ></div>
                    <p className="text-xs text-gray-600 capitalize">{key}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Color Picker */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Custom Colors</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary Color
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={brandingData?.custom_colors?.primary || '#e11d48'}
                onChange={(e) => updateField('custom_colors.primary', e.target.value)}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={brandingData?.custom_colors?.primary || '#e11d48'}
                onChange={(e) => updateField('custom_colors.primary', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                placeholder="#e11d48"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Secondary Color
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={brandingData?.custom_colors?.secondary || '#facc15'}
                onChange={(e) => updateField('custom_colors.secondary', e.target.value)}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={brandingData?.custom_colors?.secondary || '#facc15'}
                onChange={(e) => updateField('custom_colors.secondary', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                placeholder="#facc15"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Live Preview */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
        <div className="border border-gray-200 rounded-lg p-6 bg-white">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <button
                className="px-4 py-2 rounded-lg text-white font-medium"
                style={{
                  backgroundColor: brandingData?.custom_colors?.primary || brandingData?.color_scheme?.colors?.primary || '#e11d48'
                }}
              >
                Primary Button
              </button>
              <button
                className="px-4 py-2 rounded-lg border font-medium"
                style={{
                  borderColor: brandingData?.custom_colors?.secondary || brandingData?.color_scheme?.colors?.secondary || '#facc15',
                  color: brandingData?.custom_colors?.secondary || brandingData?.color_scheme?.colors?.secondary || '#facc15'
                }}
              >
                Secondary Button
              </button>
            </div>
            <div className="p-4 rounded-lg" style={{
              backgroundColor: brandingData?.color_scheme?.colors?.surface || '#f8fafc'
            }}>
              <h4 className="font-semibold mb-2" style={{
                color: brandingData?.color_scheme?.colors?.text || '#1e293b'
              }}>
                Sample Content
              </h4>
              <p className="text-sm" style={{
                color: brandingData?.color_scheme?.colors?.muted || '#64748b'
              }}>
                This is how your content will look with the selected color scheme.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTypographyTab = () => (
    <div className="space-y-8">
      {/* Font Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Typography</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary Font
            </label>
            <select
              value={brandingData?.typography?.primary_font || 'Inter'}
              onChange={(e) => updateField('typography.primary_font', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors text-gray-900"
            >
              {fontOptions.map((font) => (
                <option key={font.value} value={font.value}>
                  {font.name} ({font.category})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Secondary Font
            </label>
            <select
              value={brandingData?.typography?.secondary_font || 'Poppins'}
              onChange={(e) => updateField('typography.secondary_font', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors text-gray-900"
            >
              {fontOptions.map((font) => (
                <option key={font.value} value={font.value}>
                  {font.name} ({font.category})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Font Sizes */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Font Sizes</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Heading Size
            </label>
            <input
              type="range"
              min="1"
              max="3"
              step="0.1"
              value={brandingData?.typography?.heading_scale || 1.5}
              onChange={(e) => updateField('typography.heading_scale', parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Small</span>
              <span>Medium</span>
              <span>Large</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Body Size
            </label>
            <input
              type="range"
              min="0.8"
              max="1.2"
              step="0.05"
              value={brandingData?.typography?.body_scale || 1}
              onChange={(e) => updateField('typography.body_scale', parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Small</span>
              <span>Medium</span>
              <span>Large</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Line Height
            </label>
            <input
              type="range"
              min="1.2"
              max="2"
              step="0.1"
              value={brandingData?.typography?.line_height || 1.6}
              onChange={(e) => updateField('typography.line_height', parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Tight</span>
              <span>Normal</span>
              <span>Loose</span>
            </div>
          </div>
        </div>
      </div>

      {/* Typography Preview */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
        <div className="border border-gray-200 rounded-lg p-6 bg-white">
          <div className="space-y-4">
            <h1
              className="font-bold"
              style={{
                fontFamily: brandingData?.typography?.primary_font || 'Inter',
                fontSize: `${(brandingData?.typography?.heading_scale || 1.5) * 2}rem`,
                lineHeight: brandingData?.typography?.line_height || 1.6
              }}
            >
              Main Heading
            </h1>
            <h2
              className="font-semibold"
              style={{
                fontFamily: brandingData?.typography?.primary_font || 'Inter',
                fontSize: `${(brandingData?.typography?.heading_scale || 1.5) * 1.5}rem`,
                lineHeight: brandingData?.typography?.line_height || 1.6
              }}
            >
              Subheading
            </h2>
            <p
              style={{
                fontFamily: brandingData?.typography?.secondary_font || 'Poppins',
                fontSize: `${(brandingData?.typography?.body_scale || 1) * 1}rem`,
                lineHeight: brandingData?.typography?.line_height || 1.6
              }}
            >
              This is a sample paragraph that demonstrates how your typography settings will look.
              The text should be readable and well-spaced according to your chosen settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCSSTab = () => (
    <div className="space-y-8">
      {/* CSS Editor */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Custom CSS</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">
              Custom Styles
            </label>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => updateField('custom_css', '/* Add your custom CSS here */\n\n')}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Reset
              </button>
            </div>
          </div>
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <div className="bg-gray-900 text-gray-100 px-4 py-2 text-sm font-mono">
              CSS Editor
            </div>
            <textarea
              value={brandingData?.custom_css || '/* Add your custom CSS here */\n\n'}
              onChange={(e) => updateField('custom_css', e.target.value)}
              className="w-full h-64 p-4 bg-gray-900 text-gray-100 font-mono text-sm border-0 focus:ring-0 resize-none"
              placeholder="/* Add your custom CSS here */"
              spellCheck={false}
            />
          </div>
        </div>
      </div>

      {/* CSS Preview */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">CSS Preview</h3>
        <div className="border border-gray-200 rounded-lg p-6 bg-white">
          <div className="space-y-4">
            <div className="p-4 border border-gray-200 rounded">
              <h4 className="font-semibold mb-2">Sample Element</h4>
              <p className="text-sm text-gray-600">
                This element will be styled with your custom CSS.
                Changes will be applied in real-time as you edit the CSS above.
              </p>
            </div>
            <div className="text-xs text-gray-500">
              <p>Note: Custom CSS is applied globally. Use specific selectors to avoid conflicts.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPreview = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Branding Preview</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Live Preview</span>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Logo Preview */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-3">Logo</h4>
          <div className="bg-gray-50 rounded-lg p-4">
            {brandingData?.logo_url ? (
              <img
                src={brandingData.logo_url}
                alt="Brand logo"
                className="max-h-16 mx-auto"
              />
            ) : (
              <div className="text-center text-gray-500">
                <ImageIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No logo uploaded</p>
              </div>
            )}
          </div>
        </div>

        {/* Color Scheme Preview */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-3">Color Scheme</h4>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(brandingData?.color_scheme?.colors || {}).map(([key, color]) => (
                <div key={key} className="text-center">
                  <div
                    className="w-12 h-12 rounded border border-gray-200 mx-auto mb-2"
                    style={{ backgroundColor: color }}
                  ></div>
                  <p className="text-xs text-gray-600 capitalize">{key}</p>
                  <p className="text-xs text-gray-500">{color}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Typography Preview */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-3">Typography</h4>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                <strong>Primary Font:</strong> {brandingData?.typography?.primary_font || 'Inter'}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Secondary Font:</strong> {brandingData?.typography?.secondary_font || 'Poppins'}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Heading Scale:</strong> {brandingData?.typography?.heading_scale || 1.5}x
              </p>
              <p className="text-sm text-gray-600">
                <strong>Body Scale:</strong> {brandingData?.typography?.body_scale || 1}x
              </p>
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
          <Palette className="h-6 w-6 text-red-600" />
          <h2 className="text-2xl font-bold text-gray-900">Branding & Design</h2>
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
            {activeTab === 'logos' && renderLogosTab()}
            {activeTab === 'colors' && renderColorsTab()}
            {activeTab === 'typography' && renderTypographyTab()}
            {activeTab === 'css' && renderCSSTab()}
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

export default BrandingSection;