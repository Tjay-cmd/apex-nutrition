import { useState, useEffect, useCallback, useRef } from 'react';
import { useSettings } from '@/contexts/settings-context';
import type { SettingsUpdate } from '@/types/settings';

interface UseSettingsFormOptions {
  autoSave?: boolean;
  autoSaveDelay?: number;
  validateOnChange?: boolean;
  section?: keyof SettingsUpdate;
}

export const useSettingsForm = (options: UseSettingsFormOptions = {}) => {
  const {
    autoSave = true,
    autoSaveDelay = 2000,
    validateOnChange = true,
    section
  } = options;

  const {
    settings,
    updateSettings,
    validation,
    hasUnsavedChanges,
    autoSaveStatus,
    setHasUnsavedChanges,
    clearError
  } = useSettings();

  const [formData, setFormData] = useState<SettingsUpdate>({});
  const [localValidation, setLocalValidation] = useState(validation);
  const [isDirty, setIsDirty] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize form data from settings
  useEffect(() => {
    console.log('Initializing form data:', { settings, section });
    if (settings && section) {
      const sectionData = (settings as any)[section];
      console.log(`Section data for ${section}:`, sectionData);
      setFormData({ [section]: sectionData });
    } else {
      console.log('No settings or section available');
      setFormData({});
    }
  }, [settings, section]);

  // Update local validation when global validation changes
  useEffect(() => {
    setLocalValidation(validation);
  }, [validation]);

  // Auto-save functionality
  const triggerAutoSave = useCallback(async () => {
    if (!autoSave || !isDirty || Object.keys(formData).length === 0) return;

    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    autoSaveTimeoutRef.current = setTimeout(async () => {
      setIsSubmitting(true);
      try {
        const result = await updateSettings(formData);
        if (result.success) {
          setIsDirty(false);
          setHasUnsavedChanges(false);
        }
      } catch (error) {
        console.error('Auto-save failed:', error);
      } finally {
        setIsSubmitting(false);
      }
    }, autoSaveDelay);
  }, [autoSave, autoSaveDelay, formData, isDirty, updateSettings, setHasUnsavedChanges]);

  // Trigger auto-save when form data changes
  useEffect(() => {
    if (isDirty) {
      triggerAutoSave();
    }
  }, [formData, isDirty, triggerAutoSave]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, []);

  // Update form field
  const updateField = useCallback((
    field: string,
    value: any,
    sectionKey?: keyof SettingsUpdate
  ) => {
    const targetSection = sectionKey || section;
    if (!targetSection) {
      console.log('No target section available');
      return;
    }

    console.log(`=== UPDATING FIELD ===`);
    console.log(`Field: ${field}`);
    console.log(`Value: ${value}`);
    console.log(`Target section: ${targetSection}`);

    // Check if field contains dots (nested path)
    if (field.includes('.')) {
      console.log('Using nested field update for:', field);
      updateNestedField(field, value, sectionKey);
      return;
    }

    setFormData(prev => {
      console.log('Previous form data:', prev);
      const currentSection = prev[targetSection] as any || {};
      console.log('Current section:', currentSection);
      const newSection = { ...currentSection, [field]: value };
      console.log('New section:', newSection);
      const newFormData = { ...prev, [targetSection]: newSection };
      console.log('Updated form data:', newFormData);
      return newFormData;
    });
    setIsDirty(true);
    setHasUnsavedChanges(true);
    console.log('Field updated, isDirty set to true');
  }, [section]);

  // Update nested field (e.g., company_info.address.street)
  const updateNestedField = useCallback((
    path: string,
    value: any,
    sectionKey?: keyof SettingsUpdate
  ) => {
    const targetSection = sectionKey || section;
    if (!targetSection) return;

    const pathParts = path.split('.');
    setFormData(prev => {
      const currentSection = prev[targetSection] as any || {};
      const newSection = { ...currentSection };

      let current = newSection;
      for (let i = 0; i < pathParts.length - 1; i++) {
        const part = pathParts[i];
        if (!current[part]) {
          current[part] = {};
        }
        current = current[part];
      }
      current[pathParts[pathParts.length - 1]] = value;

      return {
        ...prev,
        [targetSection]: newSection
      };
    });
    setIsDirty(true);
    setHasUnsavedChanges(true);
  }, [section]);

  // Update entire section
  const updateSection = useCallback((
    sectionData: any,
    sectionKey?: keyof SettingsUpdate
  ) => {
    const targetSection = sectionKey || section;
    if (!targetSection) return;

    setFormData(prev => ({
      ...prev,
      [targetSection]: sectionData
    }));
    setIsDirty(true);
    setHasUnsavedChanges(true);
  }, [section]);

  // Manual save
  const saveChanges = useCallback(async () => {
    console.log('=== SAVECHANGES CALLED ===');
    console.log('isDirty:', isDirty);
    console.log('formData:', formData);
    console.log('formData keys:', Object.keys(formData));

    if (!isDirty || Object.keys(formData).length === 0) {
      console.log('No changes to save or no form data');
      return { success: false, error: 'No changes to save' };
    }

    setIsSubmitting(true);
    try {
      console.log('Saving form data:', formData);
      console.log('Calling updateSettings...');
      const result = await updateSettings(formData);
      console.log('Save result from updateSettings:', result);

      if (result && result.success) {
        console.log('Save successful, updating state...');
        setIsDirty(false);
        setHasUnsavedChanges(false);
        return { success: true };
      } else {
        console.log('Save failed:', result?.error);
        return { success: false, error: result?.error || 'Unknown error' };
      }
    } catch (error) {
      console.error('Save failed:', error);
      return { success: false, error: 'Save failed' };
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, isDirty, updateSettings, setHasUnsavedChanges]);

  // Reset form to original settings
  const resetForm = useCallback(() => {
    if (settings && section) {
      setFormData({ [section]: (settings as any)[section] });
    } else {
      setFormData({});
    }
    setIsDirty(false);
    setHasUnsavedChanges(false);
    clearError();
  }, [settings, section, setHasUnsavedChanges, clearError]);

  // Validate current form data
  const validateForm = useCallback(() => {
    // This would use the validation logic from settings-queries.ts
    // For now, we'll use the global validation
    return localValidation;
  }, [localValidation]);

  // Get field value
  const getFieldValue = useCallback((
    field: string,
    sectionKey?: keyof SettingsUpdate
  ) => {
    const targetSection = sectionKey || section;
    if (!targetSection || !formData[targetSection]) return undefined;

    const sectionData = formData[targetSection] as any;
    return sectionData[field];
  }, [formData, section]);

  // Get nested field value
  const getNestedFieldValue = useCallback((
    path: string,
    sectionKey?: keyof SettingsUpdate
  ) => {
    const targetSection = sectionKey || section;
    if (!targetSection || !formData[targetSection]) return undefined;

    const sectionData = formData[targetSection] as any;
    const pathParts = path.split('.');

    let current = sectionData;
    for (const part of pathParts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        return undefined;
      }
    }
    return current;
  }, [formData, section]);

  return {
    // State
    formData,
    isDirty,
    isSubmitting,
    autoSaveStatus,
    validation: localValidation,

    // Actions
    updateField,
    updateNestedField,
    updateSection,
    saveChanges,
    resetForm,
    validateForm,

    // Getters
    getFieldValue,
    getNestedFieldValue,

    // Utilities
    hasChanges: isDirty,
    canSave: isDirty && Object.keys(formData).length > 0
  };
};