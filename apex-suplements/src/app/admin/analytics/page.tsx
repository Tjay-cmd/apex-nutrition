"use client";

import React, { useState, useEffect } from 'react';
import { RoleGuard } from '@/components/auth/role-guard';
import {
  TrendingUp,
  Users,
  Package,
  DollarSign,
  Calendar,
  RefreshCw,
  Download,
  Filter,
  BarChart3,
  PieChart,
  Activity,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getAnalyticsSummary, getRealTimeMetrics, formatZAR } from '@/lib/firebase-queries';
import type { AnalyticsSummary, RealTimeMetrics, AnalyticsFilters } from '@/types/analytics';
import RevenueChart from '@/components/admin/analytics/revenue-chart';
import OrderTrendsChart from '@/components/admin/analytics/order-trends-chart';
import CustomerAnalyticsChart from '@/components/admin/analytics/customer-analytics-chart';
import TopProductsChart from '@/components/admin/analytics/top-products-chart';
import GeographicChart from '@/components/admin/analytics/geographic-chart';
import CustomerSegmentation from '@/components/admin/analytics/customer-segmentation';
import ProductPerformance from '@/components/admin/analytics/product-performance';
import PredictiveAnalytics from '@/components/admin/analytics/predictive-analytics';
import InteractiveDashboardWidget from '@/components/admin/analytics/interactive-dashboard-widget';
import AdvancedDateSelector from '@/components/admin/analytics/advanced-date-selector';
import RealTimeVisualization from '@/components/admin/analytics/real-time-visualization';
import ExportModal from '@/components/admin/analytics/export-modal';
import ScheduledReports from '@/components/admin/analytics/scheduled-reports';
import BusinessIntelligence from '@/components/admin/analytics/business-intelligence';
import KPICard from '@/components/admin/analytics/kpi-card';
import DateRangeSelector from '@/components/admin/analytics/date-range-selector';
import LoadingSpinner from '@/components/admin/analytics/loading-spinner';

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsSummary | null>(null);
  const [realTimeMetrics, setRealTimeMetrics] = useState<RealTimeMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState<AnalyticsFilters>({});
  const [error, setError] = useState<string | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [livePaused, setLivePaused] = useState(false);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [analytics, realTime] = await Promise.all([
        getAnalyticsSummary(filters),
        getRealTimeMetrics()
      ]);

      setAnalyticsData(analytics);
      setRealTimeMetrics(realTime);
    } catch (err) {
      console.error('Error loading analytics data:', err);
      setError('Failed to load analytics data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAnalyticsData();
    setRefreshing(false);
  };

  const toggleLive = () => setLivePaused(v => !v);

  const handleFiltersChange = (newFilters: AnalyticsFilters) => {
    setFilters(newFilters);
  };

  // Export & Reporting Handlers
  const handleExport = () => {
    setIsExportModalOpen(true);
  };

  const handleScheduleReport = (report: any) => {
    console.log('Scheduling report:', report);
    // In real app, this would call an API to schedule the report
  };

  const handleUpdateReport = (id: string, updates: any) => {
    console.log('Updating report:', id, updates);
    // In real app, this would call an API to update the report
  };

  const handleDeleteReport = (id: string) => {
    console.log('Deleting report:', id);
    // In real app, this would call an API to delete the report
  };

  const handleToggleReport = (id: string, isActive: boolean) => {
    console.log('Toggling report:', id, isActive);
    // In real app, this would call an API to toggle the report
  };

  useEffect(() => {
    loadAnalyticsData();
  }, [filters]);

  if (loading) {
    return (
      <RoleGuard allowedRoles={['admin', 'super_admin']}>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </RoleGuard>
    );
  }

  if (error) {
    return (
      <RoleGuard allowedRoles={['admin', 'super_admin']}>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Analytics</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={loadAnalyticsData} className="bg-apex-red hover:bg-apex-red/90">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </RoleGuard>
    );
  }

  if (!analyticsData || !realTimeMetrics) {
    return (
      <RoleGuard allowedRoles={['admin', 'super_admin']}>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-gray-400 text-xl mb-4">📊</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Analytics Data</h2>
            <p className="text-gray-600">No analytics data available at the moment.</p>
          </div>
        </div>
      </RoleGuard>
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
                <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
                <p className="text-gray-600 mt-2">
                  Comprehensive insights into your business performance
                </p>
              </div>
            <div className="flex items-center space-x-3">
                 <AdvancedDateSelector
                   filters={filters}
                   onFiltersChange={handleFiltersChange}
                   showTimeGranularity={true}
                   showRelativeDates={true}
                   showCustomPresets={true}
                 />
              <Button
                variant={livePaused ? 'outline' : 'default'}
                onClick={toggleLive}
                className={livePaused ? 'text-gray-600 hover:text-gray-800' : 'bg-green-600 hover:bg-green-700'}
              >
                {livePaused ? 'Resume Live' : 'Pause Live'}
              </Button>
                 <Button
                   variant="outline"
                   onClick={handleRefresh}
                   disabled={refreshing}
                   className="text-gray-600 hover:text-gray-800"
                 >
                   <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                   Refresh
                 </Button>
                      <Button
       onClick={handleExport}
       className="bg-apex-red hover:bg-apex-red/90 text-white"
     >
       <Download className="h-4 w-4 mr-2" />
       Export Report
     </Button>
               </div>
            </div>
          </div>

          {/* Real-time Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <KPICard
              title="Today's Revenue"
              value={formatZAR(realTimeMetrics.today_revenue)}
              icon={DollarSign}
              color="text-green-600"
              bgColor="bg-green-100"
              change={`${analyticsData.revenue.revenue_growth_rate > 0 ? '+' : ''}${analyticsData.revenue.revenue_growth_rate.toFixed(1)}%`}
              changeType={analyticsData.revenue.revenue_growth_rate > 0 ? 'positive' : 'negative'}
            />
            <KPICard
              title="Today's Orders"
              value={realTimeMetrics.today_orders.toString()}
              icon={Package}
              color="text-blue-600"
              bgColor="bg-blue-100"
              change={`${analyticsData.orders.order_completion_rate.toFixed(1)}% completion rate`}
              changeType="neutral"
            />
            <KPICard
              title="Active Customers"
              value={realTimeMetrics.active_customers.toString()}
              icon={Users}
              color="text-purple-600"
              bgColor="bg-purple-100"
              change={`${analyticsData.customers.customer_acquisition_rate.toFixed(1)}% acquisition rate`}
              changeType="neutral"
            />
            <KPICard
              title="Pending Orders"
              value={realTimeMetrics.pending_orders.toString()}
              icon={Activity}
              color="text-orange-600"
              bgColor="bg-orange-100"
              change={`${realTimeMetrics.low_stock_alerts} low stock alerts`}
              changeType="neutral"
            />
          </div>

          {/* Main Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Revenue Chart */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Revenue Trends</h3>
                  <p className="text-sm text-gray-600">Daily revenue over the last 30 days</p>
                </div>
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-apex-red" />
                </div>
              </div>
              <RevenueChart data={analyticsData.revenue.revenue_by_period} />
            </div>

            {/* Order Trends */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Order Trends</h3>
                  <p className="text-sm text-gray-600">Daily orders and completion rates</p>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-apex-red" />
                </div>
              </div>
              <OrderTrendsChart data={analyticsData.orders.orders_by_period} />
            </div>
          </div>

          {/* Secondary Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Customer Analytics */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Customer Growth</h3>
                  <p className="text-sm text-gray-600">New vs returning customers</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-apex-red" />
                </div>
              </div>
              <CustomerAnalyticsChart data={analyticsData.customers} />
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Top Products</h3>
                  <p className="text-sm text-gray-600">Best performing products</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Package className="h-5 w-5 text-apex-red" />
                </div>
              </div>
              <TopProductsChart data={analyticsData.products.top_products} />
            </div>

            {/* Geographic Distribution */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Geographic Distribution</h3>
                  <p className="text-sm text-gray-600">Orders by region</p>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-apex-red" />
                </div>
              </div>
              <GeographicChart data={analyticsData.geography} />
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatZAR(analyticsData.revenue.total_revenue)}
                  </p>
                </div>
                <div className="p-3 bg-apex-red/10 rounded-full">
                  <DollarSign className="h-6 w-6 text-apex-red" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analyticsData.orders.total_orders}
                  </p>
                </div>
                <div className="p-3 bg-apex-gold/10 rounded-full">
                  <Package className="h-6 w-6 text-apex-gold" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Customers</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analyticsData.customers.total_customers}
                  </p>
                </div>
                <div className="p-3 bg-orange-500/10 rounded-full">
                  <Users className="h-6 w-6 text-orange-500" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatZAR(analyticsData.revenue.average_order_value)}
                  </p>
                </div>
                <div className="p-3 bg-green-500/10 rounded-full">
                  <TrendingUp className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </div>
          </div>

                    {/* Interactive Analytics Section */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Interactive Analytics</h2>

            {/* Real-time Visualization */}
            <div className="mb-8">
              <RealTimeVisualization
                title="Real-time Revenue Tracking"
                description="Live revenue data with real-time updates and connection monitoring"
                data={analyticsData.revenue.revenue_by_period}
                realTimeMetrics={realTimeMetrics}
                updateInterval={livePaused ? 0 : 15000}
                maxDataPoints={30}
              />
            </div>

            {/* Interactive Dashboard Widgets */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <InteractiveDashboardWidget
                title="Revenue Trends"
                description="Interactive revenue chart with zoom and pan capabilities"
                data={analyticsData.revenue.revenue_by_period}
                type="line"
                realTime={!livePaused}
                refreshInterval={livePaused ? 0 : 10000}
                onRefresh={handleRefresh}
                onExport={() => console.log('Exporting revenue data')}
              />

              <InteractiveDashboardWidget
                title="Order Distribution"
                description="Order trends with customizable chart types"
                data={analyticsData.orders.orders_by_period}
                type="bar"
                realTime={false}
                onRefresh={handleRefresh}
                onExport={() => console.log('Exporting order data')}
              />
            </div>
          </div>

          {/* Advanced Analytics Section */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Advanced Analytics</h2>

            {/* Customer Segmentation */}
            <div className="mb-8">
              <CustomerSegmentation data={analyticsData.customers} />
            </div>

            {/* Product Performance */}
            <div className="mb-8">
              <ProductPerformance data={analyticsData.products} />
            </div>

            {/* Predictive Analytics */}
            <div className="mb-8">
              <PredictiveAnalytics data={analyticsData.trends} />
            </div>
          </div>

          {/* Phase 5: Export & Reporting Features */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Export & Reporting</h2>

            {/* Business Intelligence */}
            <div className="mb-8">
              <BusinessIntelligence data={analyticsData} />
            </div>

            {/* Scheduled Reports */}
            <div className="mb-8">
              <ScheduledReports
                onScheduleReport={handleScheduleReport}
                onUpdateReport={handleUpdateReport}
                onDeleteReport={handleDeleteReport}
                onToggleReport={handleToggleReport}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Export Modal */}
      {analyticsData && (
        <ExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          data={analyticsData}
          filters={filters}
        />
      )}
    </RoleGuard>
  );
}