import React from 'react';
import { LucideIcon } from 'lucide-react';
import { formatZAR } from '@/lib/firebase-queries';

interface OrderStatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
}

const OrderStatsCard: React.FC<OrderStatsCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  change,
  changeType = 'neutral'
}) => {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {typeof value === 'number' && title.toLowerCase().includes('revenue')
              ? formatZAR(value)
              : value}
          </p>
          {change && (
            <p className={`text-sm mt-1 font-medium ${getChangeColor()}`}>
              {change}
            </p>
          )}
        </div>
        <div className={`p-3 ${color} rounded-full`}>
          <Icon className={`h-6 w-6 ${color.replace('bg-apex-red/10', 'text-apex-red').replace('bg-apex-gold/10', 'text-apex-gold').replace('bg-orange-500/10', 'text-orange-500').replace('bg-green-500/10', 'text-green-500')}`} />
        </div>
      </div>
    </div>
  );
};

export default OrderStatsCard;