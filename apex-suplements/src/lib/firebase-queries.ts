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
  QuerySnapshot,
  DocumentData,
  startAfter,
  endBefore,
  Timestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import type { CreateProductData, UpdateProductData } from '@/types/product';
import type {
  Order,
  CreateOrderData,
  UpdateOrderData,
  OrderFilters,
  OrderStats,
  OrderStatus
} from '@/types/order';
import type {
  AnalyticsSummary,
  RevenueAnalytics,
  OrderAnalytics,
  CustomerAnalytics,
  ProductAnalytics,
  GeographicAnalytics,
  TrendAnalytics,
  AnalyticsFilters,
  RealTimeMetrics,
  TimeSeriesData,
  CustomerRanking,
  ProductRanking,
  RegionRanking
} from '@/types/analytics';

// Image upload utility functions
export const uploadImageToStorage = async (file: File, path: string): Promise<string> => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export const uploadBase64ToStorage = async (base64Data: string, path: string): Promise<string> => {
  try {
    // Convert base64 to blob
    const response = await fetch(base64Data);
    const blob = await response.blob();

    // Upload blob to storage
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading base64 image:', error);
    // For now, return the base64 data as a fallback
    // This allows the form to work while we fix the storage permissions
    console.warn('Storage upload failed, using base64 as fallback');
    return base64Data;
  }
};

// Utility function to format currency
export const formatZAR = (amount: number): string => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
  }).format(amount);
};

// Product queries
export const getProducts = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'products'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};



export const getFeaturedProducts = async () => {
  try {
    const q = query(
      collection(db, 'products'),
      where('featured', '==', true),
      limit(8)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
};

// Category queries
export const getCategories = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'categories'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

// Cart queries
export const addToCart = async (userId: string, productId: string, quantity: number) => {
  try {
    const cartItem = {
      user_id: userId,
      product_id: productId,
      quantity,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    // Store cart items under user-specific subcollection
    await addDoc(collection(db, 'users', userId, 'cart_items'), cartItem);
    return { success: true };
  } catch (error) {
    console.error('Error adding to cart:', error);
    return { success: false, error };
  }
};

export const getCartItems = async (userId: string) => {
  try {
    const q = query(collection(db, 'users', userId, 'cart_items'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching cart items:', error);
    return [];
  }
};

export const updateCartItem = async (userId: string, itemId: string, quantity: number) => {
  try {
    const docRef = doc(db, 'users', userId, 'cart_items', itemId);
    await updateDoc(docRef, {
      quantity,
      updated_at: new Date().toISOString(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating cart item:', error);
    return { success: false, error };
  }
};

export const removeFromCart = async (userId: string, itemId: string) => {
  try {
    await deleteDoc(doc(db, 'users', userId, 'cart_items', itemId));
    return { success: true };
  } catch (error) {
    console.error('Error removing from cart:', error);
    return { success: false, error };
  }
};

// Order queries
export const createOrder = async (orderData: CreateOrderData) => {
  try {
    const order = {
      ...orderData,
      status: 'pending',
      payment_status: 'pending',
      status_history: [{
        status: 'pending',
        updated_at: new Date().toISOString(),
        updated_by: 'system',
        notes: 'Order created'
      }],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const docRef = await addDoc(collection(db, 'orders'), order);
    return { success: true, orderId: docRef.id };
  } catch (error) {
    console.error('Error creating order:', error);
    return { success: false, error };
  }
};

export const createOrderItem = async (orderItemData: { order_id: string; product_id: string; quantity: number; unit_price: number; total_price: number }) => {
  try {
    const orderItem = {
      ...orderItemData,
      created_at: new Date().toISOString(),
    };
    await addDoc(collection(db, 'order_items'), orderItem);
    return { success: true };
  } catch (error) {
    console.error('Error creating order item:', error);
    return { success: false, error };
  }
};



// User queries
export const getUserProfile = async (userId: string) => {
  try {
    const docRef = doc(db, 'profiles', userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

export const updateUserRole = async (userId: string, role: string) => {
  try {
    const docRef = doc(db, 'profiles', userId);
    await updateDoc(docRef, {
      role,
      updated_at: new Date().toISOString(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating user role:', error);
    return { success: false, error };
  }
};

export const getAllUsers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'profiles'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

// Product Management Functions
export const createProduct = async (productData: CreateProductData) => {
  try {
    const product = {
      ...productData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const docRef = await addDoc(collection(db, 'products'), product);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating product:', error);
    return { success: false, error };
  }
};

export const getAllProducts = async () => {
  try {
    const q = query(collection(db, 'products'), orderBy('created_at', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const getProduct = async (productId: string) => {
  try {
    const docRef = doc(db, 'products', productId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
};

export const updateProduct = async (productId: string, productData: UpdateProductData) => {
  try {
    const docRef = doc(db, 'products', productId);
    await updateDoc(docRef, {
      ...productData,
      updated_at: new Date().toISOString(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating product:', error);
    return { success: false, error };
  }
};

export const deleteProduct = async (productId: string) => {
  try {
    await deleteDoc(doc(db, 'products', productId));
    return { success: true };
  } catch (error) {
    console.error('Error deleting product:', error);
    return { success: false, error };
  }
};

export const toggleProductStatus = async (productId: string, status: 'active' | 'inactive') => {
  try {
    const docRef = doc(db, 'products', productId);
    await updateDoc(docRef, {
      status,
      updated_at: new Date().toISOString(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error toggling product status:', error);
    return { success: false, error };
  }
};

export const toggleProductFeatured = async (productId: string, featured: boolean) => {
  try {
    const docRef = doc(db, 'products', productId);
    await updateDoc(docRef, {
      featured,
      updated_at: new Date().toISOString(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error toggling product featured status:', error);
    return { success: false, error };
  }
};

// Order Management Functions
export const getAllOrders = async (limitCount: number = 50, lastDoc?: DocumentData) => {
  try {
    let q = query(
      collection(db, 'orders'),
      orderBy('created_at', 'desc'),
      limit(limitCount)
    );

    if (lastDoc) {
      q = query(
        collection(db, 'orders'),
        orderBy('created_at', 'desc'),
        startAfter(lastDoc),
        limit(limitCount)
      );
    }

    const querySnapshot = await getDocs(q);
    const orders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Order[];

    return {
      orders,
      lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1],
      hasMore: querySnapshot.docs.length === limitCount
    };
  } catch (error) {
    console.error('Error fetching orders:', error);
    return { orders: [], lastDoc: null, hasMore: false };
  }
};

export const getOrdersByStatus = async (status: string, limitCount: number = 50) => {
  try {
    const q = query(
      collection(db, 'orders'),
      where('status', '==', status),
      orderBy('created_at', 'desc'),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Order[];
  } catch (error) {
    console.error('Error fetching orders by status:', error);
    return [];
  }
};

export const getOrder = async (orderId: string) => {
  try {
    const docRef = doc(db, 'orders', orderId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Order;
    }
    return null;
  } catch (error) {
    console.error('Error fetching order:', error);
    return null;
  }
};

export const updateOrder = async (orderId: string, updateData: UpdateOrderData, updatedBy: string) => {
  try {
    const docRef = doc(db, 'orders', orderId);

    // Get current order to update status history
    const currentOrder = await getOrder(orderId);

    const updatePayload: UpdateOrderData & { updated_at: string; status_history?: OrderStatus[] } = {
      ...updateData,
      updated_at: new Date().toISOString(),
    };

    // Add to status history if status is being updated
    if (updateData.status && currentOrder) {
      const statusUpdate: OrderStatus = {
        status: updateData.status,
        updated_at: new Date().toISOString(),
        updated_by: updatedBy,
        notes: updateData.notes || `Status updated to ${updateData.status}`
      };

      updatePayload.status_history = [
        ...(currentOrder.status_history || []),
        statusUpdate
      ];
    }

    await updateDoc(docRef, updatePayload);
    return { success: true };
  } catch (error) {
    console.error('Error updating order:', error);
    return { success: false, error };
  }
};

export const updateOrderStatus = async (orderId: string, status: string, updatedBy: string, notes?: string) => {
  try {
    const docRef = doc(db, 'orders', orderId);

    // Get current order
    const currentOrder = await getOrder(orderId);
    if (!currentOrder) {
      throw new Error('Order not found');
    }

    const statusUpdate: OrderStatus = {
      status: status as 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled',
      updated_at: new Date().toISOString(),
      updated_by: updatedBy,
      notes: notes || `Status updated to ${status}`
    };

    await updateDoc(docRef, {
      status,
      status_history: [...(currentOrder.status_history || []), statusUpdate],
      updated_at: new Date().toISOString(),
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating order status:', error);
    return { success: false, error };
  }
};

export const searchOrders = async (filters: OrderFilters, limitCount: number = 50) => {
  try {
    let q = query(collection(db, 'orders'), orderBy('created_at', 'desc'));

    // Apply filters
    if (filters.status) {
      q = query(q, where('status', '==', filters.status));
    }

    if (filters.payment_status) {
      q = query(q, where('payment_status', '==', filters.payment_status));
    }

    if (filters.customer_email) {
      q = query(q, where('customer_email', '==', filters.customer_email));
    }

    if (filters.date_from || filters.date_to) {
      const constraints = [];
      if (filters.date_from) {
        constraints.push(where('created_at', '>=', filters.date_from));
      }
      if (filters.date_to) {
        constraints.push(where('created_at', '<=', filters.date_to));
      }
      q = query(q, ...constraints);
    }

    q = query(q, limit(limitCount));
    const querySnapshot = await getDocs(q);

    let orders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Order[];

    // Apply client-side filters for search and amount ranges
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      orders = orders.filter(order =>
        order.id.toLowerCase().includes(searchTerm) ||
        order.customer_name.toLowerCase().includes(searchTerm) ||
        order.customer_email.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.min_amount) {
      orders = orders.filter(order => order.total_amount >= filters.min_amount!);
    }

    if (filters.max_amount) {
      orders = orders.filter(order => order.total_amount <= filters.max_amount!);
    }

    return orders;
  } catch (error) {
    console.error('Error searching orders:', error);
    return [];
  }
};

export const getOrderStats = async (): Promise<OrderStats> => {
  try {
    const allOrders = await getAllOrders(1000); // Get all orders for stats
    const orders = allOrders.orders;

    const stats: OrderStats = {
      total_orders: orders.length,
      total_revenue: orders.reduce((sum, order) => sum + order.total_amount, 0),
      pending_orders: orders.filter(order => order.status === 'pending').length,
      processing_orders: orders.filter(order => order.status === 'processing').length,
      shipped_orders: orders.filter(order => order.status === 'shipped').length,
      delivered_orders: orders.filter(order => order.status === 'delivered').length,
      cancelled_orders: orders.filter(order => order.status === 'cancelled').length,
    };

    return stats;
  } catch (error) {
    console.error('Error getting order stats:', error);
    return {
      total_orders: 0,
      total_revenue: 0,
      pending_orders: 0,
      processing_orders: 0,
      shipped_orders: 0,
      delivered_orders: 0,
      cancelled_orders: 0,
    };
  }
};

export const getOrdersByUser = async (userId: string) => {
  try {
    const q = query(
      collection(db, 'orders'),
      where('user_id', '==', userId),
      orderBy('created_at', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Order[];
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return [];
  }
};

export const deleteOrder = async (orderId: string) => {
  try {
    await deleteDoc(doc(db, 'orders', orderId));
    return { success: true };
  } catch (error) {
    console.error('Error deleting order:', error);
    return { success: false, error };
  }
};

// Analytics Functions
export const getRevenueAnalytics = async (filters?: AnalyticsFilters): Promise<RevenueAnalytics> => {
  try {
    let q = collection(db, 'orders');

    if (filters?.date_from || filters?.date_to) {
      const constraints = [];
      if (filters.date_from) {
        constraints.push(where('created_at', '>=', filters.date_from));
      }
      if (filters.date_to) {
        constraints.push(where('created_at', '<=', filters.date_to));
      }
      q = query(q, ...constraints);
    }

    const querySnapshot = await getDocs(q);
    const orders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Order[];

    const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount, 0);
    const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

    // Calculate revenue by status
    const revenueByStatus = {
      pending: orders.filter(o => o.status === 'pending').reduce((sum, o) => sum + o.total_amount, 0),
      processing: orders.filter(o => o.status === 'processing').reduce((sum, o) => sum + o.total_amount, 0),
      shipped: orders.filter(o => o.status === 'shipped').reduce((sum, o) => sum + o.total_amount, 0),
      delivered: orders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.total_amount, 0),
      cancelled: orders.filter(o => o.status === 'cancelled').reduce((sum, o) => sum + o.total_amount, 0)
    };

    // Calculate revenue by period (last 30 days)
    const revenueByPeriod: TimeSeriesData[] = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const dayRevenue = orders
        .filter(order => order.created_at.startsWith(dateStr))
        .reduce((sum, order) => sum + order.total_amount, 0);

      revenueByPeriod.push({
        date: dateStr,
        value: dayRevenue,
        label: date.toLocaleDateString()
      });
    }

    // Calculate growth rate (comparing last 7 days vs previous 7 days)
    const last7Days = revenueByPeriod.slice(-7).reduce((sum, day) => sum + day.value, 0);
    const previous7Days = revenueByPeriod.slice(-14, -7).reduce((sum, day) => sum + day.value, 0);
    const revenueGrowthRate = previous7Days > 0 ? ((last7Days - previous7Days) / previous7Days) * 100 : 0;

    return {
      total_revenue: totalRevenue,
      average_order_value: averageOrderValue,
      revenue_growth_rate: revenueGrowthRate,
      revenue_by_period: revenueByPeriod,
      revenue_by_status: revenueByStatus
    };
  } catch (error) {
    console.error('Error fetching revenue analytics:', error);
    throw error;
  }
};

export const getOrderAnalytics = async (filters?: AnalyticsFilters): Promise<OrderAnalytics> => {
  try {
    let q = collection(db, 'orders');

    if (filters?.date_from || filters?.date_to) {
      const constraints = [];
      if (filters.date_from) {
        constraints.push(where('created_at', '>=', filters.date_from));
      }
      if (filters.date_to) {
        constraints.push(where('created_at', '<=', filters.date_to));
      }
      q = query(q, ...constraints);
    }

    const querySnapshot = await getDocs(q);
    const orders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Order[];

    const totalOrders = orders.length;
    const ordersByStatus = {
      pending: orders.filter(o => o.status === 'pending').length,
      processing: orders.filter(o => o.status === 'processing').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length
    };

    // Calculate orders by period
    const ordersByPeriod: TimeSeriesData[] = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const dayOrders = orders.filter(order => order.created_at.startsWith(dateStr)).length;

      ordersByPeriod.push({
        date: dateStr,
        value: dayOrders,
        label: date.toLocaleDateString()
      });
    }

    // Calculate average processing time
    const completedOrders = orders.filter(o => o.status === 'delivered' || o.status === 'shipped');
    const totalProcessingTime = completedOrders.reduce((sum, order) => {
      const created = new Date(order.created_at);
      const updated = new Date(order.updated_at);
      return sum + (updated.getTime() - created.getTime());
    }, 0);
    const averageProcessingTime = completedOrders.length > 0 ? totalProcessingTime / completedOrders.length : 0;

    // Calculate completion rate
    const completedCount = ordersByStatus.delivered + ordersByStatus.shipped;
    const orderCompletionRate = totalOrders > 0 ? (completedCount / totalOrders) * 100 : 0;

    return {
      total_orders: totalOrders,
      orders_by_status: ordersByStatus,
      orders_by_period: ordersByPeriod,
      average_processing_time: averageProcessingTime,
      order_completion_rate: orderCompletionRate
    };
  } catch (error) {
    console.error('Error fetching order analytics:', error);
    throw error;
  }
};

export const getCustomerAnalytics = async (filters?: AnalyticsFilters): Promise<CustomerAnalytics> => {
  try {
    // Get all orders to analyze customer data
    const ordersQuery = await getDocs(collection(db, 'orders'));
    const orders = ordersQuery.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Order[];

    // Get unique customers
    const uniqueCustomers = new Set(orders.map(order => order.customer_email));
    const totalCustomers = uniqueCustomers.size;

    // Calculate new vs returning customers
    const customerOrderCounts = new Map<string, number>();
    orders.forEach(order => {
      const count = customerOrderCounts.get(order.customer_email) || 0;
      customerOrderCounts.set(order.customer_email, count + 1);
    });

    const newCustomers = Array.from(customerOrderCounts.values()).filter(count => count === 1).length;
    const returningCustomers = totalCustomers - newCustomers;

    // Calculate customer rankings
    const customerRankings: CustomerRanking[] = [];
    customerOrderCounts.forEach((orderCount, email) => {
      const customerOrders = orders.filter(order => order.customer_email === email);
      const totalSpent = customerOrders.reduce((sum, order) => sum + order.total_amount, 0);
      const averageOrderValue = totalSpent / orderCount;
      const lastOrder = customerOrders.sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )[0];

      customerRankings.push({
        customer_id: email, // Using email as ID for now
        customer_name: lastOrder.customer_name,
        customer_email: email,
        total_orders: orderCount,
        total_spent: totalSpent,
        average_order_value: averageOrderValue,
        last_order_date: lastOrder.created_at
      });
    });

    // Sort by total spent and take top 10
    const topCustomers = customerRankings
      .sort((a, b) => b.total_spent - a.total_spent)
      .slice(0, 10);

    // Calculate customers by period
    const customersByPeriod: TimeSeriesData[] = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const dayCustomers = new Set(
        orders
          .filter(order => order.created_at.startsWith(dateStr))
          .map(order => order.customer_email)
      ).size;

      customersByPeriod.push({
        date: dateStr,
        value: dayCustomers,
        label: date.toLocaleDateString()
      });
    }

    // Calculate metrics
    const averageCustomerValue = totalCustomers > 0 ?
      orders.reduce((sum, order) => sum + order.total_amount, 0) / totalCustomers : 0;

    const customerAcquisitionRate = totalCustomers > 0 ? (newCustomers / totalCustomers) * 100 : 0;
    const customerRetentionRate = totalCustomers > 0 ? (returningCustomers / totalCustomers) * 100 : 0;

    return {
      total_customers: totalCustomers,
      new_customers: newCustomers,
      returning_customers: returningCustomers,
      customer_acquisition_rate: customerAcquisitionRate,
      customer_retention_rate: customerRetentionRate,
      average_customer_value: averageCustomerValue,
      customers_by_period: customersByPeriod,
      top_customers: topCustomers
    };
  } catch (error) {
    console.error('Error fetching customer analytics:', error);
    throw error;
  }
};

export const getProductAnalytics = async (filters?: AnalyticsFilters): Promise<ProductAnalytics> => {
  try {
    // Get all products
    const productsQuery = await getDocs(collection(db, 'products'));
    const products = productsQuery.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];

    // Get all orders for product analysis
    const ordersQuery = await getDocs(collection(db, 'orders'));
    const orders = ordersQuery.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Order[];

    const totalProducts = products.length;

    // Calculate product rankings
    const productSales = new Map<string, { sold: number; revenue: number; orders: number }>();

    orders.forEach(order => {
      order.items.forEach(item => {
        const current = productSales.get(item.product_id) || { sold: 0, revenue: 0, orders: 0 };
        current.sold += item.quantity;
        current.revenue += item.total_price;
        current.orders += 1;
        productSales.set(item.product_id, current);
      });
    });

    const productRankings: ProductRanking[] = [];
    productSales.forEach((sales, productId) => {
      const product = products.find(p => p.id === productId);
      if (product) {
        productRankings.push({
          product_id: productId,
          product_name: product.name,
          total_sold: sales.sold,
          revenue_generated: sales.revenue,
          average_rating: product.rating || 0,
          category: product.category_id || 'Uncategorized'
        });
      }
    });

    // Sort by revenue and take top 10
    const topProducts = productRankings
      .sort((a, b) => b.revenue_generated - a.revenue_generated)
      .slice(0, 10);

    // Calculate products by category
    const productsByCategory: Record<string, number> = {};
    products.forEach(product => {
      const category = product.category_id || 'Uncategorized';
      productsByCategory[category] = (productsByCategory[category] || 0) + 1;
    });

    // Get low stock products
    const lowStockProducts: ProductStock[] = products
      .filter(product => product.in_stock && product.in_stock < 10) // Assuming 10 is min stock level
      .map(product => ({
        product_id: product.id,
        product_name: product.name,
        current_stock: product.in_stock || 0,
        min_stock_level: 10,
        category: product.category_id || 'Uncategorized'
      }));

    return {
      total_products: totalProducts,
      top_products: topProducts,
      products_by_category: productsByCategory,
      low_stock_products: lowStockProducts,
      product_performance: [] // Will be implemented in advanced analytics
    };
  } catch (error) {
    console.error('Error fetching product analytics:', error);
    throw error;
  }
};

export const getGeographicAnalytics = async (filters?: AnalyticsFilters): Promise<GeographicAnalytics> => {
  try {
    const ordersQuery = await getDocs(collection(db, 'orders'));
    const orders = ordersQuery.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Order[];

    // Group orders by region (using city for now)
    const ordersByRegion: Record<string, number> = {};
    const revenueByRegion: Record<string, number> = {};
    const customersByRegion: Record<string, Set<string>> = {};

    orders.forEach(order => {
      const region = order.shipping_address.city || 'Unknown';

      // Count orders
      ordersByRegion[region] = (ordersByRegion[region] || 0) + 1;

      // Sum revenue
      revenueByRegion[region] = (revenueByRegion[region] || 0) + order.total_amount;

      // Count unique customers
      if (!customersByRegion[region]) {
        customersByRegion[region] = new Set();
      }
      customersByRegion[region].add(order.customer_email);
    });

    // Calculate region rankings
    const regionRankings: RegionRanking[] = Object.keys(ordersByRegion).map(region => {
      const orders = ordersByRegion[region];
      const revenue = revenueByRegion[region];
      const customers = customersByRegion[region].size;
      const averageOrderValue = orders > 0 ? revenue / orders : 0;

      return {
        region,
        orders,
        revenue,
        customers,
        average_order_value: averageOrderValue
      };
    });

    // Sort by revenue and take top 10
    const topRegions = regionRankings
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // Convert customer distribution to simple counts
    const customerDistribution: Record<string, number> = {};
    Object.keys(customersByRegion).forEach(region => {
      customerDistribution[region] = customersByRegion[region].size;
    });

    return {
      orders_by_region: ordersByRegion,
      revenue_by_region: revenueByRegion,
      top_regions: topRegions,
      customer_distribution: customerDistribution
    };
  } catch (error) {
    console.error('Error fetching geographic analytics:', error);
    throw error;
  }
};

export const getTrendAnalytics = async (filters?: AnalyticsFilters): Promise<TrendAnalytics> => {
  try {
    // Get revenue and order analytics for trend analysis
    const revenueAnalytics = await getRevenueAnalytics(filters);
    const orderAnalytics = await getOrderAnalytics(filters);
    const customerAnalytics = await getCustomerAnalytics(filters);

    // Calculate trends based on recent data
    const recentRevenue = revenueAnalytics.revenue_by_period.slice(-7);
    const previousRevenue = revenueAnalytics.revenue_by_period.slice(-14, -7);

    const recentOrders = orderAnalytics.orders_by_period.slice(-7);
    const previousOrders = orderAnalytics.orders_by_period.slice(-14, -7);

    const recentCustomers = customerAnalytics.customers_by_period.slice(-7);
    const previousCustomers = customerAnalytics.customers_by_period.slice(-14, -7);

    // Calculate trend directions
    const revenueTrend = calculateTrend(recentRevenue, previousRevenue);
    const orderTrend = calculateTrend(recentOrders, previousOrders);
    const customerTrend = calculateTrend(recentCustomers, previousCustomers);

    // Simple growth forecast (extrapolation)
    const growthForecast = {
      revenue: revenueAnalytics.total_revenue * 1.1, // 10% growth assumption
      orders: orderAnalytics.total_orders * 1.05, // 5% growth assumption
      customers: customerAnalytics.total_customers * 1.08 // 8% growth assumption
    };

    // Basic seasonal patterns (placeholder)
    const seasonalPatterns = [
      {
        period: 'Q1',
        pattern_type: 'normal' as const,
        description: 'Standard business quarter',
        impact_score: 1.0
      },
      {
        period: 'Q2',
        pattern_type: 'peak' as const,
        description: 'Peak fitness season',
        impact_score: 1.2
      }
    ];

    return {
      revenue_trend: revenueTrend,
      order_trend: orderTrend,
      customer_trend: customerTrend,
      growth_forecast: growthForecast,
      seasonal_patterns: seasonalPatterns
    };
  } catch (error) {
    console.error('Error fetching trend analytics:', error);
    throw error;
  }
};

// Helper function to calculate trend direction
const calculateTrend = (recent: TimeSeriesData[], previous: TimeSeriesData[]): 'increasing' | 'decreasing' | 'stable' => {
  const recentAvg = recent.reduce((sum, item) => sum + item.value, 0) / recent.length;
  const previousAvg = previous.reduce((sum, item) => sum + item.value, 0) / previous.length;

  const change = ((recentAvg - previousAvg) / previousAvg) * 100;

  if (change > 5) return 'increasing';
  if (change < -5) return 'decreasing';
  return 'stable';
};

export const getRealTimeMetrics = async (): Promise<RealTimeMetrics> => {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Get today's orders
    const todayOrdersQuery = query(
      collection(db, 'orders'),
      where('created_at', '>=', today)
    );
    const todayOrdersSnapshot = await getDocs(todayOrdersQuery);
    const todayOrders = todayOrdersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Order[];

    // Get pending orders
    const pendingOrdersQuery = query(
      collection(db, 'orders'),
      where('status', '==', 'pending')
    );
    const pendingOrdersSnapshot = await getDocs(pendingOrdersQuery);

    // Get all orders for current count
    const allOrdersSnapshot = await getDocs(collection(db, 'orders'));
    const allOrders = allOrdersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Order[];

    // Get unique customers
    const uniqueCustomers = new Set(allOrders.map(order => order.customer_email));

    // Get low stock products
    const productsSnapshot = await getDocs(collection(db, 'products'));
    const products = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
    const lowStockProducts = products.filter(product => product.in_stock && product.in_stock < 10).length;

    return {
      current_orders: allOrders.length,
      pending_orders: pendingOrdersSnapshot.size,
      today_revenue: todayOrders.reduce((sum, order) => sum + order.total_amount, 0),
      today_orders: todayOrders.length,
      active_customers: uniqueCustomers.size,
      low_stock_alerts: lowStockProducts
    };
  } catch (error) {
    console.error('Error fetching real-time metrics:', error);
    throw error;
  }
};

export const getAnalyticsSummary = async (filters?: AnalyticsFilters): Promise<AnalyticsSummary> => {
  try {
    const [
      revenue,
      orders,
      customers,
      products,
      geography,
      trends
    ] = await Promise.all([
      getRevenueAnalytics(filters),
      getOrderAnalytics(filters),
      getCustomerAnalytics(filters),
      getProductAnalytics(filters),
      getGeographicAnalytics(filters),
      getTrendAnalytics(filters)
    ]);

    return {
      revenue,
      orders,
      customers,
      products,
      geography,
      trends,
      last_updated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching analytics summary:', error);
    throw error;
  }
};