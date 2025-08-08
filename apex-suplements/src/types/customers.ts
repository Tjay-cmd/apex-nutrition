// Customer Management Types

export interface CustomerAddress {
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  address_type: 'shipping' | 'billing' | 'both';
}

export interface CustomerContact {
  email: string;
  phone?: string;
  alternate_phone?: string;
  preferred_contact_method: 'email' | 'phone' | 'sms';
  email_verified: boolean;
  phone_verified: boolean;
}

export interface CustomerProfile {
  first_name: string;
  last_name: string;
  display_name?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  avatar_url?: string;
  bio?: string;
  website?: string;
  company?: string;
  job_title?: string;
}

export interface CustomerPreferences {
  newsletter_subscription: boolean;
  marketing_emails: boolean;
  sms_notifications: boolean;
  push_notifications: boolean;
  language: string;
  timezone: string;
  currency: string;
  privacy_settings: {
    profile_visibility: 'public' | 'private' | 'friends_only';
    show_email: boolean;
    show_phone: boolean;
    show_address: boolean;
  };
}

export interface CustomerActivity {
  last_login: string;
  last_purchase: string;
  total_logins: number;
  total_orders: number;
  total_spent: number;
  average_order_value: number;
  days_since_last_activity: number;
  login_history: Array<{
    timestamp: string;
    ip_address: string;
    user_agent: string;
    location?: string;
  }>;
  purchase_history: Array<{
    order_id: string;
    timestamp: string;
    amount: number;
    status: string;
  }>;
}

export interface CustomerSegmentation {
  tags: string[];
  segments: string[];
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  loyalty_points: number;
  referral_code?: string;
  referred_by?: string;
  customer_since: string;
  lifetime_value: number;
  churn_risk: 'low' | 'medium' | 'high';
  engagement_score: number;
}

export interface CustomerSupport {
  support_tickets: Array<{
    ticket_id: string;
    subject: string;
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    created_at: string;
    updated_at: string;
    assigned_to?: string;
  }>;
  total_tickets: number;
  resolved_tickets: number;
  average_resolution_time: number;
  satisfaction_score?: number;
}

export interface CustomerAnalytics {
  total_orders: number;
  total_spent: number;
  average_order_value: number;
  largest_order: number;
  most_purchased_category: string;
  preferred_payment_method: string;
  preferred_shipping_method: string;
  return_rate: number;
  review_count: number;
  average_rating: number;
  last_review_date?: string;
}

export interface CustomerCommunication {
  email_campaigns: Array<{
    campaign_id: string;
    name: string;
    sent_at: string;
    opened: boolean;
    clicked: boolean;
    unsubscribed: boolean;
  }>;
  sms_campaigns: Array<{
    campaign_id: string;
    name: string;
    sent_at: string;
    delivered: boolean;
    clicked: boolean;
  }>;
  communication_preferences: {
    email_frequency: 'daily' | 'weekly' | 'monthly' | 'never';
    sms_frequency: 'daily' | 'weekly' | 'monthly' | 'never';
    preferred_time: string;
    preferred_day: string;
  };
}

export interface CustomerNotes {
  notes: Array<{
    id: string;
    content: string;
    created_by: string;
    created_at: string;
    updated_at: string;
    is_private: boolean;
    tags: string[];
  }>;
  internal_flags: string[];
  special_instructions: string;
  vip_status: boolean;
  blacklist_status: boolean;
  blacklist_reason?: string;
}

export interface Customer {
  id: string;
  uid: string; // Firebase Auth UID
  profile: CustomerProfile;
  contact: CustomerContact;
  addresses: CustomerAddress[];
  preferences: CustomerPreferences;
  activity: CustomerActivity;
  segmentation: CustomerSegmentation;
  support: CustomerSupport;
  analytics: CustomerAnalytics;
  communication: CustomerCommunication;
  notes: CustomerNotes;
  status: 'active' | 'inactive' | 'suspended' | 'deleted';
  created_at: string;
  updated_at: string;
  last_activity: string;
  source: 'website' | 'mobile_app' | 'social_media' | 'referral' | 'admin_created';
  referral_source?: string;
  utm_parameters?: {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_term?: string;
    utm_content?: string;
  };
}

export interface CustomerFilters {
  search?: string;
  status?: string[];
  tier?: string[];
  tags?: string[];
  segments?: string[];
  date_range?: {
    start: string;
    end: string;
  };
  total_spent_range?: {
    min: number;
    max: number;
  };
  order_count_range?: {
    min: number;
    max: number;
  };
  last_activity_days?: number;
  created_date_range?: {
    start: string;
    end: string;
  };
  location?: {
    country?: string;
    state?: string;
    city?: string;
  };
  email_verified?: boolean;
  phone_verified?: boolean;
  newsletter_subscribed?: boolean;
  has_support_tickets?: boolean;
  vip_status?: boolean;
  blacklist_status?: boolean;
}

export interface CustomerSortOptions {
  field: 'created_at' | 'updated_at' | 'last_activity' | 'total_spent' | 'total_orders' | 'first_name' | 'last_name' | 'email' | 'lifetime_value' | 'engagement_score';
  direction: 'asc' | 'desc';
}

export interface CustomerPagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface CustomerListResponse {
  customers: Customer[];
  pagination: CustomerPagination;
  filters: CustomerFilters;
  sort: CustomerSortOptions;
}

export interface CustomerStats {
  total_customers: number;
  active_customers: number;
  new_customers_this_month: number;
  customers_with_orders: number;
  average_lifetime_value: number;
  top_spending_customers: number;
  customers_by_tier: {
    bronze: number;
    silver: number;
    gold: number;
    platinum: number;
  };
  customers_by_status: {
    active: number;
    inactive: number;
    suspended: number;
    deleted: number;
  };
  average_engagement_score: number;
  churn_rate: number;
}

export interface CustomerImportData {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  company?: string;
  job_title?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  tags?: string[];
  segments?: string[];
  tier?: string;
  notes?: string;
  source?: string;
  created_at?: string;
}

export interface CustomerExportOptions {
  fields: string[];
  format: 'csv' | 'json' | 'xlsx';
  filters?: CustomerFilters;
  sort?: CustomerSortOptions;
  include_activity?: boolean;
  include_analytics?: boolean;
  include_notes?: boolean;
}

// Default customer data for new customers
export const DEFAULT_CUSTOMER_DATA: Partial<Customer> = {
  profile: {
    first_name: '',
    last_name: '',
    display_name: '',
    date_of_birth: '',
    gender: 'prefer_not_to_say',
    avatar_url: '',
    bio: '',
    website: '',
    company: '',
    job_title: ''
  },
  contact: {
    email: '',
    phone: '',
    alternate_phone: '',
    preferred_contact_method: 'email',
    email_verified: false,
    phone_verified: false
  },
  addresses: [],
  preferences: {
    newsletter_subscription: true,
    marketing_emails: true,
    sms_notifications: false,
    push_notifications: false,
    language: 'en',
    timezone: 'UTC',
    currency: 'USD',
    privacy_settings: {
      profile_visibility: 'private',
      show_email: false,
      show_phone: false,
      show_address: false
    }
  },
  activity: {
    last_login: '',
    last_purchase: '',
    total_logins: 0,
    total_orders: 0,
    total_spent: 0,
    average_order_value: 0,
    days_since_last_activity: 0,
    login_history: [],
    purchase_history: []
  },
  segmentation: {
    tags: [],
    segments: [],
    tier: 'bronze',
    loyalty_points: 0,
    referral_code: '',
    referred_by: '',
    customer_since: '',
    lifetime_value: 0,
    churn_risk: 'low',
    engagement_score: 0
  },
  support: {
    support_tickets: [],
    total_tickets: 0,
    resolved_tickets: 0,
    average_resolution_time: 0,
    satisfaction_score: 0
  },
  analytics: {
    total_orders: 0,
    total_spent: 0,
    average_order_value: 0,
    largest_order: 0,
    most_purchased_category: '',
    preferred_payment_method: '',
    preferred_shipping_method: '',
    return_rate: 0,
    review_count: 0,
    average_rating: 0,
    last_review_date: ''
  },
  communication: {
    email_campaigns: [],
    sms_campaigns: [],
    communication_preferences: {
      email_frequency: 'weekly',
      sms_frequency: 'never',
      preferred_time: '09:00',
      preferred_day: 'monday'
    }
  },
  notes: {
    notes: [],
    internal_flags: [],
    special_instructions: '',
    vip_status: false,
    blacklist_status: false,
    blacklist_reason: ''
  },
  status: 'active',
  source: 'website',
  referral_source: '',
  utm_parameters: {}
};

// Customer validation schemas
export const CUSTOMER_VALIDATION_SCHEMA = {
  profile: {
    first_name: { required: true, minLength: 1, maxLength: 50 },
    last_name: { required: true, minLength: 1, maxLength: 50 },
    email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    phone: { required: false, pattern: /^\+?[\d\s\-\(\)]+$/ }
  },
  contact: {
    email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    phone: { required: false, pattern: /^\+?[\d\s\-\(\)]+$/ }
  },
  addresses: {
    street: { required: true, minLength: 5, maxLength: 100 },
    city: { required: true, minLength: 2, maxLength: 50 },
    state: { required: true, minLength: 2, maxLength: 50 },
    postal_code: { required: true, minLength: 3, maxLength: 10 },
    country: { required: true, minLength: 2, maxLength: 50 }
  }
};

// Customer search and filter options
export const CUSTOMER_SEARCH_FIELDS = [
  'first_name',
  'last_name',
  'email',
  'phone',
  'company',
  'display_name',
  'tags',
  'segments'
] as const;

export const CUSTOMER_STATUS_OPTIONS = [
  { value: 'active', label: 'Active', color: 'green' },
  { value: 'inactive', label: 'Inactive', color: 'gray' },
  { value: 'suspended', label: 'Suspended', color: 'yellow' },
  { value: 'deleted', label: 'Deleted', color: 'red' }
] as const;

export const CUSTOMER_TIER_OPTIONS = [
  { value: 'bronze', label: 'Bronze', color: 'amber' },
  { value: 'silver', label: 'Silver', color: 'gray' },
  { value: 'gold', label: 'Gold', color: 'yellow' },
  { value: 'platinum', label: 'Platinum', color: 'purple' }
] as const;

export const CUSTOMER_CHURN_RISK_OPTIONS = [
  { value: 'low', label: 'Low Risk', color: 'green' },
  { value: 'medium', label: 'Medium Risk', color: 'yellow' },
  { value: 'high', label: 'High Risk', color: 'red' }
] as const;

export const CUSTOMER_SORT_FIELDS = [
  { value: 'created_at', label: 'Date Created' },
  { value: 'updated_at', label: 'Last Updated' },
  { value: 'last_activity', label: 'Last Activity' },
  { value: 'total_spent', label: 'Total Spent' },
  { value: 'total_orders', label: 'Total Orders' },
  { value: 'first_name', label: 'First Name' },
  { value: 'last_name', label: 'Last Name' },
  { value: 'email', label: 'Email' },
  { value: 'lifetime_value', label: 'Lifetime Value' },
  { value: 'engagement_score', label: 'Engagement Score' }
] as const;