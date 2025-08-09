"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { RoleGuard } from '@/components/auth/role-guard';
import { BarChart3, Users, Package, ShoppingCart, TrendingUp, Settings, Shield, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getAnalyticsSummary, formatZAR } from '@/lib/firebase-queries';
import type { AnalyticsSummary } from '@/types/analytics';

const AdminDashboard = () => {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(false);

  const loadStats = async () => {
    setLoading(true);
    try {
      const data = await getAnalyticsSummary({});
      setSummary(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // initial load only; no auto-polling
    loadStats();
  }, []);

  const stats = useMemo(() => {
    const revenueValue = summary ? formatZAR(summary.revenue.total_revenue) : '—';
    const revenueChange = summary ? `${summary.revenue.revenue_growth_rate >= 0 ? '+' : ''}${summary.revenue.revenue_growth_rate.toFixed(1)}%` : '—';

    const totalOrders = summary ? summary.orders.total_orders.toLocaleString() : '—';
    const ordersChange = summary ? `${summary.orders.order_completion_rate.toFixed(1)}% completion` : '—';

    const totalCustomers = summary ? summary.customers.total_customers.toLocaleString() : '—';
    const customersChange = summary ? `${summary.customers.customer_acquisition_rate.toFixed(1)}% acquisition` : '—';

    const totalProducts = summary ? summary.products.total_products.toLocaleString() : '—';

    return [
      {
        title: 'Total Revenue',
        value: revenueValue,
        change: revenueChange,
        changeType: summary && summary.revenue.revenue_growth_rate >= 0 ? 'positive' : 'negative',
        icon: TrendingUp,
        textColor: 'text-apex-red',
      },
      {
        title: 'Total Orders',
        value: totalOrders,
        change: ordersChange,
        changeType: 'neutral',
        icon: ShoppingCart,
        textColor: 'text-apex-gold',
      },
      {
        title: 'Total Customers',
        value: totalCustomers,
        change: customersChange,
        changeType: 'neutral',
        icon: Users,
        textColor: 'text-orange-600',
      },
      {
        title: 'Total Products',
        value: totalProducts,
        change: summary ? `${Object.values(summary.products.products_by_category || {}).reduce((a: number, b: any) => a + (typeof b === 'number' ? b : 0), 0) || totalProducts} total` : '—',
        changeType: 'neutral',
        icon: Package,
        textColor: 'text-gray-800',
      },
    ];
  }, [summary]);

  const quickActions = [
    {
      title: 'Manage Products',
      description: 'Add, edit, or remove products',
      icon: Package,
      href: '/admin/products',
      color: 'bg-apex-red',
      bgColor: 'bg-red-50',
      textColor: 'text-apex-red',
      buttonColor: 'border-apex-red text-apex-red hover:bg-apex-red hover:text-white',
    },
    {
      title: 'View Orders',
      description: 'Process and track orders',
      icon: ShoppingCart,
      href: '/admin/orders',
      color: 'bg-apex-gold',
      bgColor: 'bg-yellow-50',
      textColor: 'text-apex-gold',
      buttonColor: 'border-apex-gold text-apex-gold hover:bg-apex-gold hover:text-white',
    },
    {
      title: 'Customer Management',
      description: 'View and manage customers',
      icon: Users,
      href: '/admin/customers',
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      buttonColor: 'border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white',
    },
    {
      title: 'Analytics',
      description: 'View detailed analytics',
      icon: BarChart3,
      href: '/admin/analytics',
      color: 'bg-gray-800',
      bgColor: 'bg-gray-50',
      textColor: 'text-gray-800',
      buttonColor: 'border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white',
    },
    {
      title: 'Settings',
      description: 'Configure store settings',
      icon: Settings,
      href: '/admin/settings',
      color: 'bg-apex-red',
      bgColor: 'bg-red-50',
      textColor: 'text-apex-red',
      buttonColor: 'border-apex-red text-apex-red hover:bg-apex-red hover:text-white',
    },
    {
      title: 'Security',
      description: 'Manage access and security',
      icon: Shield,
      href: '/admin/security',
      color: 'bg-apex-gold',
      bgColor: 'bg-yellow-50',
      textColor: 'text-apex-gold',
      buttonColor: 'border-apex-gold text-apex-gold hover:bg-apex-gold hover:text-white',
    },
  ];

  return (
    <RoleGuard allowedRoles={['admin', 'super_admin']}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-2">Welcome to the Apex Nutrition admin panel</p>
            </div>
            <Button variant="outline" onClick={loadStats} disabled={loading} className="text-gray-600 hover:text-gray-800">
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                      <p className={`text-sm mt-1 font-medium ${
                        stat.changeType === 'positive' ? 'text-green-600' : stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {stat.change}
                      </p>
                    </div>
                    <div className="p-3">
                      <Icon className={`h-6 w-6 ${stat.textColor}`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <div key={index} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 hover:scale-105">
                    <div className="flex items-start space-x-4">
                      <div className="p-3">
                        <Icon className={`h-6 w-6 ${action.textColor}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
                        <p className="text-gray-600 text-sm mb-4">{action.description}</p>
                        <Button
                          variant="outline"
                          className={`w-full ${action.buttonColor} transition-colors`}
                          onClick={() => window.location.href = action.href}
                        >
                          Access
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-red-50 rounded-lg border border-red-100">
                <div className="w-2 h-2 bg-apex-red rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">New order #1234 received</p>
                  <p className="text-xs text-gray-500">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                <div className="w-2 h-2 bg-apex-gold rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Product "Whey Protein" stock updated</p>
                  <p className="text-xs text-gray-500">15 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-orange-50 rounded-lg border border-orange-100">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">New customer registration</p>
                  <p className="text-xs text-gray-500">1 hour ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
};

export default AdminDashboard;