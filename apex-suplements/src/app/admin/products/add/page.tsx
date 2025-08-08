"use client";

import React, { useState } from 'react';
import { RoleGuard } from '@/components/auth/role-guard';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Save,
  Upload,
  X,
  Package,
  DollarSign,
  Tag,
  FileText,
  Eye,
  EyeOff
} from 'lucide-react';
import Link from 'next/link';
import { createProduct, uploadBase64ToStorage } from '@/lib/firebase-queries';
import { compressImage, isImageSizeAcceptable } from '@/lib/image-utils';
import type { CreateProductData } from '@/types/product';

interface ProductForm extends CreateProductData {
  // Extends the CreateProductData interface
}

const AddProductPage = () => {
  const [formData, setFormData] = useState<ProductForm>({
    name: '',
    description: '',
    price: 0,
    category: '',
    stock: 0,
    featured: false,
    status: 'active',
    image_url: '',
    back_label_image_url: '',
    ingredients: [],
    benefits: [],
    nutritional_info: {
      serving_size: '',
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0,
    },
    usage_instructions: '',
  });

  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [backLabelImagePreview, setBackLabelImagePreview] = useState<string | null>(null);
  const [ingredientsText, setIngredientsText] = useState('');
  const [benefitsText, setBenefitsText] = useState('');

  const categories = [
    'Pre-Workout',
    'Protein',
    'Creatine',
    'Amino Acids',
    'Vitamins',
    'Minerals',
    'Fat Burners',
    'Recovery',
    'Energy',
    'Other'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
        setFormData(prev => ({ ...prev, image_url: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackLabelImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBackLabelImagePreview(e.target?.result as string);
        setFormData(prev => ({ ...prev, back_label_image_url: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData(prev => ({ ...prev, image_url: '' }));
  };

  const removeBackLabelImage = () => {
    setBackLabelImagePreview(null);
    setFormData(prev => ({ ...prev, back_label_image_url: '' }));
  };

  const handleIngredientsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setIngredientsText(text);
    const ingredients = text.split('\n').filter(line => line.trim() !== '');
    setFormData(prev => ({ ...prev, ingredients }));
  };

  const handleBenefitsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setBenefitsText(text);
    const benefits = text.split('\n').filter(line => line.trim() !== '');
    setFormData(prev => ({ ...prev, benefits }));
  };

  const handleNutritionalInfoChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      nutritional_info: {
        ...prev.nutritional_info!,
        [field]: typeof value === 'string' ? value : parseFloat(value as string) || 0
      }
    }));
  };

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload images to Firebase Storage if they exist
      let imageUrl = formData.image_url;
      let backLabelImageUrl = formData.back_label_image_url;

      try {
        // Compress images if they are base64 and too large
        if (formData.image_url && formData.image_url.startsWith('data:')) {
          if (!isImageSizeAcceptable(formData.image_url)) {
            imageUrl = await compressImage(formData.image_url, 800, 0.7);
            console.log('Image compressed for storage');
          } else {
            imageUrl = formData.image_url;
          }
        }

        if (formData.back_label_image_url && formData.back_label_image_url.startsWith('data:')) {
          if (!isImageSizeAcceptable(formData.back_label_image_url)) {
            backLabelImageUrl = await compressImage(formData.back_label_image_url, 800, 0.7);
            console.log('Back label image compressed for storage');
          } else {
            backLabelImageUrl = formData.back_label_image_url;
          }
        }
      } catch (error) {
        console.warn('Image compression failed, using original data');
        // Continue with the original data if compression fails
      }

      // Create product data with storage URLs
      const productData = {
        ...formData,
        image_url: imageUrl,
        back_label_image_url: backLabelImageUrl,
      };

      const result = await createProduct(productData);

      if (result.success) {
        // Redirect to products page after successful save
        window.location.href = '/admin/products';
      } else {
        console.error('Error creating product:', result.error);
        alert('Error creating product. Please try again.');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error creating product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <RoleGuard allowedRoles={['admin', 'super_admin']}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  asChild
                  className="border-gray-300 text-gray-700 hover:border-apex-red hover:text-apex-red"
                >
                  <Link href="/admin/products">
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Back to Products
                  </Link>
                </Button>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
                  <p className="text-gray-600 mt-2">Create a new product for your catalog</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              {/* Basic Information */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Package className="h-5 w-5 mr-2 text-apex-red" />
                  Basic Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Product Name */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-apex-red focus:border-transparent transition-colors text-gray-900 placeholder:text-gray-500"
                      placeholder="Enter product name"
                    />
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-apex-red focus:border-transparent transition-colors text-gray-900 placeholder:text-gray-500 resize-none"
                      placeholder="Enter product description"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-apex-red focus:border-transparent transition-colors text-gray-900"
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-apex-red focus:border-transparent transition-colors text-gray-900"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Pricing & Inventory */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-apex-red" />
                  Pricing & Inventory
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (ZAR) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R</span>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                        min="0"
                        step="0.01"
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-apex-red focus:border-transparent transition-colors text-gray-900"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  {/* Stock */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock Quantity *
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-apex-red focus:border-transparent transition-colors text-gray-900"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* Product Images */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Upload className="h-5 w-5 mr-2 text-apex-red" />
                  Product Images
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Main Product Image */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Main Product Image</h3>
                    <div className="flex items-center space-x-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl border-2 border-dashed border-gray-300 hover:border-apex-red transition-colors flex items-center space-x-2"
                      >
                        <Upload className="h-5 w-5" />
                        <span>Upload Main Image</span>
                      </label>

                      {imagePreview && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={removeImage}
                          className="border-red-300 text-red-600 hover:border-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      )}
                    </div>

                    {/* Image Preview */}
                    {imagePreview && (
                      <div className="relative w-48 h-48 bg-gray-100 rounded-xl overflow-hidden">
                        <img
                          src={imagePreview}
                          alt="Product preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>

                  {/* Back Label Image */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Back Label Image (Nutritional Info)</h3>
                    <div className="flex items-center space-x-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleBackLabelImageUpload}
                        className="hidden"
                        id="back-label-image-upload"
                      />
                      <label
                        htmlFor="back-label-image-upload"
                        className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl border-2 border-dashed border-gray-300 hover:border-apex-red transition-colors flex items-center space-x-2"
                      >
                        <Upload className="h-5 w-5" />
                        <span>Upload Back Label</span>
                      </label>

                      {backLabelImagePreview && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={removeBackLabelImage}
                          className="border-red-300 text-red-600 hover:border-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      )}
                    </div>

                    {/* Back Label Image Preview */}
                    {backLabelImagePreview && (
                      <div className="relative w-48 h-48 bg-gray-100 rounded-xl overflow-hidden">
                        <img
                          src={backLabelImagePreview}
                          alt="Back label preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Detailed Information */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-apex-red" />
                  Detailed Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Ingredients */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ingredients (one per line)
                    </label>
                    <textarea
                      value={ingredientsText}
                      onChange={handleIngredientsChange}
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-apex-red focus:border-transparent transition-colors text-gray-900 placeholder:text-gray-500 resize-none"
                      placeholder="Enter ingredients, one per line&#10;Example:&#10;Whey Protein Isolate&#10;Natural Flavors&#10;Sweeteners"
                    />
                    <p className="text-xs text-gray-500 mt-1">Enter each ingredient on a new line</p>
                  </div>

                  {/* Benefits */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Benefits (one per line)
                    </label>
                    <textarea
                      value={benefitsText}
                      onChange={handleBenefitsChange}
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-apex-red focus:border-transparent transition-colors text-gray-900 placeholder:text-gray-500 resize-none"
                      placeholder="Enter benefits, one per line&#10;Example:&#10;Builds lean muscle mass&#10;Supports muscle recovery&#10;High-quality protein source"
                    />
                    <p className="text-xs text-gray-500 mt-1">Enter each benefit on a new line</p>
                  </div>

                  {/* Usage Instructions */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Usage Instructions
                    </label>
                    <textarea
                      name="usage_instructions"
                      value={formData.usage_instructions}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-apex-red focus:border-transparent transition-colors text-gray-900 placeholder:text-gray-500 resize-none"
                      placeholder="Enter usage instructions..."
                    />
                  </div>
                </div>
              </div>

              {/* Nutritional Information */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Package className="h-5 w-5 mr-2 text-apex-red" />
                  Nutritional Information (Per Serving)
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Serving Size */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Serving Size
                    </label>
                    <input
                      type="text"
                      value={formData.nutritional_info?.serving_size || ''}
                      onChange={(e) => handleNutritionalInfoChange('serving_size', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-apex-red focus:border-transparent transition-colors text-gray-900"
                      placeholder="e.g., 30g"
                    />
                  </div>

                  {/* Calories */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Calories
                    </label>
                    <input
                      type="number"
                      value={formData.nutritional_info?.calories || ''}
                      onChange={(e) => handleNutritionalInfoChange('calories', e.target.value)}
                      min="0"
                      step="0.1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-apex-red focus:border-transparent transition-colors text-gray-900"
                      placeholder="0"
                    />
                  </div>

                  {/* Protein */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Protein (g)
                    </label>
                    <input
                      type="number"
                      value={formData.nutritional_info?.protein || ''}
                      onChange={(e) => handleNutritionalInfoChange('protein', e.target.value)}
                      min="0"
                      step="0.1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-apex-red focus:border-transparent transition-colors text-gray-900"
                      placeholder="0"
                    />
                  </div>

                  {/* Carbs */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Carbohydrates (g)
                    </label>
                    <input
                      type="number"
                      value={formData.nutritional_info?.carbs || ''}
                      onChange={(e) => handleNutritionalInfoChange('carbs', e.target.value)}
                      min="0"
                      step="0.1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-apex-red focus:border-transparent transition-colors text-gray-900"
                      placeholder="0"
                    />
                  </div>

                  {/* Fat */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fat (g)
                    </label>
                    <input
                      type="number"
                      value={formData.nutritional_info?.fat || ''}
                      onChange={(e) => handleNutritionalInfoChange('fat', e.target.value)}
                      min="0"
                      step="0.1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-apex-red focus:border-transparent transition-colors text-gray-900"
                      placeholder="0"
                    />
                  </div>

                  {/* Fiber */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fiber (g)
                    </label>
                    <input
                      type="number"
                      value={formData.nutritional_info?.fiber || ''}
                      onChange={(e) => handleNutritionalInfoChange('fiber', e.target.value)}
                      min="0"
                      step="0.1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-apex-red focus:border-transparent transition-colors text-gray-900"
                      placeholder="0"
                    />
                  </div>

                  {/* Sugar */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sugar (g)
                    </label>
                    <input
                      type="number"
                      value={formData.nutritional_info?.sugar || ''}
                      onChange={(e) => handleNutritionalInfoChange('sugar', e.target.value)}
                      min="0"
                      step="0.1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-apex-red focus:border-transparent transition-colors text-gray-900"
                      placeholder="0"
                    />
                  </div>

                  {/* Sodium */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sodium (mg)
                    </label>
                    <input
                      type="number"
                      value={formData.nutritional_info?.sodium || ''}
                      onChange={(e) => handleNutritionalInfoChange('sodium', e.target.value)}
                      min="0"
                      step="0.1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-apex-red focus:border-transparent transition-colors text-gray-900"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* Product Settings */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Tag className="h-5 w-5 mr-2 text-apex-red" />
                  Product Settings
                </h2>

                <div className="space-y-4">
                  {/* Featured Product */}
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-apex-red focus:ring-apex-red border-gray-300 rounded"
                    />
                    <label className="text-sm font-medium text-gray-700">
                      Mark as featured product
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                asChild
                className="border-gray-300 text-gray-700 hover:border-apex-red hover:text-apex-red"
              >
                <Link href="/admin/products">
                  Cancel
                </Link>
              </Button>

              <Button
                type="submit"
                disabled={loading}
                className="bg-apex-red hover:bg-red-600 text-white font-medium py-3 px-8 rounded-xl flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    <span>Save Product</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </RoleGuard>
  );
};

export default AddProductPage;