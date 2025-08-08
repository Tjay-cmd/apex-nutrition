"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/firebase-auth-context';
import {
  getStoreSettings,
  updateStoreSettings,
  validateSettings,
  getSettingsPermissions,
  uploadSettingsImage,
  deleteSettingsImage,
  logSettingsChange,
  exportSettings,
  importSettings
} from '@/lib/settings-queries';
import type {
  StoreSettings,
  SettingsUpdate,
  SettingsValidation,
  SettingsPermissions
} from '@/types/settings';

interface SettingsContextType {
  // State
  settings: StoreSettings | null;
  loading: boolean;
  error: string | null;
  permissions: SettingsPermissions;
  validation: SettingsValidation;
  hasUnsavedChanges: boolean;
  autoSaveStatus: 'idle' | 'saving' | 'saved' | 'error';

  // CRUD Operations
  updateSettings: (updates: SettingsUpdate) => Promise<{ success: boolean; error?: string }>;
  refreshSettings: () => Promise<void>;
  resetSettings: () => Promise<void>;

  // Image Management
  uploadImage: (file: File, path: string) => Promise<{ success: boolean; url?: string; error?: string }>;
  deleteImage: (imageUrl: string) => Promise<{ success: boolean; error?: string }>;

  // Validation & Permissions
  validateCurrentSettings: () => SettingsValidation;
  checkPermission: (permission: keyof SettingsPermissions) => boolean;

  // Import/Export
  exportSettingsData: () => Promise<string>;
  importSettingsData: (jsonData: string) => Promise<{ success: boolean; error?: string }>;

  // Auto-save
  enableAutoSave: () => void;
  disableAutoSave: () => void;
  saveChanges: () => Promise<void>;

  // UI State
  setHasUnsavedChanges: (hasChanges: boolean) => void;
  clearError: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

interface SettingsProviderProps {
  children: React.ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const { user } = useAuth();

  // Check if user has admin permissions
  const hasAdminAccess = user?.role === 'admin' || user?.role === 'super_admin';
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<SettingsPermissions>({
    can_edit_company_info: false,
    can_edit_branding: false,
    can_edit_social_media: false,
    can_edit_legal_pages: false,
    can_edit_seo_settings: false
  });
  const [validation, setValidation] = useState<SettingsValidation>({
    isValid: true,
    errors: [],
    warnings: []
  });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [pendingChanges, setPendingChanges] = useState<SettingsUpdate | null>(null);

    // Initialize settings and permissions
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    if (!hasAdminAccess) {
      setLoading(false);
      setError('Access denied. Admin privileges required.');
      return;
    }

    initializeSettings();
    updatePermissions();
  }, [user, hasAdminAccess]);

  // Real-time listener for settings changes
  useEffect(() => {
    if (!user || !hasAdminAccess) return;

    const settingsRef = doc(db, 'store_settings', 'main');
    const unsubscribe = onSnapshot(
      settingsRef,
      (doc) => {
        if (doc.exists()) {
          const newSettings = { id: doc.id, ...doc.data() } as StoreSettings;
          setSettings(newSettings);

          // Validate new settings
          const newValidation = validateSettings(newSettings);
          setValidation(newValidation);

          setLoading(false);
        }
      },
      (error) => {
        console.error('Error listening to settings changes:', error);
        setError('Failed to load settings');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, hasAdminAccess]);

  // Auto-save functionality
  useEffect(() => {
    if (!autoSaveEnabled || !pendingChanges || !user) return;

    const autoSaveTimer = setTimeout(async () => {
      await saveChanges();
    }, 2000); // Auto-save after 2 seconds of inactivity

    return () => clearTimeout(autoSaveTimer);
  }, [pendingChanges, autoSaveEnabled, user]);

  const initializeSettings = async () => {
    try {
      setLoading(true);
      setError(null);

      const settingsData = await getStoreSettings();
      if (settingsData) {
        setSettings(settingsData);

        // Validate settings
        const validationResult = validateSettings(settingsData);
        setValidation(validationResult);
      }
    } catch (err) {
      console.error('Error initializing settings:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load settings';

      // Check if it's a permission error
      if (errorMessage.includes('Missing or insufficient permissions')) {
        setError('Access denied. Admin privileges required.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const updatePermissions = () => {
    if (user) {
      const userPermissions = getSettingsPermissions(user.role);
      setPermissions(userPermissions);
    }
  };

  const updateSettings = async (updates: SettingsUpdate): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    try {
      console.log('Updating settings with:', updates);
      console.log('Current permissions:', permissions);
      console.log('User role:', user.role);

      // Check permissions for each section being updated
      const sectionsToUpdate = Object.keys(updates) as (keyof SettingsUpdate)[];
      for (const section of sectionsToUpdate) {
        const permissionKey = `can_edit_${section}` as keyof SettingsPermissions;
        console.log(`Checking permission for ${section}:`, permissionKey, permissions[permissionKey]);
        if (!permissions[permissionKey]) {
          console.log(`Permission denied for ${section}`);
          return { success: false, error: `No permission to edit ${section}` };
        }
      }

      // Validate updates
      const validationResult = validateSettings(updates);
      if (!validationResult.isValid) {
        return { success: false, error: `Validation failed: ${validationResult.errors.join(', ')}` };
      }

      // Log changes for audit trail
      if (settings) {
        for (const [section, sectionUpdates] of Object.entries(updates)) {
          if (sectionUpdates) {
            await logSettingsChange(
              'update',
              section,
              (settings as any)[section],
              sectionUpdates,
              user.id
            );
          }
        }
      }

      const result = await updateStoreSettings(updates, user.id);

      if (result.success) {
        setHasUnsavedChanges(false);
        setPendingChanges(null);
      }

      return result;
    } catch (err) {
      console.error('Error updating settings:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Update failed' };
    }
  };

  const refreshSettings = async () => {
    await initializeSettings();
  };

  const resetSettings = async () => {
    if (!user) return;

    try {
      setLoading(true);
      // This would reset to default settings
      // Implementation depends on your requirements
      await refreshSettings();
    } catch (err) {
      console.error('Error resetting settings:', err);
      setError('Failed to reset settings');
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file: File, path: string): Promise<{ success: boolean; url?: string; error?: string }> => {
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    try {
      const result = await uploadSettingsImage(file, path);
      return result;
    } catch (err) {
      console.error('Error uploading image:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Upload failed' };
    }
  };

  const deleteImage = async (imageUrl: string): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    try {
      const result = await deleteSettingsImage(imageUrl);
      return result;
    } catch (err) {
      console.error('Error deleting image:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Delete failed' };
    }
  };

  const validateCurrentSettings = (): SettingsValidation => {
    if (!settings) {
      return { isValid: false, errors: ['No settings loaded'], warnings: [] };
    }

    const validationResult = validateSettings(settings);
    setValidation(validationResult);
    return validationResult;
  };

  const checkPermission = (permission: keyof SettingsPermissions): boolean => {
    return permissions[permission] || false;
  };

  const exportSettingsData = async (): Promise<string> => {
    try {
      const exportData = await exportSettings();
      return exportData;
    } catch (err) {
      console.error('Error exporting settings:', err);
      throw new Error(err instanceof Error ? err.message : 'Export failed');
    }
  };

  const importSettingsData = async (jsonData: string): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    try {
      const result = await importSettings(jsonData, user.id);
      return result;
    } catch (err) {
      console.error('Error importing settings:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Import failed' };
    }
  };

  const enableAutoSave = () => {
    setAutoSaveEnabled(true);
  };

  const disableAutoSave = () => {
    setAutoSaveEnabled(false);
  };

  const saveChanges = async () => {
    if (!pendingChanges || !user) return;

    try {
      setAutoSaveStatus('saving');
      const result = await updateSettings(pendingChanges);

      if (result.success) {
        setAutoSaveStatus('saved');
        setHasUnsavedChanges(false);
        setPendingChanges(null);

        // Reset status after a delay
        setTimeout(() => setAutoSaveStatus('idle'), 2000);
      } else {
        setAutoSaveStatus('error');
        setError(result.error || 'Save failed');
      }
    } catch (err) {
      console.error('Error saving changes:', err);
      setAutoSaveStatus('error');
      setError('Save failed');
    }
  };

  const clearError = () => {
    setError(null);
  };

  // Prepare changes for auto-save
  const prepareChanges = useCallback((updates: SettingsUpdate) => {
    setPendingChanges(updates);
    setHasUnsavedChanges(true);
  }, []);

  const value: SettingsContextType = {
    // State
    settings,
    loading,
    error,
    permissions,
    validation,
    hasUnsavedChanges,
    autoSaveStatus,

    // CRUD Operations
    updateSettings,
    refreshSettings,
    resetSettings,

    // Image Management
    uploadImage,
    deleteImage,

    // Validation & Permissions
    validateCurrentSettings,
    checkPermission,

    // Import/Export
    exportSettingsData,
    importSettingsData,

    // Auto-save
    enableAutoSave,
    disableAutoSave,
    saveChanges,

    // UI State
    setHasUnsavedChanges,
    clearError
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};