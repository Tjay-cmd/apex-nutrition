"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CheckCircle, Truck, Package, Mail, Phone, MapPin, ArrowLeft, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getOrder, formatZAR } from '@/lib/firebase-queries';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  selected_options?: {
    flavor?: string;
    size?: string;
  };
  product: {
    id: string;
    name: string;
    brand?: string;
    images?: string[];
  };
}

interface Order {
  id: string;
  status: string;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shipping_address: {
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
  };
  billing_address: {
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
  };
  payment_method: {
    type: string;
  };
  created_at: string;
  order_items: OrderItem[];
}

const OrderConfirmationPage = () => {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const order = await getOrder(orderId);

      if (!order) {
        setError('Order not found');
        return;
      }

      setOrder(order);
    } catch (err) {
      console.error('Error loading order:', err);
      setError('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'processing':
        return 'text-blue-600 bg-blue-100';
      case 'shipped':
        return 'text-purple-600 bg-purple-100';
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Package className="h-5 w-5" />;
      case 'processing':
        return <Package className="h-5 w-5" />;
      case 'shipped':
        return <Truck className="h-5 w-5" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5" />;
      default:
        return <Package className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-apex-red mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'The order you\'re looking for doesn\'t exist.'}</p>
          <Button onClick={() => router.push('/')} className="bg-apex-red hover:bg-red-600">
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center text-apex-red hover:text-red-600 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Order Confirmation</h1>
        </div>

        {/* Success Message */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank you for your order!</h2>
            <p className="text-gray-600 mb-4">
              Your order has been successfully placed. We'll send you an email confirmation shortly.
            </p>
            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800">
              Order #{order.id.slice(-8).toUpperCase()}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Order Status</h3>
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                </div>
                <div>
                  <p className="font-medium text-gray-900 capitalize">{order.status}</p>
                  <p className="text-sm text-gray-500">
                    Ordered on {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Order Items</h3>
              <div className="space-y-4">
                {order.order_items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                      {item.product.brand && (
                        <p className="text-sm text-gray-500">by {item.product.brand}</p>
                      )}
                      {item.selected_options && (
                        <div className="mt-2 space-x-2">
                          {item.selected_options.flavor && (
                            <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                              Flavor: {item.selected_options.flavor}
                            </span>
                          )}
                          {item.selected_options.size && (
                            <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                              Size: {item.selected_options.size}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">Qty: {item.quantity}</p>
                      <p className="text-sm text-gray-500">{formatZAR(item.price)} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Shipping Address</h3>
              <div className="space-y-2">
                <p className="text-gray-900">
                  {order.shipping_address.first_name} {order.shipping_address.last_name}
                </p>
                <p className="text-gray-600">{order.shipping_address.address_line_1}</p>
                {order.shipping_address.address_line_2 && (
                  <p className="text-gray-600">{order.shipping_address.address_line_2}</p>
                )}
                <p className="text-gray-600">
                  {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
                </p>
                <p className="text-gray-600">{order.shipping_address.country}</p>
                <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Mail className="h-4 w-4" />
                    <span>{order.shipping_address.email}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Phone className="h-4 w-4" />
                    <span>{order.shipping_address.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatZAR(order.subtotal)}</span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>{order.shipping === 0 ? 'FREE' : formatZAR(order.shipping)}</span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Tax (15% VAT)</span>
                    <span>{formatZAR(order.tax)}</span>
                  </div>

                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between font-bold text-lg text-gray-900">
                      <span>Total</span>
                      <span>{formatZAR(order.total)}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="border-t border-gray-200 pt-4 mb-6">
                  <h4 className="font-medium text-gray-900 mb-2">Payment Method</h4>
                  <p className="text-sm text-gray-600 capitalize">
                    {order.payment_method.type}
                  </p>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <Button
                    onClick={() => window.print()}
                    variant="outline"
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Receipt
                  </Button>
                  <Button
                    onClick={() => router.push('/account/orders')}
                    className="w-full bg-apex-red hover:bg-red-600"
                  >
                    View All Orders
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">What's Next?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Email Confirmation</h4>
              <p className="text-sm text-gray-600">You'll receive an email with order details</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Truck className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Shipping Updates</h4>
              <p className="text-sm text-gray-600">Track your order with shipping notifications</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Delivery</h4>
              <p className="text-sm text-gray-600">Your order will arrive in 3-5 business days</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;