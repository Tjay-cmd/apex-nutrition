export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  status: 'active' | 'inactive';
  featured: boolean;
  stock: number;
  image_url?: string;
  back_label_image_url?: string;
  ingredients?: string[];
  benefits?: string[];
  nutritional_info?: {
    serving_size: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
    sugar?: number;
    sodium?: number;
  };
  usage_instructions?: string;
  created_at: string;
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  featured: boolean;
  status: 'active' | 'inactive';
  image_url?: string;
  back_label_image_url?: string;
  ingredients?: string[];
  benefits?: string[];
  nutritional_info?: {
    serving_size: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
    sugar?: number;
    sodium?: number;
  };
  usage_instructions?: string;
}

export interface UpdateProductData {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  stock?: number;
  featured?: boolean;
  status?: 'active' | 'inactive';
  image_url?: string;
  back_label_image_url?: string;
  ingredients?: string[];
  benefits?: string[];
  nutritional_info?: {
    serving_size: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
    sugar?: number;
    sodium?: number;
  };
  usage_instructions?: string;
}