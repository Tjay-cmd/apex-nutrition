import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  writeBatch,
  onSnapshot,
  QuerySnapshot,
  DocumentData,
  WhereFilterOp,
  OrderByDirection
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  Customer,
  CustomerFilters,
  CustomerSortOptions,
  CustomerPagination,
  CustomerListResponse,
  CustomerStats,
  DEFAULT_CUSTOMER_DATA
} from '@/types/customers';

// Collection references
const CUSTOMERS_COLLECTION = 'customers';
const CUSTOMER_ACTIVITY_COLLECTION = 'customer_activity';
const CUSTOMER_NOTES_COLLECTION = 'customer_notes';

// Get customers collection reference
export const getCustomersCollection = () => collection(db, CUSTOMERS_COLLECTION);

// Get customer document reference
export const getCustomerDoc = (customerId: string) => doc(db, CUSTOMERS_COLLECTION, customerId);

// Get customer activity collection reference
export const getCustomerActivityCollection = (customerId: string) =>
  collection(db, CUSTOMERS_COLLECTION, customerId, CUSTOMER_ACTIVITY_COLLECTION);

// Get customer notes collection reference
export const getCustomerNotesCollection = (customerId: string) =>
  collection(db, CUSTOMERS_COLLECTION, customerId, CUSTOMER_NOTES_COLLECTION);

// Create a new customer
export const createCustomer = async (customerData: Partial<Customer>): Promise<{ success: boolean; customerId?: string; error?: string }> => {
  try {
    console.log('Creating customer with data:', customerData);

    const customerWithDefaults = {
      ...DEFAULT_CUSTOMER_DATA,
      ...customerData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_activity: new Date().toISOString()
    };

    const docRef = await addDoc(getCustomersCollection(), customerWithDefaults);
    console.log('Customer created successfully with ID:', docRef.id);

    return { success: true, customerId: docRef.id };
  } catch (error) {
    console.error('Error creating customer:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Get a single customer by ID
export const getCustomer = async (customerId: string): Promise<{ success: boolean; customer?: Customer; error?: string }> => {
  try {
    console.log('Fetching customer with ID:', customerId);

    const docRef = getCustomerDoc(customerId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const customer = { id: docSnap.id, ...docSnap.data() } as Customer;
      console.log('Customer fetched successfully:', customer);
      return { success: true, customer };
    } else {
      console.log('Customer not found');
      return { success: false, error: 'Customer not found' };
    }
  } catch (error) {
    console.error('Error fetching customer:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Update a customer
export const updateCustomer = async (customerId: string, updates: Partial<Customer>): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log('Updating customer with ID:', customerId, 'Updates:', updates);

    const docRef = getCustomerDoc(customerId);
    const updateData = {
      ...updates,
      updated_at: new Date().toISOString()
    };

    await updateDoc(docRef, updateData);
    console.log('Customer updated successfully');

    return { success: true };
  } catch (error) {
    console.error('Error updating customer:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Delete a customer (soft delete by setting status to 'deleted')
export const deleteCustomer = async (customerId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log('Soft deleting customer with ID:', customerId);

    const docRef = getCustomerDoc(customerId);
    await updateDoc(docRef, {
      status: 'deleted',
      updated_at: new Date().toISOString()
    });

    console.log('Customer deleted successfully');
    return { success: true };
  } catch (error) {
    console.error('Error deleting customer:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Get customers with filtering, sorting, and pagination
export const getCustomers = async (
  filters: CustomerFilters = {},
  sort: CustomerSortOptions = { field: 'created_at', direction: 'desc' },
  pagination: CustomerPagination = { page: 1, limit: 20, total: 0, total_pages: 0 }
): Promise<{ success: boolean; data?: CustomerListResponse; error?: string }> => {
  try {
    console.log('Fetching customers with filters:', filters, 'sort:', sort, 'pagination:', pagination);

    let q = query(getCustomersCollection());

    // Apply filters
    const filterConditions: Array<[string, WhereFilterOp, any]> = [];

    if (filters.status && filters.status.length > 0) {
      filterConditions.push(['status', 'in', filters.status]);
    }

    if (filters.tier && filters.tier.length > 0) {
      filterConditions.push(['segmentation.tier', 'in', filters.tier]);
    }

    if (filters.email_verified !== undefined) {
      filterConditions.push(['contact.email_verified', '==', filters.email_verified]);
    }

    if (filters.phone_verified !== undefined) {
      filterConditions.push(['contact.phone_verified', '==', filters.phone_verified]);
    }

    if (filters.newsletter_subscribed !== undefined) {
      filterConditions.push(['preferences.newsletter_subscription', '==', filters.newsletter_subscribed]);
    }

    if (filters.vip_status !== undefined) {
      filterConditions.push(['notes.vip_status', '==', filters.vip_status]);
    }

    if (filters.blacklist_status !== undefined) {
      filterConditions.push(['notes.blacklist_status', '==', filters.blacklist_status]);
    }

    // Apply filters to query
    filterConditions.forEach(([field, op, value]) => {
      q = query(q, where(field, op, value));
    });

    // Apply sorting
    q = query(q, orderBy(sort.field, sort.direction as OrderByDirection));

    // Apply pagination
    const offset = (pagination.page - 1) * pagination.limit;
    if (offset > 0) {
      // Note: Firestore doesn't support offset, so we'd need to implement cursor-based pagination
      // For now, we'll use limit
    }
    q = query(q, limit(pagination.limit));

    const querySnapshot = await getDocs(q);
    const customers: Customer[] = [];

    querySnapshot.forEach((doc) => {
      const customer = { id: doc.id, ...doc.data() } as Customer;

      // Apply search filter if provided
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const searchableFields = [
          customer.profile.first_name,
          customer.profile.last_name,
          customer.contact.email,
          customer.contact.phone,
          customer.profile.company,
          customer.profile.display_name
        ].filter(Boolean).map(field => field.toLowerCase());

        const matchesSearch = searchableFields.some(field =>
          field.includes(searchTerm)
        );

        if (!matchesSearch) return;
      }

      customers.push(customer);
    });

    // Calculate pagination info
    const total = customers.length; // This is approximate since we're filtering client-side
    const total_pages = Math.ceil(total / pagination.limit);

    const response: CustomerListResponse = {
      customers,
      pagination: {
        ...pagination,
        total,
        total_pages
      },
      filters,
      sort
    };

    console.log('Customers fetched successfully:', response);
    return { success: true, data: response };
  } catch (error) {
    console.error('Error fetching customers:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Get customer statistics
export const getCustomerStats = async (): Promise<{ success: boolean; stats?: CustomerStats; error?: string }> => {
  try {
    console.log('Fetching customer statistics');

    const customersSnapshot = await getDocs(getCustomersCollection());
    const customers: Customer[] = [];

    customersSnapshot.forEach((doc) => {
      customers.push({ id: doc.id, ...doc.data() } as Customer);
    });

    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const stats: CustomerStats = {
      total_customers: customers.length,
      active_customers: customers.filter(c => c.status === 'active').length,
      new_customers_this_month: customers.filter(c =>
        new Date(c.created_at) >= thisMonth
      ).length,
      customers_with_orders: customers.filter(c => c.activity.total_orders > 0).length,
      average_lifetime_value: customers.length > 0
        ? customers.reduce((sum, c) => sum + c.segmentation.lifetime_value, 0) / customers.length
        : 0,
      top_spending_customers: customers.filter(c => c.segmentation.lifetime_value > 1000).length,
      customers_by_tier: {
        bronze: customers.filter(c => c.segmentation.tier === 'bronze').length,
        silver: customers.filter(c => c.segmentation.tier === 'silver').length,
        gold: customers.filter(c => c.segmentation.tier === 'gold').length,
        platinum: customers.filter(c => c.segmentation.tier === 'platinum').length
      },
      customers_by_status: {
        active: customers.filter(c => c.status === 'active').length,
        inactive: customers.filter(c => c.status === 'inactive').length,
        suspended: customers.filter(c => c.status === 'suspended').length,
        deleted: customers.filter(c => c.status === 'deleted').length
      },
      average_engagement_score: customers.length > 0
        ? customers.reduce((sum, c) => sum + c.segmentation.engagement_score, 0) / customers.length
        : 0,
      churn_rate: customers.length > 0
        ? (customers.filter(c => c.segmentation.churn_risk === 'high').length / customers.length) * 100
        : 0
    };

    console.log('Customer statistics calculated:', stats);
    return { success: true, stats };
  } catch (error) {
    console.error('Error fetching customer statistics:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Add customer activity log
export const addCustomerActivity = async (
  customerId: string,
  activity: { type: string; description: string; metadata?: any }
): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log('Adding activity for customer:', customerId, 'Activity:', activity);

    const activityData = {
      ...activity,
      timestamp: new Date().toISOString(),
      created_by: 'admin' // In real app, get from auth context
    };

    const activityRef = collection(db, CUSTOMERS_COLLECTION, customerId, CUSTOMER_ACTIVITY_COLLECTION);
    await addDoc(activityRef, activityData);

    // Update customer's last_activity
    await updateCustomer(customerId, {
      last_activity: new Date().toISOString()
    });

    console.log('Customer activity added successfully');
    return { success: true };
  } catch (error) {
    console.error('Error adding customer activity:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Add customer note
export const addCustomerNote = async (
  customerId: string,
  note: { content: string; is_private: boolean; tags?: string[] }
): Promise<{ success: boolean; noteId?: string; error?: string }> => {
  try {
    console.log('Adding note for customer:', customerId, 'Note:', note);

    const noteData = {
      ...note,
      created_by: 'admin', // In real app, get from auth context
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const notesRef = collection(db, CUSTOMERS_COLLECTION, customerId, CUSTOMER_NOTES_COLLECTION);
    const docRef = await addDoc(notesRef, noteData);

    console.log('Customer note added successfully with ID:', docRef.id);
    return { success: true, noteId: docRef.id };
  } catch (error) {
    console.error('Error adding customer note:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Bulk operations
export const bulkUpdateCustomers = async (
  customerIds: string[],
  updates: Partial<Customer>
): Promise<{ success: boolean; updatedCount?: number; error?: string }> => {
  try {
    console.log('Bulk updating customers:', customerIds, 'Updates:', updates);

    const batch = writeBatch(db);
    let updatedCount = 0;

    for (const customerId of customerIds) {
      const docRef = getCustomerDoc(customerId);
      batch.update(docRef, {
        ...updates,
        updated_at: new Date().toISOString()
      });
      updatedCount++;
    }

    await batch.commit();
    console.log('Bulk update completed successfully. Updated:', updatedCount, 'customers');

    return { success: true, updatedCount };
  } catch (error) {
    console.error('Error in bulk update:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Real-time customer listener
export const subscribeToCustomers = (
  callback: (customers: Customer[]) => void,
  filters: CustomerFilters = {},
  sort: CustomerSortOptions = { field: 'created_at', direction: 'desc' }
) => {
  console.log('Setting up real-time customer listener with filters:', filters, 'sort:', sort);

  let q = query(getCustomersCollection());

  // Apply basic filters for real-time listener
  if (filters.status && filters.status.length > 0) {
    q = query(q, where('status', 'in', filters.status));
  }

  // Apply sorting
  q = query(q, orderBy(sort.field, sort.direction as OrderByDirection));

  return onSnapshot(q, (querySnapshot: QuerySnapshot<DocumentData>) => {
    const customers: Customer[] = [];

    querySnapshot.forEach((doc) => {
      const customer = { id: doc.id, ...doc.data() } as Customer;

      // Apply search filter if provided
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const searchableFields = [
          customer.profile.first_name,
          customer.profile.last_name,
          customer.contact.email,
          customer.contact.phone,
          customer.profile.company,
          customer.profile.display_name
        ].filter(Boolean).map(field => field.toLowerCase());

        const matchesSearch = searchableFields.some(field =>
          field.includes(searchTerm)
        );

        if (!matchesSearch) return;
      }

      customers.push(customer);
    });

    console.log('Real-time customer update received:', customers.length, 'customers');
    callback(customers);
  }, (error) => {
    console.error('Error in real-time customer listener:', error);
  });
};

// Search customers by various fields
export const searchCustomers = async (
  searchTerm: string,
  fields: string[] = ['first_name', 'last_name', 'email']
): Promise<{ success: boolean; customers?: Customer[]; error?: string }> => {
  try {
    console.log('Searching customers with term:', searchTerm, 'in fields:', fields);

    const customersSnapshot = await getDocs(getCustomersCollection());
    const customers: Customer[] = [];

    customersSnapshot.forEach((doc) => {
      const customer = { id: doc.id, ...doc.data() } as Customer;

      // Check if customer matches search term in any of the specified fields
      const matchesSearch = fields.some(field => {
        let value = '';

        switch (field) {
          case 'first_name':
            value = customer.profile.first_name;
            break;
          case 'last_name':
            value = customer.profile.last_name;
            break;
          case 'email':
            value = customer.contact.email;
            break;
          case 'phone':
            value = customer.contact.phone || '';
            break;
          case 'company':
            value = customer.profile.company || '';
            break;
          case 'display_name':
            value = customer.profile.display_name || '';
            break;
          default:
            return false;
        }

        return value.toLowerCase().includes(searchTerm.toLowerCase());
      });

      if (matchesSearch) {
        customers.push(customer);
      }
    });

    console.log('Customer search completed. Found:', customers.length, 'customers');
    return { success: true, customers };
  } catch (error) {
    console.error('Error searching customers:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};