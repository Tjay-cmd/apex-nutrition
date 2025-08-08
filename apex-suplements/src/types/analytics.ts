// Analytics Data Types
export interface TimeSeriesData {
  date: string;
  value: number;
  label?: string;
}

export interface RevenueAnalytics {
  total_revenue: number;
  average_order_value: number;
  revenue_growth_rate: number;
  revenue_by_period: TimeSeriesData[];
  revenue_by_status: {
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
}

export interface OrderAnalytics {
  total_orders: number;
  orders_by_status: {
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
  orders_by_period: TimeSeriesData[];
  average_processing_time: number;
  order_completion_rate: number;
}

export interface CustomerAnalytics {
  total_customers: number;
  new_customers: number;
  returning_customers: number;
  customer_acquisition_rate: number;
  customer_retention_rate: number;
  average_customer_value: number;
  customers_by_period: TimeSeriesData[];
  top_customers: CustomerRanking[];
}

export interface CustomerRanking {
  customer_id: string;
  customer_name: string;
  customer_email: string;
  total_orders: number;
  total_spent: number;
  average_order_value: number;
  last_order_date: string;
}

export interface ProductAnalytics {
  total_products: number;
  top_products: ProductRanking[];
  products_by_category: Record<string, number>;
  low_stock_products: ProductStock[];
  product_performance: ProductPerformance[];
}

export interface ProductRanking {
  product_id: string;
  product_name: string;
  total_sold: number;
  revenue_generated: number;
  average_rating: number;
  category: string;
}

export interface ProductStock {
  product_id: string;
  product_name: string;
  current_stock: number;
  min_stock_level: number;
  category: string;
}

export interface ProductPerformance {
  product_id: string;
  product_name: string;
  sales_by_period: TimeSeriesData[];
  revenue_by_period: TimeSeriesData[];
  category: string;
}

export interface GeographicAnalytics {
  orders_by_region: Record<string, number>;
  revenue_by_region: Record<string, number>;
  top_regions: RegionRanking[];
  customer_distribution: Record<string, number>;
}

export interface RegionRanking {
  region: string;
  orders: number;
  revenue: number;
  customers: number;
  average_order_value: number;
}

export interface TrendAnalytics {
  revenue_trend: 'increasing' | 'decreasing' | 'stable';
  order_trend: 'increasing' | 'decreasing' | 'stable';
  customer_trend: 'increasing' | 'decreasing' | 'stable';
  growth_forecast: {
    revenue: number;
    orders: number;
    customers: number;
  };
  seasonal_patterns: SeasonalPattern[];
}

export interface SeasonalPattern {
  period: string;
  pattern_type: 'peak' | 'valley' | 'normal';
  description: string;
  impact_score: number;
}

export interface AnalyticsFilters {
  date_from?: string;
  date_to?: string;
  status?: string;
  category?: string;
  region?: string;
  customer_type?: 'new' | 'returning' | 'all';
  product_category?: string;
  time_granularity?: 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year';
}

export interface AnalyticsSummary {
  revenue: RevenueAnalytics;
  orders: OrderAnalytics;
  customers: CustomerAnalytics;
  products: ProductAnalytics;
  geography: GeographicAnalytics;
  trends: TrendAnalytics;
  last_updated: string;
}

export interface AnalyticsExport {
  type: 'csv' | 'pdf' | 'excel';
  data: AnalyticsSummary;
  filters: AnalyticsFilters;
  generated_at: string;
  filename: string;
}

// Real-time Analytics Types
export interface RealTimeMetrics {
  current_orders: number;
  pending_orders: number;
  today_revenue: number;
  today_orders: number;
  active_customers: number;
  low_stock_alerts: number;
}

export interface AnalyticsCache {
  key: string;
  data: any;
  timestamp: number;
  expires_at: number;
}

// Performance Metrics
export interface PerformanceMetrics {
  page_load_time: number;
  data_fetch_time: number;
  cache_hit_rate: number;
  query_execution_time: number;
}

// Chart Configuration Types
export interface ChartConfig {
  type: 'line' | 'bar' | 'pie' | 'doughnut' | 'area';
  data: any;
  options: any;
  responsive: boolean;
  maintainAspectRatio: boolean;
}

export interface DashboardWidget {
  id: string;
  title: string;
  type: 'chart' | 'metric' | 'table' | 'list';
  config: ChartConfig | any;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  refresh_interval?: number;
}