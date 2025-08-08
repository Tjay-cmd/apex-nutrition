import React from 'react';
import { Eye, Edit, User, Calendar, CheckSquare, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import OrderStatusBadge from './order-status-badge';
import PaymentStatusBadge from './payment-status-badge';
import QuickStatusUpdate from './quick-status-update';
import { formatZAR } from '@/lib/firebase-queries';
import type { Order } from '@/types/order';

interface OrderRowProps {
  order: Order;
  onView: (orderId: string) => void;
  onEdit: (orderId: string) => void;
  onStatusUpdate: () => void;
  onSelect?: (orderId: string, selected: boolean) => void;
  isSelected?: boolean;
  showActions?: boolean;
  showCheckbox?: boolean;
}

const OrderRow: React.FC<OrderRowProps> = ({
  order,
  onView,
  onEdit,
  onStatusUpdate,
  onSelect,
  isSelected = false,
  showActions = true,
  showCheckbox = false
}) => {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      {showCheckbox && (
        <td className="px-6 py-4 whitespace-nowrap">
          <button
            onClick={() => onSelect?.(order.id, !isSelected)}
            className="flex items-center justify-center w-5 h-5"
          >
            {isSelected ? (
              <CheckSquare className="h-4 w-4 text-apex-red" />
            ) : (
              <Square className="h-4 w-4 text-gray-400" />
            )}
          </button>
        </td>
      )}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">#{order.id.slice(-8)}</div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-8 w-8">
            <div className="h-8 w-8 rounded-full bg-apex-red/10 flex items-center justify-center">
              <User className="h-4 w-4 text-apex-red" />
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{order.customer_name}</div>
            <div className="text-sm text-gray-500">{order.customer_email}</div>
          </div>
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <Calendar className="h-4 w-4 text-gray-400 mr-2" />
          <div className="text-sm text-gray-900">
            {new Date(order.created_at).toLocaleDateString()}
          </div>
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">
          {formatZAR(order.total_amount)}
        </div>
        <div className="text-sm text-gray-500">
          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <QuickStatusUpdate
          orderId={order.id}
          currentStatus={order.status}
          onStatusUpdate={onStatusUpdate}
        />
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <PaymentStatusBadge status={order.payment_status} />
      </td>

      {showActions && (
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView(order.id)}
              className="text-apex-red border-apex-red hover:bg-apex-red hover:text-white"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(order.id)}
              className="text-apex-gold border-apex-gold hover:bg-apex-gold hover:text-white"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </td>
      )}
    </tr>
  );
};

export default OrderRow;