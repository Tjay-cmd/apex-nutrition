"use client";

import React, { useState } from 'react';
import {
  Chart as ChartJS,
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
import { Bar, Line } from 'react-chartjs-2';
import { Package, TrendingUp, AlertTriangle, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ProductAnalytics, ProductRanking, ProductStock } from '@/types/analytics';

ChartJS.register(
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

interface ProductPerformanceProps {
  data: ProductAnalytics;
}

type PerformanceMetric = 'revenue' | 'sales' | 'rating' | 'inventory';

const ProductPerformance: React.FC<ProductPerformanceProps> = ({ data }) => {
  const [activeMetric, setActiveMetric] = useState<PerformanceMetric>('revenue');
  const [showLowStock, setShowLowStock] = useState(false);

  const getPerformanceData = () => {
    const topProducts = data.top_products.slice(0, 8);

    const metricMap = {
      revenue: {
        label: 'Revenue Generated',
        data: topProducts.map(p => p.revenue_generated),
        color: '#e11d48'
      },
      sales: {
        label: 'Units Sold',
        data: topProducts.map(p => p.total_sold),
        color: '#facc15'
      },
      rating: {
        label: 'Average Rating',
        data: topProducts.map(p => p.average_rating),
        color: '#10b981'
      },
      inventory: {
        label: 'Stock Level',
        data: topProducts.map(p => {
          const stockProduct = data.low_stock_products.find(sp => sp.product_id === p.product_id);
          return stockProduct ? stockProduct.current_stock : 0;
        }),
        color: '#6b7280'
      }
    };

    return metricMap[activeMetric];
  };

  const performanceData = getPerformanceData();

  const chartData = {
    labels: data.top_products.slice(0, 8).map(product =>
      product.product_name.length > 15
        ? product.product_name.substring(0, 15) + '...'
        : product.product_name
    ),
    datasets: [
      {
        label: performanceData.label,
        data: performanceData.data,
        backgroundColor: performanceData.color,
        borderColor: performanceData.color + '80',
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#e11d48',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: function(context: any) {
            const productIndex = context[0].dataIndex;
            return data.top_products[productIndex].product_name;
          },
          label: function(context: any) {
            if (activeMetric === 'revenue') {
              return `Revenue: R${context.parsed.y.toLocaleString()}`;
            } else if (activeMetric === 'sales') {
              return `Units Sold: ${context.parsed.y}`;
            } else if (activeMetric === 'rating') {
              return `Rating: ${context.parsed.y.toFixed(1)}/5`;
            } else {
              return `Stock: ${context.parsed.y} units`;
            }
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 11
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(107, 114, 128, 0.1)'
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 12
          },
          callback: function(value: any) {
            if (activeMetric === 'revenue') {
              return `R${value.toLocaleString()}`;
            } else if (activeMetric === 'rating') {
              return value.toFixed(1);
            } else {
              return value.toLocaleString();
            }
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index' as const
    }
  };

  const getCategoryPerformance = () => {
    const categories = Object.entries(data.products_by_category);
    return categories
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([category, count]) => ({
        category,
        count,
        percentage: ((count / data.total_products) * 100).toFixed(1)
      }));
  };

  const categoryPerformance = getCategoryPerformance();

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Product Performance</h3>
          <p className="text-sm text-gray-600">Advanced product analytics and insights</p>
        </div>
        <div className="flex items-center space-x-2">
          <Package className="h-5 w-5 text-apex-red" />
        </div>
      </div>

      {/* Performance Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex space-x-2">
          {(['revenue', 'sales', 'rating', 'inventory'] as PerformanceMetric[]).map((metric) => (
            <Button
              key={metric}
              variant={activeMetric === metric ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveMetric(metric)}
              className={activeMetric === metric ? 'bg-apex-red hover:bg-apex-red/90' : ''}
            >
              {metric.charAt(0).toUpperCase() + metric.slice(1)}
            </Button>
          ))}
        </div>
        <Button
          variant={showLowStock ? 'default' : 'outline'}
          size="sm"
          onClick={() => setShowLowStock(!showLowStock)}
          className={showLowStock ? 'bg-orange-500 hover:bg-orange-600' : ''}
        >
          <AlertTriangle className="h-4 w-4 mr-2" />
          Low Stock
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2">
          <div className="h-80">
            <Bar data={chartData} options={options} />
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="space-y-4">
          {/* Summary Stats */}
          <div className="p-4 bg-gradient-to-r from-apex-red/10 to-apex-gold/10 rounded-lg">
            <h4 className="text-md font-semibold text-gray-900 mb-3">Performance Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Products:</span>
                <span className="font-semibold">{data.total_products}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Top Performers:</span>
                <span className="font-semibold">{data.top_products.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Low Stock Items:</span>
                <span className="font-semibold text-orange-600">{data.low_stock_products.length}</span>
              </div>
            </div>
          </div>

          {/* Category Performance */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-md font-semibold text-gray-900 mb-3">Category Distribution</h4>
            <div className="space-y-2">
              {categoryPerformance.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{category.category}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-apex-red h-2 rounded-full"
                        style={{ width: `${category.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium text-gray-700">{category.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Low Stock Alert */}
          {showLowStock && data.low_stock_products.length > 0 && (
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <h4 className="text-md font-semibold text-orange-800 mb-3 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Low Stock Alert
              </h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {data.low_stock_products.slice(0, 5).map((product, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700 truncate">{product.product_name}</span>
                    <span className="text-orange-600 font-semibold">{product.current_stock}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Top Products Table */}
      <div className="mt-6">
        <h4 className="text-md font-semibold text-gray-900 mb-3">Top Performing Products</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 font-medium text-gray-700">Product</th>
                <th className="text-right py-2 font-medium text-gray-700">Revenue</th>
                <th className="text-right py-2 font-medium text-gray-700">Units Sold</th>
                <th className="text-right py-2 font-medium text-gray-700">Rating</th>
                <th className="text-right py-2 font-medium text-gray-700">Category</th>
              </tr>
            </thead>
            <tbody>
              {data.top_products.slice(0, 5).map((product, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2 text-gray-900">{product.product_name}</td>
                  <td className="py-2 text-right font-medium text-green-600">
                    R{product.revenue_generated.toLocaleString()}
                  </td>
                  <td className="py-2 text-right text-gray-700">{product.total_sold}</td>
                  <td className="py-2 text-right">
                    <div className="flex items-center justify-end">
                      <Star className="h-3 w-3 text-yellow-500 mr-1" />
                      <span className="text-gray-700">{product.average_rating.toFixed(1)}</span>
                    </div>
                  </td>
                  <td className="py-2 text-right text-gray-600">{product.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductPerformance;