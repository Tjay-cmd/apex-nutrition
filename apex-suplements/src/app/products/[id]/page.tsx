"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import {
  Star,
  Heart,
  ShoppingCart,
  Truck,
  Shield,
  RotateCcw,
  Package,
  FileText,
  Zap,
  Info,
  CheckCircle,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getProduct } from '@/lib/firebase-queries';
import { useCart } from '@/contexts/cart-context';
import type { Product } from '@/types/product';

const ProductDetailPage = () => {
  const params = useParams();
  const productId = params.id as string;
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedImage, setSelectedImage] = useState<'main' | 'back'>('main');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productData = await getProduct(productId);

        if (productData) {
          setProduct(productData);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 1)) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-apex-red mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
          <p className="text-gray-600">The product you're looking for doesn't exist.</p>
          <Button
            onClick={() => window.history.back()}
            className="mt-4 bg-apex-red hover:bg-red-600"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
          <ol className="flex items-center space-x-2">
            <li><a href="/" className="hover:text-apex-red">Home</a></li>
            <li>/</li>
            <li><a href="/shop" className="hover:text-apex-red">Shop</a></li>
            <li>/</li>
            <li><a href={`/shop?category=${product.category}`} className="hover:text-apex-red">{product.category}</a></li>
            <li>/</li>
            <li className="text-gray-900">{product.name}</li>
          </ol>
        </nav>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Product Header */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative w-full max-w-[520px] aspect-[3/4] overflow-hidden rounded-xl bg-gray-100 mx-auto">
                <Image
                  src={selectedImage === 'main'
                    ? (product.image_url || '/placeholder-product.jpg')
                    : (product.back_label_image_url || product.image_url || '/placeholder-product.jpg')
                  }
                  alt={product.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 90vw, (max-width: 1280px) 45vw, 520px"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder-product.jpg';
                  }}
                />
              </div>

              {/* Image Thumbnails */}
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedImage('main')}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === 'main'
                      ? 'border-apex-red'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={product.image_url || '/placeholder-product.jpg'}
                    alt="Main product"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-product.jpg';
                    }}
                  />
                </button>
                {product.back_label_image_url && (
                  <button
                    onClick={() => setSelectedImage('back')}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === 'back'
                        ? 'border-apex-red'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={product.back_label_image_url}
                      alt="Nutritional info"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder-product.jpg';
                      }}
                    />
                  </button>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Product Title */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-apex-gold text-apex-gold" />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">(24 reviews)</span>
                  </div>
                  <span className="text-sm text-gray-500">|</span>
                  <span className="text-sm text-gray-500">SKU: {product.id}</span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-gray-900">
                  R{product.price.toFixed(2)}
                </span>
                {product.featured && (
                  <span className="bg-apex-red text-white px-3 py-1 rounded-full text-sm font-medium">
                    Featured
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-900">Availability:</span>
                {product.stock > 0 ? (
                  <span className="text-green-600 font-medium">In Stock ({product.stock} available)</span>
                ) : (
                  <span className="text-red-600 font-medium">Out of Stock</span>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-900">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="px-4 py-3 text-gray-600 hover:text-gray-900 disabled:opacity-50 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-6 py-3 border-x border-gray-300 bg-gray-50 text-gray-900 font-semibold text-lg min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= product.stock}
                    className="px-4 py-3 text-gray-600 hover:text-gray-900 disabled:opacity-50 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 bg-apex-red hover:bg-red-600 text-white font-medium py-3 px-6 rounded-lg"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-apex-red text-apex-red hover:bg-apex-red hover:text-white"
                >
                  <Heart className="h-5 w-5 mr-2" />
                  Add to Wishlist
                </Button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-3">
                  <Truck className="h-6 w-6 text-apex-red" />
                  <div>
                    <p className="font-medium text-gray-900">Free Shipping</p>
                    <p className="text-sm text-gray-500">On orders over R500</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="h-6 w-6 text-apex-red" />
                  <div>
                    <p className="font-medium text-gray-900">Secure Payment</p>
                    <p className="text-sm text-gray-500">100% secure checkout</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <RotateCcw className="h-6 w-6 text-apex-red" />
                  <div>
                    <p className="font-medium text-gray-900">Easy Returns</p>
                    <p className="text-sm text-gray-500">30-day return policy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabbed Content */}
          <div className="border-t border-gray-200">
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'overview'
                    ? 'border-apex-red text-apex-red'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Info className="h-4 w-4" />
                <span>Overview</span>
              </button>
              {product.ingredients && product.ingredients.length > 0 && (
                <button
                  onClick={() => setActiveTab('ingredients')}
                  className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'ingredients'
                      ? 'border-apex-red text-apex-red'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Package className="h-4 w-4" />
                  <span>Ingredients</span>
                </button>
              )}
              {product.benefits && product.benefits.length > 0 && (
                <button
                  onClick={() => setActiveTab('benefits')}
                  className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'benefits'
                      ? 'border-apex-red text-apex-red'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Zap className="h-4 w-4" />
                  <span>Benefits</span>
                </button>
              )}
              {product.nutritional_info && (
                <button
                  onClick={() => setActiveTab('nutrition')}
                  className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'nutrition'
                      ? 'border-apex-red text-apex-red'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <FileText className="h-4 w-4" />
                  <span>Nutrition Facts</span>
                </button>
              )}
              {product.usage_instructions && (
                <button
                  onClick={() => setActiveTab('usage')}
                  className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'usage'
                      ? 'border-apex-red text-apex-red'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Usage</span>
                </button>
              )}
            </div>

            {/* Tab Content */}
            <div className="p-8 min-h-[500px]">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900">Product Description</h3>
                  <p className="text-gray-600 leading-relaxed">{product.description}</p>

                  {product.benefits && product.benefits.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-lg font-medium text-gray-900 mb-3">Key Benefits</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {product.benefits.slice(0, 4).map((benefit, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-gray-600">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Ingredients Tab */}
              {activeTab === 'ingredients' && product.ingredients && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900">Ingredients</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product.ingredients.map((ingredient, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-apex-red rounded-full"></div>
                        <span className="text-gray-700">{ingredient}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Benefits Tab */}
              {activeTab === 'benefits' && product.benefits && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900">Benefits</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start space-x-3 p-4 bg-gradient-to-r from-apex-red/5 to-red-500/5 rounded-lg border border-apex-red/10">
                        <Zap className="h-5 w-5 text-apex-red mt-0.5" />
                        <span className="text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Nutrition Facts Tab */}
              {activeTab === 'nutrition' && (
                <div className="space-y-6 min-h-[500px] pb-8">
                  <h3 className="text-xl font-semibold text-gray-900">Nutrition Facts</h3>
                  {product.nutritional_info ? (
                    <div className="bg-gray-50 rounded-lg p-8 shadow-sm">
                      <div className="border-b border-gray-200 pb-4 mb-6">
                        <h4 className="text-lg font-medium text-gray-900">Nutritional Information</h4>
                        <p className="text-sm text-gray-600">Per {product.nutritional_info.serving_size || 'serving'}</p>
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-700 font-medium">Calories</span>
                          <span className="font-semibold text-gray-900">{product.nutritional_info.calories}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-700 font-medium">Protein</span>
                          <span className="font-semibold text-gray-900">{product.nutritional_info.protein}g</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-700 font-medium">Carbohydrates</span>
                          <span className="font-semibold text-gray-900">{product.nutritional_info.carbs}g</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-700 font-medium">Fat</span>
                          <span className="font-semibold text-gray-900">{product.nutritional_info.fat}g</span>
                        </div>
                        {product.nutritional_info.fiber && product.nutritional_info.fiber > 0 && (
                          <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-gray-700 font-medium">Fiber</span>
                            <span className="font-semibold text-gray-900">{product.nutritional_info.fiber}g</span>
                          </div>
                        )}
                        {product.nutritional_info.sugar && product.nutritional_info.sugar > 0 && (
                          <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-gray-700 font-medium">Sugar</span>
                            <span className="font-semibold text-gray-900">{product.nutritional_info.sugar}g</span>
                          </div>
                        )}
                        {product.nutritional_info.sodium && product.nutritional_info.sodium > 0 && (
                          <div className="flex justify-between items-center py-2">
                            <span className="text-gray-700 font-medium">Sodium</span>
                            <span className="font-semibold text-gray-900">{product.nutritional_info.sodium}mg</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-8 shadow-sm">
                      <div className="text-center py-8">
                        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h4 className="text-lg font-medium text-gray-900 mb-2">No Nutritional Information Available</h4>
                        <p className="text-gray-600">Nutritional information for this product has not been added yet.</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Usage Tab */}
              {activeTab === 'usage' && product.usage_instructions && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900">Usage Instructions</h3>
                  <div className="bg-gradient-to-r from-apex-red/5 to-red-500/5 rounded-lg p-6 border border-apex-red/10">
                    <div className="prose prose-gray max-w-none">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {product.usage_instructions}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;