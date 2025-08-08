"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Trash2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CartItem } from '@/components/cart/cart-item';
import { CartSummary } from '@/components/cart/cart-summary';
import { useCart } from '@/contexts/cart-context';

export default function CartPage() {
  const { items, clearCart, isLoading } = useCart();

  const handleClearCart = () => {
    if (confirm('Are you sure you want to clear your cart?')) {
      clearCart();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-apex-red mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/shop" className="inline-flex items-center text-apex-red hover:text-red-600 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        </div>

        {items.length === 0 ? (
          /* Empty Cart */
          <div className="text-center py-16">
            <ShoppingBag className="h-24 w-24 text-gray-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any products to your cart yet.
              Start shopping to discover our premium supplements!
            </p>
            <div className="space-y-4">
              <Link href="/shop">
                <Button className="bg-apex-red hover:bg-red-600 text-white font-medium py-3 px-8 rounded-xl text-lg">
                  Start Shopping
                </Button>
              </Link>
              <div className="text-sm text-gray-500">
                <p>Free shipping on orders over R500</p>
                <p>30-day returns • Secure checkout</p>
              </div>
            </div>
          </div>
        ) : (
          /* Cart with Items */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
                  </h2>
                  <button
                    onClick={handleClearCart}
                    className="text-red-500 hover:text-red-700 transition-colors flex items-center space-x-1"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="text-sm">Clear Cart</span>
                  </button>
                </div>

                {/* Cart Items List */}
                <div className="space-y-4">
                  {items.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </div>

                {/* Cart Actions */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/shop" className="flex-1">
                      <Button
                        variant="outline"
                        className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        Continue Shopping
                      </Button>
                    </Link>
                    <Link href="/checkout" className="flex-1">
                      <Button className="w-full bg-apex-red hover:bg-red-600 text-white font-medium py-3 px-6 rounded-xl">
                        Proceed to Checkout
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Trust Signals */}
              <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Why Shop with Apex?</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-apex-red/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <ShoppingBag className="h-6 w-6 text-apex-red" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">Premium Quality</h4>
                    <p className="text-sm text-gray-600">Third-party tested supplements</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-apex-red/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <ShoppingBag className="h-6 w-6 text-apex-red" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">Free Shipping</h4>
                    <p className="text-sm text-gray-600">On orders over R500</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-apex-red/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <ShoppingBag className="h-6 w-6 text-apex-red" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">30-Day Returns</h4>
                    <p className="text-sm text-gray-600">Hassle-free returns</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cart Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <CartSummary showCheckoutButton={false} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}