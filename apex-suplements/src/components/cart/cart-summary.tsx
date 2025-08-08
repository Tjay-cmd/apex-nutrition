"use client";

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Truck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/cart-context';
import { formatZAR } from '@/lib/firebase-queries';

interface CartSummaryProps {
  showCheckoutButton?: boolean;
  compact?: boolean;
  className?: string;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  showCheckoutButton = true,
  compact = false,
  className = ''
}) => {
  const { items, subtotal, shipping, total, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <div className={`bg-white rounded-2xl shadow-lg p-6 ${className}`}>
        <div className="text-center py-8">
          <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
          <p className="text-gray-600 mb-6">Add some products to get started!</p>
          <Link href="/shop">
            <Button className="bg-apex-red hover:bg-red-600">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl shadow-lg p-6 ${className}`}>
      <h3 className={`font-bold text-gray-900 mb-4 ${compact ? 'text-lg' : 'text-xl'}`}>
        Order Summary
      </h3>

      {/* Items Count */}
      <div className="mb-4">
        <p className="text-gray-600">
          {totalItems} {totalItems === 1 ? 'item' : 'items'}
        </p>
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>{formatZAR(subtotal)}</span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span className="flex items-center">
            <Truck className="h-4 w-4 mr-1" />
            Shipping
          </span>
          <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
            {shipping === 0 ? 'FREE' : formatZAR(shipping)}
          </span>
        </div>

        {shipping > 0 && subtotal < 500 && (
          <div className="text-sm text-gray-500 bg-blue-50 p-3 rounded-lg">
            <p>Add {formatZAR(500 - subtotal)} more for FREE shipping!</p>
          </div>
        )}

        <div className="border-t border-gray-200 pt-3">
          <div className="flex justify-between font-bold text-lg text-gray-900">
            <span>Total</span>
            <span>{formatZAR(total)}</span>
          </div>
        </div>
      </div>

      {/* Checkout Button */}
      {showCheckoutButton && (
        <div className="space-y-3">
          <Link href="/cart" className="block">
            <Button className="w-full bg-apex-red hover:bg-red-600 text-white font-medium py-3 px-4 rounded-xl text-lg flex items-center justify-center space-x-2">
              <ShoppingBag className="h-5 w-5" />
              <span>View Cart</span>
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>

          <Link href="/checkout" className="block">
            <Button
              variant="outline"
              className="w-full border-apex-red text-apex-red hover:bg-apex-red hover:text-white font-medium py-3 px-4 rounded-xl"
            >
              Proceed to Checkout
            </Button>
          </Link>
        </div>
      )}

      {/* Trust Signals */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-1 gap-2 text-xs text-gray-500">
          <div className="flex items-center">
            <Truck className="h-3 w-3 mr-2 text-apex-red" />
            <span>Free shipping on orders over R500</span>
          </div>
          <div className="flex items-center">
            <ShoppingBag className="h-3 w-3 mr-2 text-apex-red" />
            <span>30-day returns</span>
          </div>
        </div>
      </div>
    </div>
  );
};