import React from 'react';
import { Clock, CheckCircle, XCircle, RotateCcw } from 'lucide-react';

interface PaymentStatusBadgeProps {
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

const PaymentStatusBadge: React.FC<PaymentStatusBadgeProps> = ({
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
    paid: {
      color: 'bg-green-100 text-green-800 border-green-200',
      icon: CheckCircle,
      label: 'Paid'
    },
    failed: {
      color: 'bg-red-100 text-red-800 border-red-200',
      icon: XCircle,
      label: 'Failed'
    },
    refunded: {
      color: 'bg-gray-100 text-gray-800 border-gray-200',
      icon: RotateCcw,
      label: 'Refunded'
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

export default PaymentStatusBadge;