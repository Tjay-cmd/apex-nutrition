import React from 'react';
import { CheckSquare, Square, Trash2, Download, Send, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BulkSelectionProps {
  selectedOrders: string[];
  totalOrders: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onBulkAction: (action: string) => void;
  isAllSelected: boolean;
  isIndeterminate: boolean;
}

const BulkSelection: React.FC<BulkSelectionProps> = ({
  selectedOrders,
  totalOrders,
  onSelectAll,
  onDeselectAll,
  onBulkAction,
  isAllSelected,
  isIndeterminate
}) => {
  const bulkActions = [
    {
      id: 'export',
      label: 'Export Selected',
      icon: Download,
      color: 'text-blue-600 hover:text-blue-700'
    },
    {
      id: 'email',
      label: 'Send Email',
      icon: Send,
      color: 'text-green-600 hover:text-green-700'
    },
    {
      id: 'status',
      label: 'Update Status',
      icon: Package,
      color: 'text-apex-red hover:text-apex-red/80'
    },
    {
      id: 'delete',
      label: 'Delete Selected',
      icon: Trash2,
      color: 'text-red-600 hover:text-red-700'
    }
  ];

  const handleSelectAll = () => {
    if (isAllSelected) {
      onDeselectAll();
    } else {
      onSelectAll();
    }
  };

  const handleBulkAction = (action: string) => {
    onBulkAction(action);
  };

  const getSelectIcon = () => {
    if (isIndeterminate) {
      return <Square className="h-4 w-4 text-gray-400" />;
    }
    return isAllSelected ? (
      <CheckSquare className="h-4 w-4 text-apex-red" />
    ) : (
      <Square className="h-4 w-4 text-gray-400" />
    );
  };

  if (selectedOrders.length === 0) {
    return null;
  }

  return (
    <div className="bg-apex-red/5 border border-apex-red/20 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleSelectAll}
            className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            {getSelectIcon()}
            <span>
              {selectedOrders.length} of {totalOrders} orders selected
            </span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          {bulkActions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.id}
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction(action.id)}
                className={`${action.color} border-gray-300 hover:bg-gray-50`}
              >
                <Icon className="h-4 w-4 mr-1" />
                {action.label}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BulkSelection;