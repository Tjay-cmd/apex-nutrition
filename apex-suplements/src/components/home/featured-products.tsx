"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Star, Eye, Heart, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatZAR } from '@/lib/firebase-queries';
import { useCart } from '@/contexts/cart-context';
import type { Product as CartProduct } from '@/types';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  status: 'active' | 'inactive';
  featured: boolean;
  stock: number;
  image_url?: string;
  created_at: string;
}

interface FeaturedProductsProps {
  products: Product[];
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ products }) => {
  const { addToCart } = useCart();
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  const handleQuickAdd = (product: Product) => {
    // Create a compatible product object for the cart
    const cartProduct = {
      id: product.id,
      name: product.name,
      slug: product.name.toLowerCase().replace(/\s+/g, '-'),
      description: product.description,
      price: product.price,
      sku: product.id,
      stock_quantity: product.stock,
      stock_status: product.stock > 0 ? 'in_stock' : 'out_of_stock',
      category_id: product.category,
      images: product.image_url ? [{ id: '1', url: product.image_url, alt_text: product.name, is_primary: true, sort_order: 1 }] : [],
      featured: product.featured,
      created_at: product.created_at,
      updated_at: product.created_at
    } as CartProduct;
    addToCart(cartProduct, 1);
  };

  const featuredProducts = products.filter(p => p.featured).slice(0, 6);

  // Get category color based on category name
  const getCategoryColor = (category: string) => {
    const categoryLower = category.toLowerCase();
    if (categoryLower.includes('protein')) return 'from-apex-red to-red-600';
    if (categoryLower.includes('pre-workout') || categoryLower.includes('preworkout')) return 'from-apex-gold to-yellow-500';
    if (categoryLower.includes('recovery')) return 'from-gray-500 to-gray-700';
    if (categoryLower.includes('vitamin')) return 'from-orange-500 to-orange-600';
    return 'from-apex-red to-red-600'; // default
  };

  return (
    <section id="featured-products" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-apex-red to-red-600 w-12 h-1 rounded-full mr-4"></div>
            <TrendingUp className="h-6 w-6 text-apex-red" />
            <div className="bg-gradient-to-r from-apex-red to-red-600 w-12 h-1 rounded-full ml-4"></div>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Featured Products
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our premium selection of supplements trusted by athletes worldwide
          </p>
        </div>

        {/* Enhanced Featured Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              className="group relative rounded-2xl border border-gray-200/60 overflow-hidden hover:shadow-2xl hover:shadow-gray-500/20 hover:-translate-y-3 transition-all duration-500"
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              {/* Top gradient header strip */}
              <div className="h-2 w-full apex-gradient-card" />
              {/* Enhanced Product Image Container */}
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-white to-gray-50">
                <Image
                  src={product.image_url || '/placeholder-product.jpg'}
                  alt={product.name}
                  fill
                  className="object-contain p-4 group-hover:scale-110 transition-transform duration-700 ease-out"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* Enhanced Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Enhanced Action Buttons */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                  <Button
                    size="sm"
                    onClick={() => handleQuickAdd(product)}
                    className="bg-apex-red hover:bg-red-700 text-white rounded-full w-10 h-10 p-0 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-white/90 hover:bg-white text-gray-700 rounded-full w-10 h-10 p-0 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>

                {/* Enhanced Featured Badge with new gradient */}
                {product.featured && (
                  <div className="absolute top-4 left-4">
                    <div className="apex-gradient-card text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
                      <Star className="h-3 w-3" />
                      Featured
                    </div>
                  </div>
                )}

                {/* Category Badge */}
                <div className="absolute bottom-4 left-4">
                  <div className={`bg-gradient-to-r ${getCategoryColor(product.category)} text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg`}>
                    {product.category}
                  </div>
                </div>
              </div>

              {/* Enhanced Product Info */}
              <div className="p-6 bg-white/90">
                <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-apex-red transition-colors duration-300 line-clamp-2">
                  {product.name}
                </h4>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-apex-red">
                    {formatZAR(product.price)}
                  </span>
                  <span className={`text-sm px-3 py-1 rounded-full font-medium ${
                    product.stock > 0
                      ? 'bg-green-100 text-green-800 border border-green-200'
                      : 'bg-red-100 text-red-800 border border-red-200'
                  }`}>
                    {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>

                {/* Enhanced CTA Button */}
                <Button
                  onClick={() => handleQuickAdd(product)}
                  disabled={product.stock <= 0}
                  className="relative overflow-hidden w-full bg-apex-red hover:bg-[#c5153f] text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-apex-red/30"
                >
                  {/* Shine overlay */}
                  <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-[-12deg] animate-shine" />
                  <span className="relative z-10 inline-flex items-center justify-center">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                  </span>
                </Button>
              </div>

              {/* Hover Effect Border */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-apex-red/20 transition-all duration-300 pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Enhanced View All Products CTA */}
        <div className="text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200/50">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Explore Our Full Collection
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Discover our complete range of premium supplements designed to support your fitness journey and performance goals.
            </p>
            <Button
              asChild
              className="bg-gradient-to-r from-apex-red to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-4 px-8 rounded-xl text-lg shadow-xl hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105"
            >
              <Link href="/shop">
                View All Products
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;