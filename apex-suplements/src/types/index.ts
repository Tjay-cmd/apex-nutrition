// Product Types
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description?: string;
  price: number;
  sale_price?: number;
  sku: string;
  stock_quantity: number;
  stock_status: 'in_stock' | 'out_of_stock' | 'low_stock';
  category_id: string;
  subcategory_id?: string;
  brand?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  images: ProductImage[];
  ingredients?: string[];
  nutrition_facts?: NutritionFacts;
  usage_instructions?: string;
  warnings?: string;
  tags: string[];
  sport_specific?: string[];
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt_text: string;
  is_primary: boolean;
  sort_order: number;
}

export interface NutritionFacts {
  serving_size: string;
  servings_per_container: number;
  calories?: number;
  total_fat?: number;
  saturated_fat?: number;
  cholesterol?: number;
  sodium?: number;
  total_carbs?: number;
  dietary_fiber?: number;
  sugars?: number;
  protein?: number;
  other_nutrients?: { [key: string]: number };
}

// Category Types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  parent_id?: string;
  sort_order: number;
  product_count: number;
  created_at: string;
  updated_at: string;
}

// User Types
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: 'customer' | 'admin' | 'super_admin';
  avatar_url?: string;
  date_of_birth?: string;
  sport_interests?: string[];
  fitness_goals?: string[];
  created_at: string;
  updated_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  type: 'billing' | 'shipping';
  first_name: string;
  last_name: string;
  company?: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  province: string;
  postal_code: string;
  country: string;
  phone?: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

// Cart & Order Types
export interface CartItem {
  id: string;
  product_id: string;
  product: Product;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Cart {
  id: string;
  user_id?: string;
  session_id?: string;
  items: CartItem[];
  subtotal: number;
  tax_amount: number;
  shipping_amount: number;
  total_amount: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  user: User;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  items: OrderItem[];
  subtotal: number;
  tax_amount: number;
  shipping_amount: number;
  discount_amount: number;
  total_amount: number;
  billing_address: Address;
  shipping_address: Address;
  payment_method: string;
  payment_intent_id?: string;
  shipping_method: string;
  tracking_number?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_sku: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

// Analytics & Dashboard Types
export interface DashboardMetrics {
  total_revenue: number;
  total_orders: number;
  total_customers: number;
  total_products: number;
  revenue_change: number;
  orders_change: number;
  customers_change: number;
  top_products: TopProduct[];
  recent_orders: Order[];
  low_stock_products: Product[];
}

export interface TopProduct {
  product_id: string;
  name: string;
  total_sold: number;
  revenue: number;
}

export interface SalesData {
  date: string;
  revenue: number;
  orders: number;
  customers: number;
}

// Partnership Types
export interface Partnership {
  id: string;
  name: string;
  logo_url: string;
  type: 'rugby' | 'hockey' | 'cycling' | 'swimming' | 'general_sports';
  description?: string;
  website_url?: string;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// Newsletter & Marketing Types
export interface NewsletterSubscriber {
  id: string;
  email: string;
  first_name?: string;
  status: 'subscribed' | 'unsubscribed';
  sport_interests?: string[];
  subscribed_at: string;
  unsubscribed_at?: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

// Re-export settings types
export * from './settings';
export * from './customers';

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

// Form Types
export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
  sport?: string;
}

export interface ProductReview {
  id: string;
  product_id: string;
  user_id: string;
  user_name: string;
  rating: number;
  title: string;
  comment: string;
  verified_purchase: boolean;
  helpful_votes: number;
  created_at: string;
  updated_at: string;
}

// Search & Filter Types
export interface ProductFilters {
  categories?: string[];
  price_min?: number;
  price_max?: number;
  brands?: string[];
  sports?: string[];
  in_stock?: boolean;
  on_sale?: boolean;
  sort_by?: 'name' | 'price' | 'created_at' | 'popularity';
  sort_order?: 'asc' | 'desc';
}

export interface SearchQuery {
  q?: string;
  filters?: ProductFilters;
  page?: number;
  limit?: number;
}