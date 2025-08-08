"use client";

import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Target,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Users,
  Package,
  BarChart3,
  PieChart,
  Activity,
  Lightbulb,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { AnalyticsSummary } from '@/types/analytics';

interface BusinessIntelligenceProps {
  data: AnalyticsSummary;
}

interface Insight {
  id: string;
  type: 'positive' | 'negative' | 'neutral' | 'warning';
  title: string;
  description: string;
  metric: string;
  change: number;
  icon: React.ComponentType<any>;
  priority: 'high' | 'medium' | 'low';
}

interface Recommendation {
  id: string;
  category: 'revenue' | 'customers' | 'operations' | 'marketing';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
  estimatedValue: string;
  icon: React.ComponentType<any>;
}

const BusinessIntelligence: React.FC<BusinessIntelligenceProps> = ({ data }) => {
  const [selectedInsight, setSelectedInsight] = useState<string | null>(null);
  const [selectedRecommendation, setSelectedRecommendation] = useState<string | null>(null);

  // Generate insights based on analytics data
  const generateInsights = (): Insight[] => {
    const insights: Insight[] = [];

    // Revenue insights
    if (data.revenue.revenue_growth_rate > 0) {
      insights.push({
        id: 'revenue-growth',
        type: 'positive',
        title: 'Revenue Growth',
        description: `Revenue is growing at ${data.revenue.revenue_growth_rate.toFixed(1)}%`,
        metric: `${data.revenue.revenue_growth_rate.toFixed(1)}%`,
        change: data.revenue.revenue_growth_rate,
        icon: TrendingUp,
        priority: 'high'
      });
    } else {
      insights.push({
        id: 'revenue-decline',
        type: 'negative',
        title: 'Revenue Decline',
        description: `Revenue declined by ${Math.abs(data.revenue.revenue_growth_rate).toFixed(1)}%`,
        metric: `${Math.abs(data.revenue.revenue_growth_rate).toFixed(1)}%`,
        change: data.revenue.revenue_growth_rate,
        icon: TrendingDown,
        priority: 'high'
      });
    }

    // Customer insights
    if (data.customers.customer_acquisition_rate > 10) {
      insights.push({
        id: 'customer-acquisition',
        type: 'positive',
        title: 'Strong Customer Acquisition',
        description: `Customer acquisition rate is ${data.customers.customer_acquisition_rate.toFixed(1)}%`,
        metric: `${data.customers.customer_acquisition_rate.toFixed(1)}%`,
        change: data.customers.customer_acquisition_rate,
        icon: Users,
        priority: 'medium'
      });
    } else {
      insights.push({
        id: 'customer-acquisition-low',
        type: 'warning',
        title: 'Low Customer Acquisition',
        description: `Customer acquisition rate is ${data.customers.customer_acquisition_rate.toFixed(1)}%`,
        metric: `${data.customers.customer_acquisition_rate.toFixed(1)}%`,
        change: data.customers.customer_acquisition_rate,
        icon: AlertTriangle,
        priority: 'medium'
      });
    }

    // Order insights
    if (data.orders.order_completion_rate > 90) {
      insights.push({
        id: 'order-completion',
        type: 'positive',
        title: 'Excellent Order Completion',
        description: `Order completion rate is ${data.orders.order_completion_rate.toFixed(1)}%`,
        metric: `${data.orders.order_completion_rate.toFixed(1)}%`,
        change: data.orders.order_completion_rate,
        icon: CheckCircle,
        priority: 'medium'
      });
    } else {
      insights.push({
        id: 'order-completion-low',
        type: 'warning',
        title: 'Order Completion Needs Improvement',
        description: `Order completion rate is ${data.orders.order_completion_rate.toFixed(1)}%`,
        metric: `${data.orders.order_completion_rate.toFixed(1)}%`,
        change: data.orders.order_completion_rate,
        icon: AlertTriangle,
        priority: 'high'
      });
    }

    // Product insights
    if (data.products.low_stock_products.length > 0) {
      insights.push({
        id: 'low-stock',
        type: 'warning',
        title: 'Low Stock Alert',
        description: `${data.products.low_stock_products.length} products need restocking`,
        metric: `${data.products.low_stock_products.length} products`,
        change: data.products.low_stock_products.length,
        icon: Package,
        priority: 'high'
      });
    }

    return insights;
  };

  // Generate recommendations based on insights
  const generateRecommendations = (): Recommendation[] => {
    const recommendations: Recommendation[] = [];

    // Revenue recommendations
    if (data.revenue.revenue_growth_rate < 5) {
      recommendations.push({
        id: 'revenue-optimization',
        category: 'revenue',
        title: 'Revenue Optimization',
        description: 'Implement pricing strategies and product bundling to increase average order value',
        impact: 'high',
        effort: 'medium',
        estimatedValue: '15-25% revenue increase',
        icon: DollarSign
      });
    }

    // Customer recommendations
    if (data.customers.customer_acquisition_rate < 10) {
      recommendations.push({
        id: 'customer-acquisition',
        category: 'marketing',
        title: 'Customer Acquisition Campaign',
        description: 'Launch targeted marketing campaigns to increase customer acquisition rate',
        impact: 'high',
        effort: 'high',
        estimatedValue: '20-30% new customers',
        icon: Users
      });
    }

    // Operational recommendations
    if (data.orders.order_completion_rate < 90) {
      recommendations.push({
        id: 'order-processing',
        category: 'operations',
        title: 'Order Processing Optimization',
        description: 'Streamline order processing workflow to improve completion rates',
        impact: 'medium',
        effort: 'medium',
        estimatedValue: '10-15% efficiency gain',
        icon: Activity
      });
    }

    // Product recommendations
    if (data.products.low_stock_products.length > 0) {
      recommendations.push({
        id: 'inventory-management',
        category: 'operations',
        title: 'Inventory Management',
        description: 'Implement automated inventory alerts and reorder points',
        impact: 'medium',
        effort: 'low',
        estimatedValue: 'Prevent stockouts',
        icon: Package
      });
    }

    return recommendations;
  };

  const insights = generateInsights();
  const recommendations = generateRecommendations();

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'positive': return 'text-green-600 bg-green-50 border-green-200';
      case 'negative': return 'text-red-600 bg-red-50 border-red-200';
      case 'warning': return 'text-orange-600 bg-orange-50 border-orange-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRecommendationColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'border-l-4 border-l-red-500';
      case 'medium': return 'border-l-4 border-l-orange-500';
      case 'low': return 'border-l-4 border-l-green-500';
      default: return '';
    }
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <ArrowUp className="h-4 w-4 text-green-600" />;
    if (change < 0) return <ArrowDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-600" />;
  };

  return (
    <div className="space-y-6">
      {/* Business Intelligence Header */}
      <div className="bg-gradient-to-r from-apex-red to-orange-500 rounded-2xl p-6 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <Lightbulb className="h-8 w-8" />
          <div>
            <h2 className="text-2xl font-bold">Business Intelligence</h2>
            <p className="text-apex-red-100">AI-powered insights and strategic recommendations</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span className="font-medium">Key Insights</span>
            </div>
            <p className="text-2xl font-bold mt-2">{insights.length}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span className="font-medium">Recommendations</span>
            </div>
            <p className="text-2xl font-bold mt-2">{recommendations.length}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span className="font-medium">Growth Potential</span>
            </div>
            <p className="text-2xl font-bold mt-2">+{data.revenue.revenue_growth_rate > 0 ? data.revenue.revenue_growth_rate.toFixed(1) : '0'}%</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Key Insights */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Key Insights</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Live Analysis</span>
            </div>
          </div>

          <div className="space-y-4">
            {insights.map((insight) => {
              const Icon = insight.icon;
              return (
                <div
                  key={insight.id}
                  className={`p-4 rounded-lg border ${getInsightColor(insight.type)} cursor-pointer transition-all hover:shadow-md ${
                    selectedInsight === insight.id ? 'ring-2 ring-apex-red' : ''
                  }`}
                  onClick={() => setSelectedInsight(selectedInsight === insight.id ? null : insight.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Icon className="h-5 w-5" />
                      <div>
                        <h4 className="font-medium">{insight.title}</h4>
                        <p className="text-sm opacity-90">{insight.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold">{insight.metric}</span>
                      {getChangeIcon(insight.change)}
                    </div>
                  </div>

                  {selectedInsight === insight.id && (
                    <div className="mt-4 pt-4 border-t border-current/20">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Priority:</span>
                          <span className="ml-2 capitalize">{insight.priority}</span>
                        </div>
                        <div>
                          <span className="font-medium">Change:</span>
                          <span className="ml-2">{insight.change > 0 ? '+' : ''}{insight.change.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Strategic Recommendations */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Strategic Recommendations</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">AI Generated</span>
            </div>
          </div>

          <div className="space-y-4">
            {recommendations.map((recommendation) => {
              const Icon = recommendation.icon;
              return (
                <div
                  key={recommendation.id}
                  className={`bg-white rounded-lg border border-gray-200 p-4 ${getRecommendationColor(recommendation.impact)} cursor-pointer transition-all hover:shadow-md ${
                    selectedRecommendation === recommendation.id ? 'ring-2 ring-apex-red' : ''
                  }`}
                  onClick={() => setSelectedRecommendation(selectedRecommendation === recommendation.id ? null : recommendation.id)}
                >
                  <div className="flex items-start space-x-3">
                    <Icon className="h-5 w-5 text-apex-red mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{recommendation.title}</h4>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            recommendation.impact === 'high' ? 'bg-red-100 text-red-700' :
                            recommendation.impact === 'medium' ? 'bg-orange-100 text-orange-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {recommendation.impact} impact
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            recommendation.effort === 'high' ? 'bg-red-100 text-red-700' :
                            recommendation.effort === 'medium' ? 'bg-orange-100 text-orange-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {recommendation.effort} effort
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{recommendation.description}</p>

                      {selectedRecommendation === recommendation.id && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">Estimated Value:</span>
                            <span className="text-apex-red font-semibold">{recommendation.estimatedValue}</span>
                          </div>
                          <div className="mt-2">
                            <Button size="sm" className="bg-apex-red hover:bg-apex-red/90 text-white">
                              Implement Strategy
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Action Items Summary */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Action Items Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span className="font-medium text-red-900">High Priority</span>
            </div>
            <p className="text-sm text-red-700">
              {insights.filter(i => i.priority === 'high').length} items require immediate attention
            </p>
          </div>
          <div className="bg-orange-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="h-5 w-5 text-orange-600" />
              <span className="font-medium text-orange-900">Medium Priority</span>
            </div>
            <p className="text-sm text-orange-700">
              {insights.filter(i => i.priority === 'medium').length} items for strategic planning
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-900">Low Priority</span>
            </div>
            <p className="text-sm text-green-700">
              {insights.filter(i => i.priority === 'low').length} items for optimization
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessIntelligence;