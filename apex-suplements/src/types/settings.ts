// Store Settings Types
export interface StoreSettings {
  id: string;
  company_info: CompanyInfo;
  branding: BrandingSettings;
  social_media: SocialMediaSettings;
  legal_pages: LegalPages;
  seo_settings: SEOSettings;
  created_at: string;
  updated_at: string;
  updated_by: string;
}

// Company Information
export interface CompanyInfo {
  name: string;
  legal_name: string;
  registration_number: string;
  vat_number: string;
  address: CompanyAddress;
  contact: CompanyContact;
  business_hours: BusinessHours;
}

export interface CompanyAddress {
  street: string;
  city: string;
  province: string;
  postal_code: string;
  country: string;
}

export interface CompanyContact {
  phone: string;
  email: string;
  support_email: string;
  website?: string;
}

export interface BusinessHours {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
  timezone: string;
}

// Branding Settings
export interface BrandingSettings {
  logo_url?: string;
  favicon_url?: string;
  color_scheme?: ColorScheme;
  custom_colors?: CustomColors;
  typography?: TypographySettings;
  custom_css?: string;
  logo_alt_text?: string;
  favicon_alt_text?: string;
}

export interface ColorScheme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    muted: string;
  };
}

export interface CustomColors {
  primary?: string;
  secondary?: string;
  accent?: string;
}

export interface TypographySettings {
  primary_font?: string;
  secondary_font?: string;
  heading_scale?: number;
  body_scale?: number;
  line_height?: number;
}

// Social Media Settings
export interface SocialMediaSettings {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
  linkedin?: string;
  tiktok?: string;
  pinterest?: string;
}

// Legal Pages
export interface LegalPages {
  terms_of_service: LegalPage;
  privacy_policy: LegalPage;
  shipping_policy: LegalPage;
  returns_policy: LegalPage;
  cookie_policy: LegalPage;
  disclaimer: LegalPage;
}

export interface LegalPage {
  content: string;
  version: string;
  published_at: string;
  published_by: string;
  is_published: boolean;
  last_updated: string;
}

// SEO Settings
export interface SEOSettings {
  homepage: PageSEO;
  shop_page: PageSEO;
  about_page: PageSEO;
  contact_page: PageSEO;
  products_page: PageSEO;
  blog_page?: PageSEO;
}

export interface PageSEO {
  title: string;
  description: string;
  keywords: string;
  og_image?: string;
  og_title?: string;
  og_description?: string;
  twitter_card?: string;
  canonical_url?: string;
}

// Settings Update Types
export interface SettingsUpdate {
  company_info?: Partial<CompanyInfo>;
  branding?: Partial<BrandingSettings>;
  social_media?: Partial<SocialMediaSettings>;
  legal_pages?: Partial<LegalPages>;
  seo_settings?: Partial<SEOSettings>;
}

// Settings Validation
export interface SettingsValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Settings Permissions
export interface SettingsPermissions {
  can_edit_company_info: boolean;
  can_edit_branding: boolean;
  can_edit_social_media: boolean;
  can_edit_legal_pages: boolean;
  can_edit_seo_settings: boolean;
}

// Default Settings
export const DEFAULT_STORE_SETTINGS: Omit<StoreSettings, 'id' | 'created_at' | 'updated_at' | 'updated_by'> = {
  company_info: {
    name: 'Apex Nutrition',
    legal_name: 'Apex Nutrition (Pty) Ltd',
    registration_number: '',
    vat_number: '',
    address: {
      street: '',
      city: '',
      province: '',
      postal_code: '',
      country: 'South Africa'
    },
    contact: {
      phone: '',
      email: '',
      support_email: '',
      website: ''
    },
    business_hours: {
      monday: '08:00-17:00',
      tuesday: '08:00-17:00',
      wednesday: '08:00-17:00',
      thursday: '08:00-17:00',
      friday: '08:00-17:00',
      saturday: '09:00-15:00',
      sunday: 'Closed',
      timezone: 'Africa/Johannesburg'
    }
  },
  branding: {
    logo_url: '/Logo.png',
    favicon_url: '/favicon.ico',
    color_scheme: {
      name: 'Apex Red',
      colors: {
        primary: '#e11d48',
        secondary: '#facc15',
        accent: '#f59e0b',
        background: '#ffffff',
        surface: '#f8fafc',
        text: '#1e293b',
        muted: '#64748b'
      }
    },
    custom_colors: {
      primary: '#e11d48',
      secondary: '#facc15',
      accent: '#f59e0b'
    },
    typography: {
      primary_font: 'Inter',
      secondary_font: 'Poppins',
      heading_scale: 1.5,
      body_scale: 1,
      line_height: 1.6
    },
    custom_css: '',
    logo_alt_text: 'Apex Nutrition Logo',
    favicon_alt_text: 'Apex Nutrition Favicon'
  },
  social_media: {
    facebook: '',
    instagram: '',
    twitter: '',
    youtube: '',
    linkedin: '',
    tiktok: '',
    pinterest: ''
  },
  legal_pages: {
    terms_of_service: {
      content: '',
      version: '1.0.0',
      published_at: '',
      published_by: '',
      is_published: false,
      last_updated: ''
    },
    privacy_policy: {
      content: '',
      version: '1.0.0',
      published_at: '',
      published_by: '',
      is_published: false,
      last_updated: ''
    },
    shipping_policy: {
      content: '',
      version: '1.0.0',
      published_at: '',
      published_by: '',
      is_published: false,
      last_updated: ''
    },
    returns_policy: {
      content: '',
      version: '1.0.0',
      published_at: '',
      published_by: '',
      is_published: false,
      last_updated: ''
    },
    cookie_policy: {
      content: '',
      version: '1.0.0',
      published_at: '',
      published_by: '',
      is_published: false,
      last_updated: ''
    },
    disclaimer: {
      content: '',
      version: '1.0.0',
      published_at: '',
      published_by: '',
      is_published: false,
      last_updated: ''
    }
  },
  seo_settings: {
    homepage: {
      title: 'Apex Nutrition - Premium Supplements for Champions',
      description: 'Premium supplements trusted by professional athletes. Formulated for champions, available for everyone.',
      keywords: 'supplements, nutrition, protein, pre-workout, recovery, fitness, sports nutrition',
      og_title: 'Apex Nutrition - Premium Supplements for Champions',
      og_description: 'Premium supplements trusted by professional athletes.',
      twitter_card: 'summary_large_image'
    },
    shop_page: {
      title: 'Shop Supplements - Apex Nutrition',
      description: 'Browse our premium selection of supplements designed for athletes and fitness enthusiasts.',
      keywords: 'protein powder, creatine, BCAA, vitamins, supplements, fitness',
      og_title: 'Shop Supplements - Apex Nutrition',
      og_description: 'Browse our premium selection of supplements.',
      twitter_card: 'summary_large_image'
    },
    about_page: {
      title: 'About Apex Nutrition - Our Story',
      description: 'Learn about our commitment to quality, innovation, and excellence in sports nutrition.',
      keywords: 'about us, company history, quality assurance, sports nutrition',
      og_title: 'About Apex Nutrition - Our Story',
      og_description: 'Learn about our commitment to quality and innovation.',
      twitter_card: 'summary_large_image'
    },
    contact_page: {
      title: 'Contact Us - Apex Nutrition',
      description: 'Get in touch with our team for support, questions, or partnership opportunities.',
      keywords: 'contact, support, customer service, help',
      og_title: 'Contact Us - Apex Nutrition',
      og_description: 'Get in touch with our team for support.',
      twitter_card: 'summary_large_image'
    },
    products_page: {
      title: 'Products - Apex Nutrition',
      description: 'Explore our comprehensive range of premium supplements and nutrition products.',
      keywords: 'products, supplements, nutrition, protein, vitamins',
      og_title: 'Products - Apex Nutrition',
      og_description: 'Explore our comprehensive range of premium supplements.',
      twitter_card: 'summary_large_image'
    }
  }
};