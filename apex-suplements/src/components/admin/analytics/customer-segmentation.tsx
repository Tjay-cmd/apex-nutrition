"use client";

import React, { useState } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import { Users, TrendingUp, DollarSign, Calendar, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CustomerAnalytics, CustomerRanking } from '@/types/analytics';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface CustomerSegmentationProps {
  data: CustomerAnalytics;
}

type SegmentType = 'spending' | 'frequency' | 'recency' | 'loyalty';

const CustomerSegmentation: React.FC<CustomerSegmentationProps> = ({ data }) => {
  const [activeSegment, setActiveSegment] = useState<SegmentType>('spending');
  const [selectedTimeframe, setSelectedTimeframe] = useState<'30d' | '90d' | '1y'>('30d');

  // Customer segmentation logic
  const segmentCustomers = (customers: CustomerRanking[]) => {
    const segments = {
      spending: {
        high: customers.filter(c => c.total_spent >= 5000),
        medium: customers.filter(c => c.total_spent >= 1000 && c.total_spent < 5000),
        low: customers.filter(c => c.total_spent < 1000)
      },
      frequency: {
        frequent: customers.filter(c => c.total_orders >= 5),
        regular: customers.filter(c => c.total_orders >= 2 && c.total_orders < 5),
        occasional: customers.filter(c => c.total_orders === 1)
      },
      recency: {
        active: customers.filter(c => {
          const daysSinceLastOrder = Math.floor((Date.now() - new Date(c.last_order_date).getTime()) / (1000 * 60 * 60 * 24));
          return daysSinceLastOrder <= 30;
        }),
        recent: customers.filter(c => {
          const daysSinceLastOrder = Math.floor((Date.now() - new Date(c.last_order_date).getTime()) / (1000 * 60 * 60 * 24));
          return daysSinceLastOrder > 30 && daysSinceLastOrder <= 90;
        }),
        inactive: customers.filter(c => {
          const daysSinceLastOrder = Math.floor((Date.now() - new Date(c.last_order_date).getTime()) / (1000 * 60 * 60 * 24));
          return daysSinceLastOrder > 90;
        })
      },
      loyalty: {
        vip: customers.filter(c => c.total_spent >= 10000 || c.total_orders >= 10),
        loyal: customers.filter(c => (c.total_spent >= 2000 && c.total_spent < 10000) || (c.total_orders >= 3 && c.total_orders < 10)),
        standard: customers.filter(c => c.total_spent < 2000 && c.total_orders < 3)
      }
    };

    return segments;
  };

  const segments = segmentCustomers(data.top_customers);

  const getSegmentData = () => {
    const segmentMap = {
      spending: {
        labels: ['High Spenders', 'Medium Spenders', 'Low Spenders'],
        data: [
          segments.spending.high.length,
          segments.spending.medium.length,
          segments.spending.low.length
        ],
        colors: ['#e11d48', '#facc15', '#6b7280']
      },
      frequency: {
        labels: ['Frequent', 'Regular', 'Occasional'],
        data: [
          segments.frequency.frequent.length,
          segments.frequency.regular.length,
          segments.frequency.occasional.length
        ],
        colors: ['#e11d48', '#facc15', '#6b7280']
      },
      recency: {
        labels: ['Active', 'Recent', 'Inactive'],
        data: [
          segments.recency.active.length,
          segments.recency.recent.length,
          segments.recency.inactive.length
        ],
        colors: ['#10b981', '#f59e0b', '#ef4444']
      },
      loyalty: {
        labels: ['VIP', 'Loyal', 'Standard'],
        data: [
          segments.loyalty.vip.length,
          segments.loyalty.loyal.length,
          segments.loyalty.standard.length
        ],
        colors: ['#e11d48', '#facc15', '#6b7280']
      }
    };

    return segmentMap[activeSegment];
  };

  const segmentData = getSegmentData();

  const chartData = {
    labels: segmentData.labels,
    datasets: [
      {
        data: segmentData.data,
        backgroundColor: segmentData.colors,
        borderColor: segmentData.colors.map(color => color + '80'),
        borderWidth: 2,
        hoverOffset: 4
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#e11d48',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function(context: any) {
            const total = segmentData.data.reduce((sum: number, val: number) => sum + val, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          }
        }
      }
    }
  };

  const getSegmentInsights = () => {
    const insights = {
      spending: {
        title: 'Spending Patterns',
        description: 'Customer segments based on total spending',
        metrics: [
          { label: 'High Spenders', value: segments.spending.high.length, color: 'text-red-600' },
          { label: 'Medium Spenders', value: segments.spending.medium.length, color: 'text-yellow-600' },
          { label: 'Low Spenders', value: segments.spending.low.length, color: 'text-gray-600' }
        ]
      },
      frequency: {
        title: 'Purchase Frequency',
        description: 'Customer segments based on order frequency',
        metrics: [
          { label: 'Frequent Buyers', value: segments.frequency.frequent.length, color: 'text-red-600' },
          { label: 'Regular Buyers', value: segments.frequency.regular.length, color: 'text-yellow-600' },
          { label: 'Occasional Buyers', value: segments.frequency.occasional.length, color: 'text-gray-600' }
        ]
      },
      recency: {
        title: 'Customer Recency',
        description: 'Customer segments based on last purchase',
        metrics: [
          { label: 'Active Customers', value: segments.recency.active.length, color: 'text-green-600' },
          { label: 'Recent Customers', value: segments.recency.recent.length, color: 'text-yellow-600' },
          { label: 'Inactive Customers', value: segments.recency.inactive.length, color: 'text-red-600' }
        ]
      },
      loyalty: {
        title: 'Customer Loyalty',
        description: 'Customer segments based on loyalty metrics',
        metrics: [
          { label: 'VIP Customers', value: segments.loyalty.vip.length, color: 'text-red-600' },
          { label: 'Loyal Customers', value: segments.loyalty.loyal.length, color: 'text-yellow-600' },
          { label: 'Standard Customers', value: segments.loyalty.standard.length, color: 'text-gray-600' }
        ]
      }
    };

    return insights[activeSegment];
  };

  const insights = getSegmentInsights();

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Customer Segmentation</h3>
          <p className="text-sm text-gray-600">Advanced customer behavior analysis</p>
        </div>
        <div className="flex items-center space-x-2">
          <Users className="h-5 w-5 text-apex-red" />
        </div>
      </div>

      {/* Segmentation Controls */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="flex space-x-2">
          {(['spending', 'frequency', 'recency', 'loyalty'] as SegmentType[]).map((segment) => (
            <Button
              key={segment}
              variant={activeSegment === segment ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveSegment(segment)}
              className={activeSegment === segment ? 'bg-apex-red hover:bg-apex-red/90' : ''}
            >
              {segment.charAt(0).toUpperCase() + segment.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart */}
        <div className="h-80">
          <Doughnut data={chartData} options={options} />
        </div>

        {/* Insights */}
        <div className="space-y-4">
          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-2">{insights.title}</h4>
            <p className="text-sm text-gray-600 mb-4">{insights.description}</p>
          </div>

          <div className="space-y-3">
            {insights.metrics.map((metric, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">{metric.label}</span>
                <span className={`text-lg font-bold ${metric.color}`}>{metric.value}</span>
              </div>
            ))}
          </div>

          {/* Key Metrics */}
          <div className="mt-6 p-4 bg-gradient-to-r from-apex-red/10 to-apex-gold/10 rounded-lg">
            <h5 className="text-sm font-semibold text-gray-900 mb-2">Key Insights</h5>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• Total customers analyzed: {data.top_customers.length}</p>
              <p>• Average customer value: R{data.average_customer_value.toLocaleString()}</p>
              <p>• Customer acquisition rate: {data.customer_acquisition_rate.toFixed(1)}%</p>
              <p>• Customer retention rate: {data.customer_retention_rate.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerSegmentation;