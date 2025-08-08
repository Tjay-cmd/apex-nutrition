import React from 'react';
import { X, Keyboard, MousePointer, Search, Filter, Download, Mail, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const shortcuts = [
    { key: 'Ctrl/Cmd + A', description: 'Select all orders', icon: MousePointer },
    { key: 'Ctrl/Cmd + D', description: 'Deselect all orders', icon: MousePointer },
    { key: 'Ctrl/Cmd + B', description: 'Toggle bulk selection mode', icon: Package },
    { key: 'Ctrl/Cmd + F', description: 'Toggle advanced filters', icon: Filter },
    { key: 'Ctrl/Cmd + E', description: 'Export selected orders', icon: Download },
    { key: 'Ctrl/Cmd + R', description: 'Refresh orders list', icon: Search },
    { key: 'Ctrl/Cmd + K', description: 'Focus search bar', icon: Search },
    { key: 'Escape', description: 'Close modals and dropdowns', icon: Keyboard },
  ];

  const features = [
    {
      title: 'Advanced Filtering',
      description: 'Filter orders by date range, amount, status, and customer information',
      icon: Filter
    },
    {
      title: 'Bulk Operations',
      description: 'Select multiple orders for status updates, exports, and email campaigns',
      icon: Package
    },
    {
      title: 'Export Functionality',
      description: 'Export orders to CSV format with comprehensive order data',
      icon: Download
    },
    {
      title: 'Email Notifications',
      description: 'Send bulk emails to customers with custom messages',
      icon: Mail
    },
    {
      title: 'Shipping Labels',
      description: 'Generate shipping labels for multiple orders at once',
      icon: Package
    },
    {
      title: 'Real-time Updates',
      description: 'Live status updates and order management with history tracking',
      icon: Search
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Help & Keyboard Shortcuts</h2>
            <p className="text-gray-600 mt-1">Learn how to use the orders management interface efficiently</p>
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

        <div className="p-6 space-y-8">
          {/* Keyboard Shortcuts */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Keyboard className="h-5 w-5 mr-2 text-apex-red" />
              Keyboard Shortcuts
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {shortcuts.map((shortcut, index) => {
                const Icon = shortcut.icon;
                return (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Icon className="h-4 w-4 text-gray-500" />
                    <div className="flex-1">
                      <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-200 border border-gray-300 rounded">
                        {shortcut.key}
                      </kbd>
                    </div>
                    <span className="text-sm text-gray-600">{shortcut.description}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Features Overview */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-apex-red/50 hover:bg-apex-red/5 transition-colors">
                    <div className="flex items-start space-x-3">
                      <Icon className="h-5 w-5 text-apex-red mt-0.5" />
                      <div>
                        <h4 className="font-medium text-gray-900">{feature.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Pro Tips</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Use bulk selection to perform operations on multiple orders at once</li>
              <li>• Advanced filters help you find specific orders quickly</li>
              <li>• Export orders to CSV for external analysis and reporting</li>
              <li>• Keyboard shortcuts make navigation faster and more efficient</li>
              <li>• Order status updates are tracked with full history</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;