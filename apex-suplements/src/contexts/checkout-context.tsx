"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/firebase-auth-context';
import { useCart } from '@/contexts/cart-context';
import { createOrder, createOrderItem, formatZAR } from '@/lib/firebase-queries';
import type { CartItem } from '@/contexts/cart-context';

export interface ShippingAddress {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface BillingAddress {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface PaymentMethod {
  type: 'card' | 'paypal' | 'eft';
  card_number?: string;
  card_expiry?: string;
  card_cvc?: string;
  card_holder?: string;
  paypal_email?: string;
  bank_account?: string;
}

export interface OrderSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  items: CartItem[];
}

export interface CheckoutFormErrors {
  shipping?: Partial<ShippingAddress>;
  billing?: Partial<BillingAddress>;
  payment?: Partial<PaymentMethod>;
  general?: string;
}

interface CheckoutContextType {
  // Form Data
  shippingAddress: ShippingAddress;
  billingAddress: BillingAddress;
  paymentMethod: PaymentMethod;
  useSameAddress: boolean;

  // Order Summary
  orderSummary: OrderSummary;

  // State
  currentStep: number;
  isLoading: boolean;
  errors: CheckoutFormErrors;

  // Actions
  updateShippingAddress: (address: Partial<ShippingAddress>) => void;
  updateBillingAddress: (address: Partial<BillingAddress>) => void;
  updatePaymentMethod: (method: Partial<PaymentMethod>) => void;
  updateUseSameAddress: (useSame: boolean) => void;
  setCurrentStep: (step: number) => void;
  validateCurrentStep: () => boolean;
  processOrder: () => Promise<{ success: boolean; orderId?: string; error?: string }>;
  clearErrors: () => void;
  loadUserAddresses: () => Promise<void>;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export const useCheckout = () => {
  const context = useContext(CheckoutContext);
  if (context === undefined) {
    throw new Error('useCheckout must be used within a CheckoutProvider');
  }
  return context;
};

interface CheckoutProviderProps {
  children: React.ReactNode;
}

// Calculate tax based on subtotal (15% VAT for South Africa)
const calculateTax = (subtotal: number): number => {
  return subtotal * 0.15; // 15% VAT
};

// Format currency in ZAR
const formatZAR = (amount: number): string => {
  return `R${amount.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const CheckoutProvider: React.FC<CheckoutProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const { items, subtotal, shipping, total } = useCart();

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'South Africa',
  });

  const [billingAddress, setBillingAddress] = useState<BillingAddress>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'South Africa',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>({
    type: 'card',
  });

  const [useSameAddress, setUseSameAddress] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<CheckoutFormErrors>({});

  // Calculate order summary
  const tax = calculateTax(subtotal);
  const orderTotal = subtotal + shipping + tax;

  const orderSummary: OrderSummary = {
    subtotal,
    shipping,
    tax,
    total: orderTotal,
    items,
  };

  // Load user addresses on mount
  useEffect(() => {
    if (user) {
      loadUserAddresses();
    }
  }, [user]);

  // Update billing address when useSameAddress changes
  useEffect(() => {
    if (useSameAddress) {
      setBillingAddress(shippingAddress);
    }
  }, [useSameAddress, shippingAddress]);

  const updateShippingAddress = (address: Partial<ShippingAddress>) => {
    setShippingAddress(prev => ({ ...prev, ...address }));
    if (useSameAddress) {
      setBillingAddress(prev => ({ ...prev, ...address }));
    }
    clearErrors();
  };

  const updateBillingAddress = (address: Partial<BillingAddress>) => {
    setBillingAddress(prev => ({ ...prev, ...address }));
    clearErrors();
  };

  const updatePaymentMethod = (method: Partial<PaymentMethod>) => {
    setPaymentMethod(prev => ({ ...prev, ...method }));
    clearErrors();
  };

  const updateUseSameAddress = (useSame: boolean) => {
    setUseSameAddress(useSame);
    if (useSame) {
      setBillingAddress(shippingAddress);
    }
  };

  const clearErrors = () => {
    setErrors({});
  };

  const validateEmail = (email: string): string | undefined => {
    if (!email) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return undefined;
  };

  const validatePhone = (phone: string): string | undefined => {
    if (!phone) return 'Phone number is required';
    if (phone.length < 10) return 'Please enter a valid phone number';
    return undefined;
  };

  const validateRequired = (value: string, fieldName: string): string | undefined => {
    if (!value.trim()) return `${fieldName} is required`;
    return undefined;
  };

  const validateShippingAddress = (): Partial<ShippingAddress> => {
    const errors: Partial<ShippingAddress> = {};

    errors.first_name = validateRequired(shippingAddress.first_name, 'First name');
    errors.last_name = validateRequired(shippingAddress.last_name, 'Last name');
    errors.email = validateEmail(shippingAddress.email);
    errors.phone = validatePhone(shippingAddress.phone);
    errors.address_line_1 = validateRequired(shippingAddress.address_line_1, 'Address');
    errors.city = validateRequired(shippingAddress.city, 'City');
    errors.state = validateRequired(shippingAddress.state, 'Province');
    errors.postal_code = validateRequired(shippingAddress.postal_code, 'Postal code');

    return Object.fromEntries(Object.entries(errors).filter(([_, value]) => value !== undefined));
  };

  const validateBillingAddress = (): Partial<BillingAddress> => {
    if (useSameAddress) return {};

    const errors: Partial<BillingAddress> = {};

    errors.first_name = validateRequired(billingAddress.first_name, 'First name');
    errors.last_name = validateRequired(billingAddress.last_name, 'Last name');
    errors.email = validateEmail(billingAddress.email);
    errors.phone = validatePhone(billingAddress.phone);
    errors.address_line_1 = validateRequired(billingAddress.address_line_1, 'Address');
    errors.city = validateRequired(billingAddress.city, 'City');
    errors.state = validateRequired(billingAddress.state, 'Province');
    errors.postal_code = validateRequired(billingAddress.postal_code, 'Postal code');

    return Object.fromEntries(Object.entries(errors).filter(([_, value]) => value !== undefined));
  };

  const validatePaymentMethod = (): Partial<PaymentMethod> => {
    const errors: Partial<PaymentMethod> = {};

    if (paymentMethod.type === 'card') {
      if (!paymentMethod.card_number) errors.card_number = 'Card number is required';
      if (!paymentMethod.card_expiry) errors.card_expiry = 'Expiry date is required';
      if (!paymentMethod.card_cvc) errors.card_cvc = 'CVC is required';
      if (!paymentMethod.card_holder) errors.card_holder = 'Card holder name is required';
    } else if (paymentMethod.type === 'paypal') {
      if (!paymentMethod.paypal_email) errors.paypal_email = 'PayPal email is required';
    } else if (paymentMethod.type === 'eft') {
      if (!paymentMethod.bank_account) errors.bank_account = 'Bank account is required';
    }

    return errors;
  };

  const validateCurrentStep = (): boolean => {
    let stepErrors: CheckoutFormErrors = {};

    switch (currentStep) {
      case 1: // Shipping
        const shippingErrors = validateShippingAddress();
        if (Object.keys(shippingErrors).length > 0) {
          stepErrors.shipping = shippingErrors;
        }
        break;

      case 2: // Billing
        const billingErrors = validateBillingAddress();
        if (Object.keys(billingErrors).length > 0) {
          stepErrors.billing = billingErrors;
        }
        break;

      case 3: // Payment
        const paymentErrors = validatePaymentMethod();
        if (Object.keys(paymentErrors).length > 0) {
          stepErrors.payment = paymentErrors;
        }
        break;
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const loadUserAddresses = async () => {
    if (!user) return;

    try {
      // Get user profile from Firebase
      const { getUserProfile } = await import('@/lib/firebase-queries');
      const profile = await getUserProfile(user.id);

      if (profile) {
        const userAddress: ShippingAddress = {
          first_name: profile.first_name || '',
          last_name: profile.last_name || '',
          email: user.email || '',
          phone: profile.phone || '',
          address_line_1: profile.address_line_1 || '',
          address_line_2: profile.address_line_2 || '',
          city: profile.city || '',
          state: profile.state || '',
          postal_code: profile.postal_code || '',
          country: profile.country || 'South Africa',
        };

        setShippingAddress(userAddress);
        setBillingAddress(userAddress);
      }
    } catch (error) {
      console.error('Error loading user addresses:', error);
    }
  };

  const processOrder = async (): Promise<{ success: boolean; orderId?: string; error?: string }> => {
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    if (items.length === 0) {
      return { success: false, error: 'Cart is empty' };
    }

    if (!validateCurrentStep()) {
      return { success: false, error: 'Please fix form errors' };
    }

    setIsLoading(true);

    try {
      // Create order in Firebase
      const orderData = {
        user_id: user.id,
        status: 'pending',
        subtotal,
        shipping,
        tax,
        total: orderTotal,
        shipping_address: shippingAddress,
        billing_address: useSameAddress ? shippingAddress : billingAddress,
        payment_method: paymentMethod,
      };

      const orderResult = await createOrder(orderData);
      if (!orderResult.success) {
        throw new Error('Failed to create order');
      }

      // Create order items
      const orderItems = items.map(item => ({
        order_id: orderResult.orderId,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.product.price,
        selected_options: item.selected_options,
      }));

      for (const item of orderItems) {
        const itemResult = await createOrderItem(item);
        if (!itemResult.success) {
          throw new Error('Failed to create order item');
        }
      }

      return { success: true, orderId: orderResult.orderId };
    } catch (error) {
      console.error('Error processing order:', error);
      return { success: false, error: 'Failed to process order' };
    } finally {
      setIsLoading(false);
    }
  };

  const value: CheckoutContextType = {
    shippingAddress,
    billingAddress,
    paymentMethod,
    useSameAddress,
    orderSummary,
    currentStep,
    isLoading,
    errors,
    updateShippingAddress,
    updateBillingAddress,
    updatePaymentMethod,
    updateUseSameAddress,
    setCurrentStep,
    validateCurrentStep,
    processOrder,
    clearErrors,
    loadUserAddresses,
  };

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  );
};