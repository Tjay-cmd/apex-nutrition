"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { useAuth } from './firebase-auth-context';
import {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerStats,
  addCustomerActivity,
  addCustomerNote,
  bulkUpdateCustomers,
  subscribeToCustomers,
  searchCustomers
} from '@/lib/customer-queries';
import {
  Customer,
  CustomerFilters,
  CustomerSortOptions,
  CustomerPagination,
  CustomerStats
} from '@/types/customers';

interface CustomerContextType {
  // State
  customers: Customer[];
  selectedCustomer: Customer | null;
  customerStats: CustomerStats | null;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;

  // Filters and pagination
  filters: CustomerFilters;
  sort: CustomerSortOptions;
  pagination: CustomerPagination;

  // Actions
  setSelectedCustomer: (customer: Customer | null) => void;
  setFilters: (filters: CustomerFilters) => void;
  setSort: (sort: CustomerSortOptions) => void;
  setPagination: (pagination: CustomerPagination) => void;

  // CRUD operations
  fetchCustomers: () => Promise<void>;
  fetchCustomer: (customerId: string) => Promise<void>;
  createNewCustomer: (customerData: Partial<Customer>) => Promise<{ success: boolean; customerId?: string; error?: string }>;
  updateCustomerData: (customerId: string, updates: Partial<Customer>) => Promise<{ success: boolean; error?: string }>;
  deleteCustomerData: (customerId: string) => Promise<{ success: boolean; error?: string }>;

  // Advanced operations
  fetchCustomerStats: () => Promise<void>;
  addActivity: (customerId: string, activity: { type: string; description: string; metadata?: Record<string, unknown> }) => Promise<{ success: boolean; error?: string }>;
  addNote: (customerId: string, note: { content: string; is_private: boolean; tags?: string[] }) => Promise<{ success: boolean; noteId?: string; error?: string }>;
  bulkUpdate: (customerIds: string[], updates: Partial<Customer>) => Promise<{ success: boolean; updatedCount?: number; error?: string }>;
  searchCustomersByTerm: (searchTerm: string, fields?: string[]) => Promise<{ success: boolean; customers?: Customer[]; error?: string }>;

  // Real-time updates
  subscribeToCustomerUpdates: () => void;
  unsubscribeFromCustomerUpdates: () => void;

  // Utility functions
  clearError: () => void;
  hasAdminAccess: boolean;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

interface CustomerProviderProps {
  children: ReactNode;
}

export const CustomerProvider: React.FC<CustomerProviderProps> = ({ children }) => {
  const { user } = useAuth();

  // State
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerStats, setCustomerStats] = useState<CustomerStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters and pagination
  const [filters, setFilters] = useState<CustomerFilters>({});
  const [sort, setSort] = useState<CustomerSortOptions>({ field: 'created_at', direction: 'desc' });
  const [pagination, setPagination] = useState<CustomerPagination>({
    page: 1,
    limit: 20,
    total: 0,
    total_pages: 0
  });

  // Real-time subscription
  const [unsubscribe, setUnsubscribe] = useState<(() => void) | null>(null);

  // Check admin access
  const hasAdminAccess = user?.role === 'admin' || user?.role === 'super_admin';

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Fetch customers with current filters and pagination
  const fetchCustomers = useCallback(async () => {
    if (!hasAdminAccess) {
      setError('Access denied. Admin privileges required.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Fetching customers with filters:', filters, 'sort:', sort, 'pagination:', pagination);

      const result = await getCustomers(filters, sort, pagination);

      if (result.success && result.data) {
        setCustomers(result.data.customers);
        setPagination(result.data.pagination);
        console.log('Customers fetched successfully:', result.data.customers.length);
      } else {
        setError(result.error || 'Failed to fetch customers');
        console.error('Error fetching customers:', result.error);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Exception while fetching customers:', err);
    } finally {
      setIsLoading(false);
    }
  }, [filters, sort, pagination, hasAdminAccess]);

  // Fetch single customer
  const fetchCustomer = useCallback(async (customerId: string) => {
    if (!hasAdminAccess) {
      setError('Access denied. Admin privileges required.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Fetching customer with ID:', customerId);

      const result = await getCustomer(customerId);

      if (result.success && result.customer) {
        setSelectedCustomer(result.customer);
        console.log('Customer fetched successfully:', result.customer);
      } else {
        setError(result.error || 'Failed to fetch customer');
        console.error('Error fetching customer:', result.error);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Exception while fetching customer:', err);
    } finally {
      setIsLoading(false);
    }
  }, [hasAdminAccess]);

  // Create new customer
  const createNewCustomer = useCallback(async (customerData: Partial<Customer>) => {
    if (!hasAdminAccess) {
      return { success: false, error: 'Access denied. Admin privileges required.' };
    }

    setIsSubmitting(true);
    setError(null);

    try {
      console.log('Creating new customer with data:', customerData);

      const result = await createCustomer(customerData);

      if (result.success) {
        console.log('Customer created successfully with ID:', result.customerId);
        // Refresh customers list
        await fetchCustomers();
        return result;
      } else {
        setError(result.error || 'Failed to create customer');
        console.error('Error creating customer:', result.error);
        return result;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Exception while creating customer:', err);
      return { success: false, error: errorMessage };
    } finally {
      setIsSubmitting(false);
    }
  }, [hasAdminAccess, fetchCustomers]);

  // Update customer
  const updateCustomerData = useCallback(async (customerId: string, updates: Partial<Customer>) => {
    if (!hasAdminAccess) {
      return { success: false, error: 'Access denied. Admin privileges required.' };
    }

    setIsSubmitting(true);
    setError(null);

    try {
      console.log('Updating customer with ID:', customerId, 'Updates:', updates);

      const result = await updateCustomer(customerId, updates);

      if (result.success) {
        console.log('Customer updated successfully');
        // Refresh customers list and selected customer
        await fetchCustomers();
        if (selectedCustomer?.id === customerId) {
          await fetchCustomer(customerId);
        }
        return result;
      } else {
        setError(result.error || 'Failed to update customer');
        console.error('Error updating customer:', result.error);
        return result;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Exception while updating customer:', err);
      return { success: false, error: errorMessage };
    } finally {
      setIsSubmitting(false);
    }
  }, [hasAdminAccess, fetchCustomers, selectedCustomer, fetchCustomer]);

  // Delete customer (soft delete)
  const deleteCustomerData = useCallback(async (customerId: string) => {
    if (!hasAdminAccess) {
      return { success: false, error: 'Access denied. Admin privileges required.' };
    }

    setIsSubmitting(true);
    setError(null);

    try {
      console.log('Deleting customer with ID:', customerId);

      const result = await deleteCustomer(customerId);

      if (result.success) {
        console.log('Customer deleted successfully');
        // Refresh customers list
        await fetchCustomers();
        // Clear selected customer if it was the deleted one
        if (selectedCustomer?.id === customerId) {
          setSelectedCustomer(null);
        }
        return result;
      } else {
        setError(result.error || 'Failed to delete customer');
        console.error('Error deleting customer:', result.error);
        return result;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Exception while deleting customer:', err);
      return { success: false, error: errorMessage };
    } finally {
      setIsSubmitting(false);
    }
  }, [hasAdminAccess, fetchCustomers, selectedCustomer]);

  // Fetch customer statistics
  const fetchCustomerStats = useCallback(async () => {
    if (!hasAdminAccess) {
      setError('Access denied. Admin privileges required.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Fetching customer statistics');

      const result = await getCustomerStats();

      if (result.success && result.stats) {
        setCustomerStats(result.stats);
        console.log('Customer statistics fetched successfully:', result.stats);
      } else {
        setError(result.error || 'Failed to fetch customer statistics');
        console.error('Error fetching customer statistics:', result.error);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Exception while fetching customer statistics:', err);
    } finally {
      setIsLoading(false);
    }
  }, [hasAdminAccess]);

  // Add customer activity
  const addActivity = useCallback(async (customerId: string, activity: { type: string; description: string; metadata?: Record<string, unknown> }) => {
    if (!hasAdminAccess) {
      return { success: false, error: 'Access denied. Admin privileges required.' };
    }

    setIsSubmitting(true);
    setError(null);

    try {
      console.log('Adding activity for customer:', customerId, 'Activity:', activity);

      const result = await addCustomerActivity(customerId, activity);

      if (result.success) {
        console.log('Customer activity added successfully');
        // Refresh selected customer if it's the same one
        if (selectedCustomer?.id === customerId) {
          await fetchCustomer(customerId);
        }
        return result;
      } else {
        setError(result.error || 'Failed to add customer activity');
        console.error('Error adding customer activity:', result.error);
        return result;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Exception while adding customer activity:', err);
      return { success: false, error: errorMessage };
    } finally {
      setIsSubmitting(false);
    }
  }, [hasAdminAccess, selectedCustomer, fetchCustomer]);

  // Add customer note
  const addNote = useCallback(async (customerId: string, note: { content: string; is_private: boolean; tags?: string[] }) => {
    if (!hasAdminAccess) {
      return { success: false, error: 'Access denied. Admin privileges required.' };
    }

    setIsSubmitting(true);
    setError(null);

    try {
      console.log('Adding note for customer:', customerId, 'Note:', note);

      const result = await addCustomerNote(customerId, note);

      if (result.success) {
        console.log('Customer note added successfully with ID:', result.noteId);
        // Refresh selected customer if it's the same one
        if (selectedCustomer?.id === customerId) {
          await fetchCustomer(customerId);
        }
        return result;
      } else {
        setError(result.error || 'Failed to add customer note');
        console.error('Error adding customer note:', result.error);
        return result;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Exception while adding customer note:', err);
      return { success: false, error: errorMessage };
    } finally {
      setIsSubmitting(false);
    }
  }, [hasAdminAccess, selectedCustomer, fetchCustomer]);

  // Bulk update customers
  const bulkUpdate = useCallback(async (customerIds: string[], updates: Partial<Customer>) => {
    if (!hasAdminAccess) {
      return { success: false, error: 'Access denied. Admin privileges required.' };
    }

    setIsSubmitting(true);
    setError(null);

    try {
      console.log('Bulk updating customers:', customerIds, 'Updates:', updates);

      const result = await bulkUpdateCustomers(customerIds, updates);

      if (result.success) {
        console.log('Bulk update completed successfully. Updated:', result.updatedCount, 'customers');
        // Refresh customers list
        await fetchCustomers();
        return result;
      } else {
        setError(result.error || 'Failed to bulk update customers');
        console.error('Error in bulk update:', result.error);
        return result;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Exception while bulk updating customers:', err);
      return { success: false, error: errorMessage };
    } finally {
      setIsSubmitting(false);
    }
  }, [hasAdminAccess, fetchCustomers]);

  // Search customers
  const searchCustomersByTerm = useCallback(async (searchTerm: string, fields?: string[]) => {
    if (!hasAdminAccess) {
      return { success: false, error: 'Access denied. Admin privileges required.' };
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Searching customers with term:', searchTerm, 'in fields:', fields);

      const result = await searchCustomers(searchTerm, fields);

      if (result.success) {
        console.log('Customer search completed. Found:', result.customers?.length, 'customers');
        return result;
      } else {
        setError(result.error || 'Failed to search customers');
        console.error('Error searching customers:', result.error);
        return result;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Exception while searching customers:', err);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [hasAdminAccess]);

  // Subscribe to real-time customer updates
  const subscribeToCustomerUpdates = useCallback(() => {
    if (!hasAdminAccess) {
      console.warn('Cannot subscribe to customer updates: Admin access required');
      return;
    }

    console.log('Setting up real-time customer listener');

    const unsubscribeFn = subscribeToCustomers(
      (updatedCustomers) => {
        console.log('Real-time customer update received:', updatedCustomers.length, 'customers');
        setCustomers(updatedCustomers);
      },
      filters,
      sort
    );

    setUnsubscribe(() => unsubscribeFn);
  }, [hasAdminAccess, filters, sort]);

  // Unsubscribe from real-time updates
  const unsubscribeFromCustomerUpdates = useCallback(() => {
    if (unsubscribe) {
      console.log('Unsubscribing from real-time customer updates');
      unsubscribe();
      setUnsubscribe(null);
    }
  }, [unsubscribe]);

  // Initial data fetch
  useEffect(() => {
    if (hasAdminAccess && user) {
      console.log('Initial customer data fetch');
      fetchCustomers();
      fetchCustomerStats();
    }
  }, [hasAdminAccess, user, fetchCustomers, fetchCustomerStats]);

  // Set up real-time listener when filters or sort change
  useEffect(() => {
    if (!(hasAdminAccess && user)) {
      return;
    }

    // Subscribe with current filters and sort
    const unsubscribeFn = subscribeToCustomers(
      (updatedCustomers) => {
        setCustomers(updatedCustomers);
      },
      filters,
      sort
    );

    // Save unsubscribe for manual control
    setUnsubscribe(() => unsubscribeFn);

    // Cleanup on dependency change or unmount
    return () => {
      try {
        unsubscribeFn();
      } catch {
        // noop
      }
      setUnsubscribe(null);
    };
  }, [hasAdminAccess, user, filters, sort]);

  // Context value
  const contextValue: CustomerContextType = {
    // State
    customers,
    selectedCustomer,
    customerStats,
    isLoading,
    isSubmitting,
    error,

    // Filters and pagination
    filters,
    sort,
    pagination,

    // Actions
    setSelectedCustomer,
    setFilters,
    setSort,
    setPagination,

    // CRUD operations
    fetchCustomers,
    fetchCustomer,
    createNewCustomer,
    updateCustomerData,
    deleteCustomerData,

    // Advanced operations
    fetchCustomerStats,
    addActivity,
    addNote,
    bulkUpdate,
    searchCustomersByTerm,

    // Real-time updates
    subscribeToCustomerUpdates,
    unsubscribeFromCustomerUpdates,

    // Utility functions
    clearError,
    hasAdminAccess
  };

  return (
    <CustomerContext.Provider value={contextValue}>
      {children}
    </CustomerContext.Provider>
  );
};

// Custom hook to use customer context
export const useCustomers = () => {
  const context = useContext(CustomerContext);
  if (context === undefined) {
    throw new Error('useCustomers must be used within a CustomerProvider');
  }
  return context;
};