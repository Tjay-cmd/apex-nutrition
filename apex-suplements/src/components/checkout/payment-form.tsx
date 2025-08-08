"use client";

import React from 'react';
import { CreditCard, Building, Lock, Shield } from 'lucide-react';
import { useCheckout, PaymentMethod } from '@/contexts/checkout-context';

export const PaymentForm: React.FC = () => {
  const {
    paymentMethod,
    updatePaymentMethod,
    errors,
  } = useCheckout();

  const paymentErrors = errors.payment;

  const handlePaymentTypeChange = (type: PaymentMethod['type']) => {
    updatePaymentMethod({ type });
  };

  const handlePaymentFieldChange = (field: keyof PaymentMethod, value: string) => {
    updatePaymentMethod({ [field]: value });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900">Payment Method</h3>
        <p className="text-gray-600 mt-1">Choose your preferred payment method</p>
      </div>

      {/* Payment Method Selection */}
      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => handlePaymentTypeChange('card')}
            className={`p-4 border-2 rounded-xl transition-all duration-200 ${
              paymentMethod.type === 'card'
                ? 'border-apex-red bg-apex-red/5'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-3">
              <CreditCard className="h-6 w-6 text-apex-red" />
              <div className="text-left">
                <div className="font-medium text-gray-900">Credit Card</div>
                <div className="text-sm text-gray-500">Visa, Mastercard, Amex</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => handlePaymentTypeChange('paypal')}
            className={`p-4 border-2 rounded-xl transition-all duration-200 ${
              paymentMethod.type === 'paypal'
                ? 'border-apex-red bg-apex-red/5'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-3">
                              <CreditCard className="h-6 w-6 text-blue-600" />
              <div className="text-left">
                <div className="font-medium text-gray-900">PayPal</div>
                <div className="text-sm text-gray-500">Fast & secure</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => handlePaymentTypeChange('eft')}
            className={`p-4 border-2 rounded-xl transition-all duration-200 ${
              paymentMethod.type === 'eft'
                ? 'border-apex-red bg-apex-red/5'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Building className="h-6 w-6 text-green-600" />
              <div className="text-left">
                <div className="font-medium text-gray-900">EFT</div>
                <div className="text-sm text-gray-500">Bank transfer</div>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Payment Form Fields */}
      {paymentMethod.type === 'card' && (
        <div className="space-y-6">
          <div>
            <label htmlFor="card-holder" className="block text-sm font-medium text-gray-700 mb-2">
              Card Holder Name
            </label>
            <input
              id="card-holder"
              type="text"
              value={paymentMethod.card_holder || ''}
              onChange={(e) => handlePaymentFieldChange('card_holder', e.target.value)}
              className={`block w-full px-3 py-3 border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-apex-red focus:border-transparent transition-colors ${
                paymentErrors?.card_holder ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Name on card"
            />
            {paymentErrors?.card_holder && (
              <p className="mt-1 text-sm text-red-600">{paymentErrors.card_holder}</p>
            )}
          </div>

          <div>
            <label htmlFor="card-number" className="block text-sm font-medium text-gray-700 mb-2">
              Card Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CreditCard className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="card-number"
                type="text"
                value={paymentMethod.card_number || ''}
                onChange={(e) => handlePaymentFieldChange('card_number', e.target.value)}
                className={`block w-full pl-10 pr-3 py-3 border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-apex-red focus:border-transparent transition-colors ${
                  paymentErrors?.card_number ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
              />
            </div>
            {paymentErrors?.card_number && (
              <p className="mt-1 text-sm text-red-600">{paymentErrors.card_number}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="card-expiry" className="block text-sm font-medium text-gray-700 mb-2">
                Expiry Date
              </label>
              <input
                id="card-expiry"
                type="text"
                value={paymentMethod.card_expiry || ''}
                onChange={(e) => handlePaymentFieldChange('card_expiry', e.target.value)}
                className={`block w-full px-3 py-3 border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-apex-red focus:border-transparent transition-colors ${
                  paymentErrors?.card_expiry ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="MM/YY"
                maxLength={5}
              />
              {paymentErrors?.card_expiry && (
                <p className="mt-1 text-sm text-red-600">{paymentErrors.card_expiry}</p>
              )}
            </div>

            <div>
              <label htmlFor="card-cvc" className="block text-sm font-medium text-gray-700 mb-2">
                CVC
              </label>
              <input
                id="card-cvc"
                type="text"
                value={paymentMethod.card_cvc || ''}
                onChange={(e) => handlePaymentFieldChange('card_cvc', e.target.value)}
                className={`block w-full px-3 py-3 border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-apex-red focus:border-transparent transition-colors ${
                  paymentErrors?.card_cvc ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="123"
                maxLength={4}
              />
              {paymentErrors?.card_cvc && (
                <p className="mt-1 text-sm text-red-600">{paymentErrors.card_cvc}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {paymentMethod.type === 'paypal' && (
        <div>
          <label htmlFor="paypal-email" className="block text-sm font-medium text-gray-700 mb-2">
            PayPal Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <CreditCard className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="paypal-email"
              type="email"
              value={paymentMethod.paypal_email || ''}
              onChange={(e) => handlePaymentFieldChange('paypal_email', e.target.value)}
              className={`block w-full pl-10 pr-3 py-3 border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-apex-red focus:border-transparent transition-colors ${
                paymentErrors?.paypal_email ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="your-email@example.com"
            />
          </div>
          {paymentErrors?.paypal_email && (
            <p className="mt-1 text-sm text-red-600">{paymentErrors.paypal_email}</p>
          )}
        </div>
      )}

      {paymentMethod.type === 'eft' && (
        <div>
          <label htmlFor="bank-account" className="block text-sm font-medium text-gray-700 mb-2">
            Bank Account Number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Building className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="bank-account"
              type="text"
              value={paymentMethod.bank_account || ''}
              onChange={(e) => handlePaymentFieldChange('bank_account', e.target.value)}
              className={`block w-full pl-10 pr-3 py-3 border rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-apex-red focus:border-transparent transition-colors ${
                paymentErrors?.bank_account ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Account number"
            />
          </div>
          {paymentErrors?.bank_account && (
            <p className="mt-1 text-sm text-red-600">{paymentErrors.bank_account}</p>
          )}
        </div>
      )}

      {/* Security Notice */}
      <div className="mt-6 p-4 bg-gray-50 rounded-xl">
        <div className="flex items-start space-x-3">
          <Shield className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-gray-900">Secure Payment</h4>
            <p className="text-sm text-gray-600 mt-1">
              Your payment information is encrypted and secure. We never store your full card details.
            </p>
          </div>
        </div>
      </div>

      {/* Payment Icons */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-center space-x-4">
          <div className="flex items-center space-x-2 text-gray-400">
            <Lock className="h-4 w-4" />
            <span className="text-sm">SSL Encrypted</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-400">
            <Shield className="h-4 w-4" />
            <span className="text-sm">PCI Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;