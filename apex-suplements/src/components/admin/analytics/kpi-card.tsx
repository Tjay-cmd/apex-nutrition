import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  bgColor,
  change,
  changeType = 'neutral'
}) => {
  const getChangeIcon = () => {
    switch (changeType) {
      case 'positive':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'negative':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

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
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mb-2">{value}</p>
          {change && (
            <div className="flex items-center space-x-1">
              {getChangeIcon()}
              <span className={`text-sm font-medium ${getChangeColor()}`}>
                {change}
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 ${bgColor} rounded-full`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
      </div>
    </div>
  );
};

export default KPICard;