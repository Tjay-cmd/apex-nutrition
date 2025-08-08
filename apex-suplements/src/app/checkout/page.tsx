"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Check, Truck, CreditCard, User, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddressForm } from '@/components/checkout/address-form';
import PaymentForm from '@/components/checkout/payment-form';
import { CartItem } from '@/components/cart/cart-item';
import { useCheckout } from '@/contexts/checkout-context';
import { useCart } from '@/contexts/cart-context';
import { useAuth } from '@/contexts/firebase-auth-context';
import { formatZAR } from '@/lib/firebase-queries';

const CheckoutPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { items, clearCart } = useCart();
  const {
    currentStep,
    setCurrentStep,
    validateCurrentStep,
    processOrder,
    orderSummary,
    useSameAddress,
    updateUseSameAddress,
    isLoading,
    errors,
  } = useCheckout();

  // Redirect if no items in cart
  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart');
    }
  }, [items, router]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      router.push('/auth/login?redirect=/checkout');
    }
  }, [user, router]);

  const steps = [
    { id: 1, title: 'Shipping', icon: Truck },
    { id: 2, title: 'Billing', icon: User },
    { id: 3, title: 'Payment', icon: CreditCard },
  ];

  const handleNextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handlePlaceOrder = async () => {
    const result = await processOrder();
    if (result.success) {
      clearCart();
      router.push(`/order-confirmation/${result.orderId}`);
    } else {
      // Handle error - could show a toast notification
      console.error('Order failed:', result.error);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-apex-red mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting to cart...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-apex-red mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/cart')}
            className="inline-flex items-center text-apex-red hover:text-red-600 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cart
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                    isActive
                      ? 'border-apex-red bg-apex-red text-white'
                      : isCompleted
                      ? 'border-green-500 bg-green-500 text-white'
                      : 'border-gray-300 bg-white text-gray-500'
                  }`}>
                    {isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm font-medium ${
                      isActive ? 'text-apex-red' : isCompleted ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-4 ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Shipping Address */}
            {currentStep === 1 && (
              <AddressForm
                type="shipping"
                title="Shipping Address"
                description="Where should we deliver your order?"
              />
            )}

            {/* Step 2: Billing Address */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <AddressForm
                  type="billing"
                  title="Billing Address"
                  description="Where should we send your invoice?"
                />

                {/* Same Address Toggle */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="same-address"
                      checked={useSameAddress}
                      onChange={(e) => updateUseSameAddress(e.target.checked)}
                      className="h-4 w-4 text-apex-red focus:ring-apex-red border-gray-300 rounded"
                    />
                    <label htmlFor="same-address" className="text-sm font-medium text-gray-900">
                      Use same address for billing
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Payment Method */}
            {currentStep === 3 && (
              <PaymentForm />
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                onClick={handlePreviousStep}
                variant="outline"
                disabled={currentStep === 1}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Previous</span>
              </Button>

              {currentStep < 3 ? (
                <Button
                  onClick={handleNextStep}
                  className="bg-apex-red hover:bg-red-600 flex items-center space-x-2"
                >
                  <span>Continue</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handlePlaceOrder}
                  disabled={isLoading}
                  className="bg-apex-red hover:bg-red-600 flex items-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Shield className="h-4 w-4" />
                      <span>Place Order</span>
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>

                {/* Cart Items */}
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <CartItem key={item.id} item={item} compact showRemove={false} />
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatZAR(orderSummary.subtotal)}</span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span className="flex items-center">
                      <Truck className="h-4 w-4 mr-1" />
                      Shipping
                    </span>
                    <span className={orderSummary.shipping === 0 ? 'text-green-600 font-medium' : ''}>
                      {orderSummary.shipping === 0 ? 'FREE' : formatZAR(orderSummary.shipping)}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Tax (15% VAT)</span>
                    <span>{formatZAR(orderSummary.tax)}</span>
                  </div>

                  {orderSummary.shipping > 0 && orderSummary.subtotal < 500 && (
                    <div className="text-sm text-gray-500 bg-blue-50 p-3 rounded-lg">
                      <p>Add {formatZAR(500 - orderSummary.subtotal)} more for FREE shipping!</p>
                    </div>
                  )}

                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between font-bold text-lg text-gray-900">
                      <span>Total</span>
                      <span>{formatZAR(orderSummary.total)}</span>
                    </div>
                  </div>
                </div>

                {/* Trust Signals */}
                <div className="border-t border-gray-200 pt-6">
                  <div className="grid grid-cols-1 gap-3 text-xs text-gray-500">
                    <div className="flex items-center">
                      <Shield className="h-3 w-3 mr-2 text-apex-red" />
                      <span>Secure checkout</span>
                    </div>
                    <div className="flex items-center">
                      <Truck className="h-3 w-3 mr-2 text-apex-red" />
                      <span>Free shipping on orders over R500</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="h-3 w-3 mr-2 text-apex-red" />
                      <span>30-day returns</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;