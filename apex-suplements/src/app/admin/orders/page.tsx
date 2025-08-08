"use client";

import React, { useState, useEffect } from 'react';
import { RoleGuard } from '@/components/auth/role-guard';
import {
  Search,
  Filter,
  ChevronDown,
  Eye,
  Edit,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Package,
  User,
  Calendar,
  DollarSign,
  ArrowUpDown,
  Square,
  CheckSquare,
  HelpCircle,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getAllOrders, getOrderStats, formatZAR } from '@/lib/firebase-queries';
import OrderRow from '@/components/admin/order-row';
import OrderStatsCard from '@/components/admin/order-stats-card';
import OrderDetailsModal from '@/components/admin/order-details-modal';
import AdvancedOrderFilters from '@/components/admin/advanced-order-filters';
import OrderSorting, { SortField, SortDirection } from '@/components/admin/order-sorting';
import BulkSelection from '@/components/admin/bulk-selection';
import BulkOperationsModal from '@/components/admin/bulk-operations-modal';
import KeyboardShortcuts from '@/components/admin/keyboard-shortcuts';
import HelpModal from '@/components/admin/help-modal';
import type { Order, OrderStats, OrderFilters } from '@/types/order';

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Advanced filtering and sorting
  const [filters, setFilters] = useState<OrderFilters>({});
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [showBulkSelection, setShowBulkSelection] = useState(false);
  const [showBulkOperations, setShowBulkOperations] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    loadOrders();
    loadStats();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const result = await getAllOrders(50);
      setOrders(result.orders);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const orderStats = await getOrderStats();
      setStats(orderStats);
    } catch (error) {
      console.error('Error loading order stats:', error);
    }
  };



    const filteredOrders = orders.filter(order => {
    // Basic search filter
    const matchesSearch = !searchTerm ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_email.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

    // Advanced filters
    const matchesAdvancedFilters = Object.entries(filters).every(([key, value]) => {
      if (!value) return true;

      switch (key) {
        case 'search':
          return order.id.toLowerCase().includes(value.toLowerCase()) ||
                 order.customer_name.toLowerCase().includes(value.toLowerCase()) ||
                 order.customer_email.toLowerCase().includes(value.toLowerCase());
        case 'status':
          return order.status === value;
        case 'payment_status':
          return order.payment_status === value;
        case 'customer_email':
          return order.customer_email.toLowerCase().includes(value.toLowerCase());
        case 'date_from':
          return new Date(order.created_at) >= new Date(value);
        case 'date_to':
          return new Date(order.created_at) <= new Date(value);
        case 'min_amount':
          return order.total_amount >= value;
        case 'max_amount':
          return order.total_amount <= value;
        default:
          return true;
      }
    });

    return matchesSearch && matchesStatus && matchesAdvancedFilters;
  });

  // Sort orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    let aValue: string | number | Date;
    let bValue: string | number | Date;

    switch (sortField) {
      case 'created_at':
        aValue = new Date(a.created_at);
        bValue = new Date(b.created_at);
        break;
      case 'total_amount':
        aValue = a.total_amount;
        bValue = b.total_amount;
        break;
      case 'customer_name':
        aValue = a.customer_name.toLowerCase();
        bValue = b.customer_name.toLowerCase();
        break;
      case 'status':
        aValue = a.status;
        bValue = b.status;
        break;
      case 'payment_status':
        aValue = a.payment_status;
        bValue = b.payment_status;
        break;
      default:
        return 0;
    }

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleViewOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
    setIsModalOpen(true);
  };

  const handleEditOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrderId(null);
  };

  const handleOrderUpdate = () => {
    loadOrders();
    loadStats();
  };

  // Advanced filtering and sorting handlers
  const handleFiltersChange = (newFilters: OrderFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const handleSortChange = (field: SortField, direction: SortDirection) => {
    setSortField(field);
    setSortDirection(direction);
  };

  // Bulk selection handlers
  const handleOrderSelect = (orderId: string, selected: boolean) => {
    if (selected) {
      setSelectedOrders(prev => [...prev, orderId]);
    } else {
      setSelectedOrders(prev => prev.filter(id => id !== orderId));
    }
  };

  const handleSelectAll = () => {
    setSelectedOrders(sortedOrders.map(order => order.id));
  };

  const handleDeselectAll = () => {
    setSelectedOrders([]);
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} for orders:`, selectedOrders);
    setShowBulkOperations(true);
  };

  const handleBulkOperationComplete = () => {
    setSelectedOrders([]);
    loadOrders();
    loadStats();
  };

  const isAllSelected = selectedOrders.length === sortedOrders.length && sortedOrders.length > 0;
  const isIndeterminate = selectedOrders.length > 0 && selectedOrders.length < sortedOrders.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-apex-red mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <RoleGuard allowedRoles={['admin', 'super_admin']}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
                <p className="text-gray-600 mt-2">Manage and track all customer orders</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadOrders}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowHelp(true)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Help
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <OrderStatsCard
                title="Total Orders"
                value={stats.total_orders}
                icon={Package}
                color="bg-apex-red/10"
              />
              <OrderStatsCard
                title="Total Revenue"
                value={stats.total_revenue}
                icon={DollarSign}
                color="bg-apex-gold/10"
              />
              <OrderStatsCard
                title="Pending Orders"
                value={stats.pending_orders}
                icon={Clock}
                color="bg-orange-500/10"
              />
              <OrderStatsCard
                title="Delivered Orders"
                value={stats.delivered_orders}
                icon={CheckCircle}
                color="bg-green-500/10"
              />
            </div>
          )}

          {/* Advanced Filters */}
          <AdvancedOrderFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
            isExpanded={showFilters}
            onToggleExpanded={() => setShowFilters(!showFilters)}
          />

          {/* Bulk Selection */}
          <BulkSelection
            selectedOrders={selectedOrders}
            totalOrders={sortedOrders.length}
            onSelectAll={handleSelectAll}
            onDeselectAll={handleDeselectAll}
            onBulkAction={handleBulkAction}
            isAllSelected={isAllSelected}
            isIndeterminate={isIndeterminate}
          />

          {/* Orders Table */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Orders ({sortedOrders.length})
                </h2>
                <div className="flex items-center space-x-4">
                  <OrderSorting
                    sortField={sortField}
                    sortDirection={sortDirection}
                    onSortChange={handleSortChange}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowBulkSelection(!showBulkSelection)}
                    className={showBulkSelection ? 'bg-apex-red text-white border-apex-red' : ''}
                  >
                    Bulk Actions
                  </Button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {showBulkSelection && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <button
                          onClick={isAllSelected ? handleDeselectAll : handleSelectAll}
                          className="flex items-center justify-center w-5 h-5"
                        >
                          {isIndeterminate ? (
                            <Square className="h-4 w-4 text-gray-400" />
                          ) : isAllSelected ? (
                            <CheckSquare className="h-4 w-4 text-apex-red" />
                          ) : (
                            <Square className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </th>
                    )}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedOrders.map((order) => (
                    <OrderRow
                      key={order.id}
                      order={order}
                      onView={handleViewOrder}
                      onEdit={handleEditOrder}
                      onStatusUpdate={handleOrderUpdate}
                      onSelect={handleOrderSelect}
                      isSelected={selectedOrders.includes(order.id)}
                      showCheckbox={showBulkSelection}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {sortedOrders.length === 0 && (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal
        orderId={selectedOrderId}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onOrderUpdate={handleOrderUpdate}
      />

      {/* Bulk Operations Modal */}
      <BulkOperationsModal
        isOpen={showBulkOperations}
        onClose={() => setShowBulkOperations(false)}
        selectedOrders={selectedOrders}
        orders={orders}
        onOperationComplete={handleBulkOperationComplete}
      />

      {/* Help Modal */}
      <HelpModal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
      />

      {/* Keyboard Shortcuts */}
      <KeyboardShortcuts
        onSelectAll={handleSelectAll}
        onDeselectAll={handleDeselectAll}
        onToggleBulkSelection={() => setShowBulkSelection(!showBulkSelection)}
        onToggleFilters={() => setShowFilters(!showFilters)}
        onExport={() => setShowBulkOperations(true)}
        onRefresh={loadOrders}
        onSearch={() => {
          const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
          if (searchInput) searchInput.focus();
        }}
      />
    </RoleGuard>
  );
};

export default OrdersPage;