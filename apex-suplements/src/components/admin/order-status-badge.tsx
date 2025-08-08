import React from 'react';
import { Clock, Package, Truck, CheckCircle, XCircle } from 'lucide-react';

interface OrderStatusBadgeProps {
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true
}) => {
  const statusConfig = {
    pending: {
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      icon: Clock,
      label: 'Pending'
    },
    processing: {
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: Package,
      label: 'Processing'
    },
    shipped: {
      color: 'bg-purple-100 text-purple-800 border-purple-200',
      icon: Truck,
      label: 'Shipped'
    },
    delivered: {
      color: 'bg-green-100 text-green-800 border-green-200',
      icon: CheckCircle,
      label: 'Delivered'
    },
    cancelled: {
      color: 'bg-red-100 text-red-800 border-red-200',
      icon: XCircle,
      label: 'Cancelled'
    },
  };

  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-3 w-3',
    lg: 'h-4 w-4'
  };

  return (
    <span className={`inline-flex items-center rounded-full font-medium border ${config.color} ${sizeClasses[size]}`}>
      {showIcon && <Icon className={`${iconSizes[size]} mr-1`} />}
      {config.label}
    </span>
  );
};

export default OrderStatusBadge;