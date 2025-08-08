import React from 'react';
import { ArrowUpDown, Calendar, DollarSign, User, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type SortField = 'created_at' | 'total_amount' | 'customer_name' | 'status' | 'payment_status';
export type SortDirection = 'asc' | 'desc';

interface OrderSortingProps {
  sortField: SortField;
  sortDirection: SortDirection;
  onSortChange: (field: SortField, direction: SortDirection) => void;
}

const OrderSorting: React.FC<OrderSortingProps> = ({
  sortField,
  sortDirection,
  onSortChange
}) => {
  const sortOptions = [
    {
      field: 'created_at' as SortField,
      label: 'Order Date',
      icon: Calendar
    },
    {
      field: 'total_amount' as SortField,
      label: 'Amount',
      icon: DollarSign
    },
    {
      field: 'customer_name' as SortField,
      label: 'Customer',
      icon: User
    },
    {
      field: 'status' as SortField,
      label: 'Status',
      icon: Package
    },
    {
      field: 'payment_status' as SortField,
      label: 'Payment',
      icon: DollarSign
    }
  ];

  const handleSort = (field: SortField) => {
    const newDirection = field === sortField && sortDirection === 'asc' ? 'desc' : 'asc';
    onSortChange(field, newDirection);
  };

  const getSortIcon = (field: SortField) => {
    if (field !== sortField) {
      return <ArrowUpDown className="h-4 w-4 text-gray-400" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUpDown className="h-4 w-4 text-apex-red" />
    ) : (
      <ArrowUpDown className="h-4 w-4 text-apex-red transform rotate-180" />
    );
  };

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium text-gray-700">Sort by:</span>
      {sortOptions.map((option) => {
        const Icon = option.icon;
        const isActive = sortField === option.field;

        return (
          <Button
            key={option.field}
            variant={isActive ? "default" : "outline"}
            size="sm"
            onClick={() => handleSort(option.field)}
            className={`flex items-center space-x-1 ${
              isActive
                ? 'bg-apex-red hover:bg-apex-red/90 text-white'
                : 'text-gray-600 hover:text-gray-800 border-gray-300'
            }`}
          >
            <Icon className="h-3 w-3" />
            <span className="text-xs">{option.label}</span>
            {getSortIcon(option.field)}
          </Button>
        );
      })}
    </div>
  );
};

export default OrderSorting;