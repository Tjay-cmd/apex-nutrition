import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  Timestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { auth } from '@/lib/firebase';
import type {
  StoreSettings,
  SettingsUpdate,
  SettingsValidation,
  SettingsPermissions
} from '@/types/settings';
import { DEFAULT_STORE_SETTINGS } from '@/types/settings';

// Settings Collection Reference
const SETTINGS_COLLECTION = 'store_settings';
const SETTINGS_DOC_ID = 'main';

// Check if current user has admin access
const checkAdminAccess = async (): Promise<boolean> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) return false;

    const userDoc = await getDoc(doc(db, 'profiles', currentUser.uid));
    if (!userDoc.exists()) return false;

    const userData = userDoc.data();
    return userData.role === 'admin' || userData.role === 'super_admin';
  } catch (error) {
    console.error('Error checking admin access:', error);
    return false;
  }
};

// Get store settings
export const getStoreSettings = async (): Promise<StoreSettings | null> => {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as StoreSettings;
    } else {
      // Create default settings if they don't exist
      const defaultSettings: StoreSettings = {
        id: SETTINGS_DOC_ID,
        ...DEFAULT_STORE_SETTINGS,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        updated_by: 'system'
      };

      await setDoc(docRef, defaultSettings);
      return defaultSettings;
    }
  } catch (error) {
    console.error('Error fetching store settings:', error);
    throw error;
  }
};

// Update store settings
export const updateStoreSettings = async (
  updates: SettingsUpdate,
  updatedBy: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log('updateStoreSettings called with:', { updates, updatedBy });
    const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);

    const updateData = {
      ...updates,
      updated_at: new Date().toISOString(),
      updated_by: updatedBy
    };

    console.log('Updating document with data:', updateData);
    await updateDoc(docRef, updateData);
    console.log('Document updated successfully');
    return { success: true };
  } catch (error) {
    console.error('Error updating store settings:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Create or initialize store settings
export const initializeStoreSettings = async (updatedBy: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);

    const initialSettings: StoreSettings = {
      id: SETTINGS_DOC_ID,
      ...DEFAULT_STORE_SETTINGS,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      updated_by: updatedBy
    };

    await setDoc(docRef, initialSettings);
    return { success: true };
  } catch (error) {
    console.error('Error initializing store settings:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Upload image to Firebase Storage
export const uploadSettingsImage = async (
  file: File,
  path: string
): Promise<{ success: boolean; url?: string; error?: string }> => {
  try {
    const storageRef = ref(storage, `settings/${path}/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    return { success: true, url: downloadURL };
  } catch (error) {
    console.error('Error uploading settings image:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    };
  }
};

// Delete image from Firebase Storage
export const deleteSettingsImage = async (imageUrl: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
    return { success: true };
  } catch (error) {
    console.error('Error deleting settings image:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Delete failed'
    };
  }
};

// Validate settings data
export const validateSettings = (settings: Partial<StoreSettings>): SettingsValidation => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Company info validation
  if (settings.company_info) {
    const { name, contact, address } = settings.company_info;

    if (!name || name.trim().length === 0) {
      errors.push('Company name is required');
    }

    if (contact) {
      if (!contact.email || !contact.email.includes('@')) {
        errors.push('Valid company email is required');
      }

      if (!contact.phone || contact.phone.trim().length === 0) {
        errors.push('Company phone number is required');
      }
    }

    if (address) {
      if (!address.street || address.street.trim().length === 0) {
        errors.push('Company street address is required');
      }

      if (!address.city || address.city.trim().length === 0) {
        errors.push('Company city is required');
      }
    }
  }

  // Branding validation
  if (settings.branding) {
    const { primary_color, secondary_color } = settings.branding;

    if (primary_color && !primary_color.match(/^#[0-9A-F]{6}$/i)) {
      errors.push('Primary color must be a valid hex color');
    }

    if (secondary_color && !secondary_color.match(/^#[0-9A-F]{6}$/i)) {
      errors.push('Secondary color must be a valid hex color');
    }
  }

  // SEO validation
  if (settings.seo_settings) {
    Object.entries(settings.seo_settings).forEach(([page, seo]) => {
      if (seo) {
        if (!seo.title || seo.title.trim().length === 0) {
          errors.push(`${page} SEO title is required`);
        }

        if (!seo.description || seo.description.trim().length === 0) {
          errors.push(`${page} SEO description is required`);
        }

        if (seo.description && seo.description.length > 160) {
          warnings.push(`${page} SEO description is longer than recommended (160 characters)`);
        }
      }
    });
  }

  // Social media validation
  if (settings.social_media) {
    Object.entries(settings.social_media).forEach(([platform, url]) => {
      if (url && url.trim().length > 0) {
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          errors.push(`${platform} URL must start with http:// or https://`);
        }
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// Get user permissions for settings
export const getSettingsPermissions = (userRole: string): SettingsPermissions => {
  const isAdmin = userRole === 'admin' || userRole === 'super_admin';
  const isSuperAdmin = userRole === 'super_admin';

  return {
    can_edit_company_info: isAdmin,
    can_edit_branding: isAdmin,
    can_edit_social_media: isAdmin,
    can_edit_legal_pages: isSuperAdmin, // Only super admin can edit legal pages
    can_edit_seo_settings: isAdmin
  };
};

// Get settings history (for audit trail)
export const getSettingsHistory = async (): Promise<any[]> => {
  try {
    const q = query(
      collection(db, 'settings_history'),
      where('settings_id', '==', SETTINGS_DOC_ID)
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching settings history:', error);
    return [];
  }
};

// Log settings change for audit trail
export const logSettingsChange = async (
  changeType: 'create' | 'update' | 'delete',
  field: string,
  oldValue: any,
  newValue: any,
  updatedBy: string
): Promise<void> => {
  try {
    const historyRef = collection(db, 'settings_history');
    await setDoc(doc(historyRef), {
      settings_id: SETTINGS_DOC_ID,
      change_type: changeType,
      field,
      old_value: oldValue,
      new_value: newValue,
      updated_by: updatedBy,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error logging settings change:', error);
  }
};

// Export settings as JSON
export const exportSettings = async (): Promise<string> => {
  try {
    const settings = await getStoreSettings();
    if (!settings) {
      throw new Error('No settings found');
    }

    // Remove sensitive fields for export
    const exportData = {
      ...settings,
      updated_by: undefined,
      created_at: undefined,
      updated_at: undefined
    };

    return JSON.stringify(exportData, null, 2);
  } catch (error) {
    console.error('Error exporting settings:', error);
    throw error;
  }
};

// Import settings from JSON
export const importSettings = async (
  jsonData: string,
  updatedBy: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const importedSettings = JSON.parse(jsonData);

    // Validate imported data
    const validation = validateSettings(importedSettings);
    if (!validation.isValid) {
      return {
        success: false,
        error: `Import validation failed: ${validation.errors.join(', ')}`
      };
    }

    // Update settings with imported data
    const result = await updateStoreSettings(importedSettings, updatedBy);
    return result;
  } catch (error) {
    console.error('Error importing settings:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Invalid JSON data'
    };
  }
};