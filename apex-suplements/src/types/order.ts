export interface Address {
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  image_url?: string;
}

export interface OrderStatus {
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  updated_at: string;
  updated_by: string;
  notes?: string;
}

export interface Order {
  id: string;
  user_id: string;
  customer_email: string;
  customer_name: string;
  customer_phone?: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  subtotal: number;
  shipping_cost: number;
  tax_amount: number;
  total_amount: number;
  shipping_address: Address;
  billing_address: Address;
  items: OrderItem[];
  status_history: OrderStatus[];
  tracking_number?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateOrderData {
  user_id: string;
  customer_email: string;
  customer_name: string;
  customer_phone?: string;
  subtotal: number;
  shipping_cost: number;
  tax_amount: number;
  total_amount: number;
  shipping_address: Address;
  billing_address: Address;
  items: OrderItem[];
}

export interface UpdateOrderData {
  status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status?: 'pending' | 'paid' | 'failed' | 'refunded';
  tracking_number?: string;
  notes?: string;
}

export interface OrderFilters {
  status?: string;
  payment_status?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
  min_amount?: number;
  max_amount?: number;
  customer_email?: string;
}

export interface OrderStats {
  total_orders: number;
  total_revenue: number;
  pending_orders: number;
  processing_orders: number;
  shipped_orders: number;
  delivered_orders: number;
  cancelled_orders: number;
}