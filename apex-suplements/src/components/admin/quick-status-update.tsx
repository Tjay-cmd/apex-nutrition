import React, { useState } from 'react';
import { Check, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { updateOrderStatus } from '@/lib/firebase-queries';
import OrderStatusBadge from './order-status-badge';

interface QuickStatusUpdateProps {
  orderId: string;
  currentStatus: string;
  onStatusUpdate: () => void;
}

const QuickStatusUpdate: React.FC<QuickStatusUpdateProps> = ({
  orderId,
  currentStatus,
  onStatusUpdate
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<string>('');
  const [updating, setUpdating] = useState(false);

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'text-yellow-600' },
    { value: 'processing', label: 'Processing', color: 'text-blue-600' },
    { value: 'shipped', label: 'Shipped', color: 'text-purple-600' },
    { value: 'delivered', label: 'Delivered', color: 'text-green-600' },
    { value: 'cancelled', label: 'Cancelled', color: 'text-red-600' },
  ];

  const handleStatusUpdate = async () => {
    if (!newStatus) return;

    try {
      setUpdating(true);
      const result = await updateOrderStatus(orderId, newStatus, 'admin');
      if (result.success) {
        onStatusUpdate();
        setIsOpen(false);
        setNewStatus('');
      }
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-600 hover:text-gray-900"
      >
        <OrderStatusBadge status={currentStatus as any} size="sm" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
          <div className="p-2">
            <div className="text-xs font-medium text-gray-700 mb-2 px-2">Update Status</div>
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setNewStatus(option.value)}
                className={`w-full text-left px-2 py-1.5 text-sm rounded hover:bg-gray-100 ${
                  newStatus === option.value ? 'bg-apex-red/10 text-apex-red' : 'text-gray-700'
                }`}
              >
                {option.label}
              </button>
            ))}

            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-3 w-3" />
              </Button>

              <Button
                size="sm"
                onClick={handleStatusUpdate}
                disabled={!newStatus || updating}
                className="bg-apex-red hover:bg-apex-red/90 text-white"
              >
                {updating ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Check className="h-3 w-3" />
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickStatusUpdate;