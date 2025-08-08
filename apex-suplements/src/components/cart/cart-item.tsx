"use client";

import React from 'react';
import Image from 'next/image';
import { Minus, Plus, X } from 'lucide-react';
import { useCart, CartItem as CartItemType } from '@/contexts/cart-context';
import { formatZAR } from '@/lib/firebase-queries';

interface CartItemProps {
  item: CartItemType;
  showRemove?: boolean;
  compact?: boolean;
}

export const CartItem: React.FC<CartItemProps> = ({
  item,
  showRemove = true,
  compact = false
}) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (newQuantity: number) => {
    updateQuantity(item.id, newQuantity);
  };

  const handleRemove = () => {
    removeFromCart(item.id);
  };

  const primaryImage = Array.isArray(item.product.images) && item.product.images[0] && typeof item.product.images[0] === 'string'
    ? item.product.images[0]
    : '/placeholder-product.jpg';

  return (
    <div className={`flex items-center space-x-4 p-4 bg-white rounded-lg border border-gray-200 ${compact ? 'py-3' : ''}`}>
      {/* Product Image */}
      <div className="relative flex-shrink-0">
        <div className={`relative overflow-hidden rounded-lg bg-gray-50 ${compact ? 'w-16 h-16' : 'w-20 h-20'}`}>
          <Image
            src={primaryImage}
            alt={item.product.name || 'Product image'}
            fill
            className="object-cover"
            sizes="80px"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-product.jpg';
            }}
          />
        </div>
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className={`font-semibold text-gray-900 truncate ${compact ? 'text-sm' : 'text-base'}`}>
              {item.product.name}
            </h3>
            {item.product.brand && (
              <p className={`text-gray-500 ${compact ? 'text-xs' : 'text-sm'}`}>
                by {item.product.brand}
              </p>
            )}

            {/* Selected Options */}
            {item.selected_options && (
              <div className="mt-1 space-y-1">
                {item.selected_options.flavor && (
                  <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                    Flavor: {item.selected_options.flavor}
                  </span>
                )}
                {item.selected_options.size && (
                  <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs ml-1">
                    Size: {item.selected_options.size}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Price */}
          <div className="text-right ml-4">
            <p className={`font-semibold text-gray-900 ${compact ? 'text-sm' : 'text-base'}`}>
              {formatZAR(item.product.price * item.quantity)}
            </p>
            {item.quantity > 1 && (
              <p className="text-gray-500 text-xs">
                {formatZAR(item.product.price)} each
              </p>
            )}
          </div>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={item.quantity <= 1}
            >
              <Minus className="h-4 w-4 text-gray-600" />
            </button>

            <span className={`font-medium text-gray-900 ${compact ? 'text-sm' : 'text-base'} min-w-[2rem] text-center`}>
              {item.quantity}
            </span>

            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Plus className="h-4 w-4 text-gray-600" />
            </button>
          </div>

          {/* Remove Button */}
          {showRemove && (
            <button
              onClick={handleRemove}
              className="text-red-500 hover:text-red-700 transition-colors p-1"
              title="Remove item"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};