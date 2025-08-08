"use client";

import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Package,
  CreditCard,
  Truck,
  Clock,
  CheckCircle,
  XCircle,
  Edit,
  Save,
  MessageSquare,
  Calendar,
  DollarSign,
  ShoppingBag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import OrderStatusBadge from './order-status-badge';
import PaymentStatusBadge from './payment-status-badge';
import { getOrder, updateOrderStatus, formatZAR } from '@/lib/firebase-queries';
import type { Order, OrderStatus } from '@/types/order';

interface OrderDetailsModalProps {
  orderId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onOrderUpdate: () => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  orderId,
  isOpen,
  onClose,
  onOrderUpdate
}) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState<string>('');
  const [adminNotes, setAdminNotes] = useState<string>('');
  const [trackingNumber, setTrackingNumber] = useState<string>('');

  useEffect(() => {
    if (isOpen && orderId) {
      loadOrderDetails();
    }
  }, [isOpen, orderId]);

  const loadOrderDetails = async () => {
    if (!orderId) return;

    try {
      setLoading(true);
      const orderData = await getOrder(orderId);
      if (orderData) {
        setOrder(orderData);
        setTrackingNumber(orderData.tracking_number || '');
        setAdminNotes(orderData.notes || '');
      }
    } catch (error) {
      console.error('Error loading order details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!orderId || !newStatus) return;

    try {
      setUpdating(true);
      const result = await updateOrderStatus(orderId, newStatus, 'admin', adminNotes);
      if (result.success) {
        await loadOrderDetails();
        onOrderUpdate();
        setNewStatus('');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!orderId) return;

    try {
      setUpdating(true);
      const result = await updateOrderStatus(orderId, order?.status || 'pending', 'admin', adminNotes);
      if (result.success) {
        await loadOrderDetails();
        onOrderUpdate();
      }
    } catch (error) {
      console.error('Error saving notes:', error);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'processing':
        return <Package className="h-4 w-4 text-blue-500" />;
      case 'shipped':
        return <Truck className="h-4 w-4 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
            {order && (
              <p className="text-gray-600 mt-1">Order #{order.id.slice(-8)}</p>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-apex-red mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading order details...</p>
          </div>
        ) : order ? (
          <div className="p-6 space-y-6">
            {/* Order Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Order Date</span>
                </div>
                <p className="text-gray-900">{new Date(order.created_at).toLocaleDateString()}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Total Amount</span>
                </div>
                <p className="text-gray-900 font-semibold">{formatZAR(order.total_amount)}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <ShoppingBag className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Items</span>
                </div>
                <p className="text-gray-900">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
              </div>
            </div>

            {/* Status and Actions */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Order Status</h3>
                  <div className="flex items-center space-x-4">
                    <OrderStatusBadge status={order.status} size="lg" />
                    <PaymentStatusBadge status={order.payment_status} size="lg" />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-apex-red focus:border-transparent"
                  >
                    <option value="">Update Status</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>

                  <Button
                    onClick={handleStatusUpdate}
                    disabled={!newStatus || updating}
                    className="bg-apex-red hover:bg-apex-red/90 text-white"
                  >
                    {updating ? 'Updating...' : 'Update'}
                  </Button>
                </div>
              </div>

              {/* Tracking Number */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tracking Number
                </label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter tracking number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-apex-red focus:border-transparent"
                />
              </div>

              {/* Admin Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Notes
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add internal notes..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-apex-red focus:border-transparent"
                />
                <div className="mt-2 flex justify-end">
                  <Button
                    onClick={handleSaveNotes}
                    disabled={updating}
                    variant="outline"
                    size="sm"
                    className="text-apex-gold border-apex-gold hover:bg-apex-gold hover:text-white"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Notes
                  </Button>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2 text-apex-red" />
                  Customer Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Name</p>
                    <p className="text-gray-900">{order.customer_name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Email</p>
                    <p className="text-gray-900">{order.customer_email}</p>
                  </div>
                  {order.customer_phone && (
                    <div>
                      <p className="text-sm font-medium text-gray-700">Phone</p>
                      <p className="text-gray-900">{order.customer_phone}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Addresses */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-apex-red" />
                  Addresses
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Shipping Address</p>
                    <div className="text-sm text-gray-900">
                      <p>{order.shipping_address.street}</p>
                      <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}</p>
                      <p>{order.shipping_address.country}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Billing Address</p>
                    <div className="text-sm text-gray-900">
                      <p>{order.billing_address.street}</p>
                      <p>{order.billing_address.city}, {order.billing_address.state} {order.billing_address.postal_code}</p>
                      <p>{order.billing_address.country}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Package className="h-5 w-5 mr-2 text-apex-red" />
                Order Items
              </h3>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt={item.product_name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.product_name}</h4>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{formatZAR(item.unit_price)}</p>
                      <p className="text-sm text-gray-600">Total: {formatZAR(item.total_price)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatZAR(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">{formatZAR(order.shipping_cost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">{formatZAR(order.tax_amount)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold border-t pt-2">
                    <span>Total</span>
                    <span>{formatZAR(order.total_amount)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-apex-red" />
                Status Timeline
              </h3>
              <div className="space-y-4">
                {order.status_history?.map((status, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {getStatusIcon(status.status)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <OrderStatusBadge status={status.status} size="sm" showIcon={false} />
                        <span className="text-sm text-gray-500">
                          {new Date(status.updated_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Updated by: {status.updated_by}
                      </p>
                      {status.notes && (
                        <p className="text-sm text-gray-700 mt-1">{status.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Order not found</h3>
            <p className="text-gray-500">The order you're looking for doesn't exist or has been removed.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetailsModal;