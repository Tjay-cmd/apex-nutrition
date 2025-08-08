"use client";

import React, { useState } from 'react';
import {
  X,
  Download,
  Mail,
  Package,
  FileText,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Send,
  Truck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { updateOrderStatus, formatZAR } from '@/lib/firebase-queries';
import type { Order } from '@/types/order';

interface BulkOperationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedOrders: string[];
  orders: Order[];
  onOperationComplete: () => void;
}

type OperationType = 'status' | 'export' | 'email' | 'shipping';

const BulkOperationsModal: React.FC<BulkOperationsModalProps> = ({
  isOpen,
  onClose,
  selectedOrders,
  orders,
  onOperationComplete
}) => {
  const [operationType, setOperationType] = useState<OperationType | null>(null);
  const [newStatus, setNewStatus] = useState<string>('');
  const [emailSubject, setEmailSubject] = useState<string>('');
  const [emailMessage, setEmailMessage] = useState<string>('');
  const [adminNotes, setAdminNotes] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const selectedOrderData = orders.filter(order => selectedOrders.includes(order.id));

  const handleBulkStatusUpdate = async () => {
    if (!newStatus) return;

    setIsProcessing(true);
    setProgress(0);

    try {
      const total = selectedOrders.length;
      for (let i = 0; i < selectedOrders.length; i++) {
        await updateOrderStatus(selectedOrders[i], newStatus, 'admin', adminNotes);
        setProgress(((i + 1) / total) * 100);
      }

      onOperationComplete();
      onClose();
    } catch (error) {
      console.error('Error updating bulk status:', error);
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const handleExportOrders = () => {
    const csvData = selectedOrderData.map(order => ({
      'Order ID': order.id,
      'Customer Name': order.customer_name,
      'Customer Email': order.customer_email,
      'Status': order.status,
      'Payment Status': order.payment_status,
      'Total Amount': formatZAR(order.total_amount),
      'Items Count': order.items.length,
      'Created Date': new Date(order.created_at).toLocaleDateString(),
      'Shipping Address': `${order.shipping_address.street}, ${order.shipping_address.city}`,
      'Billing Address': `${order.billing_address.street}, ${order.billing_address.city}`
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).map(value => `"${value}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    onClose();
  };

  const handleSendBulkEmail = async () => {
    if (!emailSubject || !emailMessage) return;

    setIsProcessing(true);
    setProgress(0);

    try {
      const total = selectedOrderData.length;
      for (let i = 0; i < selectedOrderData.length; i++) {
        const order = selectedOrderData[i];
        // TODO: Implement actual email sending
        console.log(`Sending email to ${order.customer_email}: ${emailSubject}`);
        setProgress(((i + 1) / total) * 100);
        await new Promise(resolve => setTimeout(resolve, 100)); // Simulate email sending
      }

      onClose();
    } catch (error) {
      console.error('Error sending bulk emails:', error);
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const handleGenerateShippingLabels = () => {
    setIsProcessing(true);
    setProgress(0);

    try {
      // TODO: Implement actual shipping label generation
      console.log('Generating shipping labels for:', selectedOrders);

      // Simulate label generation
      setTimeout(() => {
        setProgress(100);
        setIsProcessing(false);
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error generating shipping labels:', error);
      setIsProcessing(false);
    }
  };

  const getOperationContent = () => {
    switch (operationType) {
      case 'status':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Status
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-apex-red focus:border-transparent"
              >
                <option value="">Select Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Notes
              </label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add notes for this bulk update..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-apex-red focus:border-transparent"
              />
            </div>
            <Button
              onClick={handleBulkStatusUpdate}
              disabled={!newStatus || isProcessing}
              className="w-full bg-apex-red hover:bg-apex-red/90 text-white"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating Status...
                </>
              ) : (
                <>
                  <Package className="h-4 w-4 mr-2" />
                  Update Status for {selectedOrders.length} Orders
                </>
              )}
            </Button>
          </div>
        );

      case 'export':
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-blue-600 mr-2" />
                <div>
                  <h4 className="text-sm font-medium text-blue-900">Export Orders</h4>
                  <p className="text-sm text-blue-700">
                    Export {selectedOrders.length} orders to CSV format
                  </p>
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <p>This will export the following data:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Order ID and customer information</li>
                <li>Status and payment details</li>
                <li>Order amounts and item counts</li>
                <li>Shipping and billing addresses</li>
                <li>Creation dates</li>
              </ul>
            </div>
            <Button
              onClick={handleExportOrders}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Export to CSV
            </Button>
          </div>
        );

      case 'email':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Subject
              </label>
              <input
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="Enter email subject..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-apex-red focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Message
              </label>
              <textarea
                value={emailMessage}
                onChange={(e) => setEmailMessage(e.target.value)}
                placeholder="Enter your message..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-apex-red focus:border-transparent"
              />
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-900">Email Preview</h4>
                  <p className="text-sm text-yellow-700">
                    This will send emails to {selectedOrderData.length} customers
                  </p>
                </div>
              </div>
            </div>
            <Button
              onClick={handleSendBulkEmail}
              disabled={!emailSubject || !emailMessage || isProcessing}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending Emails...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send to {selectedOrderData.length} Customers
                </>
              )}
            </Button>
          </div>
        );

      case 'shipping':
        return (
          <div className="space-y-4">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center">
                <Truck className="h-5 w-5 text-purple-600 mr-2" />
                <div>
                  <h4 className="text-sm font-medium text-purple-900">Shipping Labels</h4>
                  <p className="text-sm text-purple-700">
                    Generate shipping labels for {selectedOrders.length} orders
                  </p>
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <p>This will generate shipping labels for orders with valid shipping addresses.</p>
            </div>
            <Button
              onClick={handleGenerateShippingLabels}
              disabled={isProcessing}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating Labels...
                </>
              ) : (
                <>
                  <Truck className="h-4 w-4 mr-2" />
                  Generate Shipping Labels
                </>
              )}
            </Button>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setOperationType('status')}
                className="p-4 border border-gray-200 rounded-lg hover:border-apex-red hover:bg-apex-red/5 transition-colors text-left"
              >
                <Package className="h-6 w-6 text-apex-red mb-2" />
                <h3 className="font-medium text-gray-900">Bulk Status Update</h3>
                <p className="text-sm text-gray-600">Update status for multiple orders</p>
              </button>

              <button
                onClick={() => setOperationType('export')}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
              >
                <Download className="h-6 w-6 text-blue-600 mb-2" />
                <h3 className="font-medium text-gray-900">Export Orders</h3>
                <p className="text-sm text-gray-600">Export selected orders to CSV</p>
              </button>

              <button
                onClick={() => setOperationType('email')}
                className="p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-left"
              >
                <Mail className="h-6 w-6 text-green-600 mb-2" />
                <h3 className="font-medium text-gray-900">Send Emails</h3>
                <p className="text-sm text-gray-600">Send emails to customers</p>
              </button>

              <button
                onClick={() => setOperationType('shipping')}
                className="p-4 border border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors text-left"
              >
                <Truck className="h-6 w-6 text-purple-600 mb-2" />
                <h3 className="font-medium text-gray-900">Shipping Labels</h3>
                <p className="text-sm text-gray-600">Generate shipping labels</p>
              </button>
            </div>
          </div>
        );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Bulk Operations</h2>
            <p className="text-gray-600 mt-1">
              {selectedOrders.length} order{selectedOrders.length !== 1 ? 's' : ''} selected
            </p>
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

        {/* Progress Bar */}
        {isProcessing && (
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Processing...</span>
              <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-apex-red h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {operationType && (
            <button
              onClick={() => setOperationType(null)}
              className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
            >
              ← Back to Operations
            </button>
          )}

          {getOperationContent()}
        </div>
      </div>
    </div>
  );
};

export default BulkOperationsModal;