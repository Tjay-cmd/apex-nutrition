"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart, Star, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatZAR } from '@/lib/firebase-queries';
import { useCart } from '@/contexts/cart-context';
import type { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
  onAddToWishlist?: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToWishlist
}) => {
  const { addToCart } = useCart();

  // Use image_url from Firebase product
  const primaryImage = product.image_url || '/placeholder-product.jpg';

  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  return (
    <div className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      {/* Featured Badge */}
      {product.featured && (
        <div className="absolute top-4 left-4 z-10">
          <div className="bg-gradient-to-r from-apex-red to-red-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
            <Zap className="h-3 w-3" />
            <span>FEATURED</span>
          </div>
        </div>
      )}

      {/* Wishlist Button */}
      <button
        onClick={() => onAddToWishlist?.(product.id)}
        className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:text-apex-red"
      >
        <Heart className="h-4 w-4" />
      </button>

      <Link href={`/products/${product.id}`} className="block">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-product.jpg';
            }}
          />

          {/* Quick View Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="text-white text-sm font-medium">Quick View</div>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-3">
          {/* Category */}
          {product.category && (
            <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">
              {product.category}
            </div>
          )}

          {/* Product Name */}
          <h3 className="font-bold text-gray-900 group-hover:text-apex-red transition-colors line-clamp-2">
            {product.name}
          </h3>

          {/* Description */}
          {product.description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {product.description}
            </p>
          )}

          {/* Rating Stars (placeholder) */}
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-apex-gold text-apex-gold" />
            ))}
            <span className="text-sm text-gray-600 ml-2">(24 reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold text-gray-900">
                  {formatZAR(product.price)}
                </span>

              </div>

              {/* Stock */}
              <div className="text-xs text-gray-500">
                Stock: {product.stock}
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* Add to Cart Button */}
      <div className="p-4 pt-0">
        <Button
          onClick={handleAddToCart}
          className="w-full bg-apex-red hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </div>

      {/* Stock Status */}
      <div className="px-4 pb-4">
        {product.stock === 0 ? (
          <div className="text-center text-sm text-red-600 font-medium">
            Out of Stock
          </div>
        ) : product.stock < 10 ? (
          <div className="text-center text-sm text-orange-600 font-medium">
            Only {product.stock} left!
          </div>
        ) : (
          <div className="text-center text-sm text-green-600 font-medium">
            In Stock
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;