"use client";

import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { TrendingUp, Calendar, Target, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { TrendAnalytics, SeasonalPattern } from '@/types/analytics';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface PredictiveAnalyticsProps {
  data: TrendAnalytics;
}

type ForecastPeriod = '30d' | '90d' | '180d' | '1y';

const PredictiveAnalytics: React.FC<PredictiveAnalyticsProps> = ({ data }) => {
  const [forecastPeriod, setForecastPeriod] = useState<ForecastPeriod>('90d');
  const [selectedMetric, setSelectedMetric] = useState<'revenue' | 'orders' | 'customers'>('revenue');

  // Generate forecast data based on trends
  const generateForecast = (metric: 'revenue' | 'orders' | 'customers', period: ForecastPeriod) => {
    const periods = {
      '30d': 30,
      '90d': 90,
      '180d': 180,
      '1y': 365
    };

    const days = periods[period];
    const currentValue = data.growth_forecast[metric];
    const trend = data[`${metric === 'orders' ? 'order' : metric}_trend`];

    // Generate forecast points
    const forecastData = [];
    const labels = [];

    for (let i = 0; i < days; i += Math.ceil(days / 12)) {
      const growthRate = trend === 'increasing' ? 0.02 : trend === 'decreasing' ? -0.01 : 0;
      const forecastValue = currentValue * (1 + (growthRate * i / 30));
      forecastData.push(forecastValue);

      const date = new Date();
      date.setDate(date.getDate() + i);
      labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    }

    return { labels, data: forecastData };
  };

  const forecast = generateForecast(selectedMetric, forecastPeriod);

  const chartData = {
    labels: forecast.labels,
    datasets: [
      {
        label: 'Historical',
        data: forecast.data.slice(0, Math.floor(forecast.data.length * 0.7)),
        borderColor: '#e11d48',
        backgroundColor: 'rgba(225, 29, 72, 0.1)',
        borderWidth: 2,
        fill: false,
        tension: 0.4,
      },
      {
        label: 'Forecast',
        data: forecast.data.slice(Math.floor(forecast.data.length * 0.7)),
        borderColor: '#facc15',
        backgroundColor: 'rgba(250, 204, 21, 0.1)',
        borderWidth: 2,
        borderDash: [5, 5],
        fill: false,
        tension: 0.4,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
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
            if (selectedMetric === 'revenue') {
              return `${context.dataset.label}: R${context.parsed.y.toLocaleString()}`;
            } else {
              return `${context.dataset.label}: ${Math.round(context.parsed.y).toLocaleString()}`;
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
            if (selectedMetric === 'revenue') {
              return `R${value.toLocaleString()}`;
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

  const getTrendInsights = () => {
    const insights = {
      revenue: {
        trend: data.revenue_trend,
        forecast: data.growth_forecast.revenue,
        description: 'Revenue growth and forecasting'
      },
      orders: {
        trend: data.order_trend,
        forecast: data.growth_forecast.orders,
        description: 'Order volume predictions'
      },
      customers: {
        trend: data.customer_trend,
        forecast: data.growth_forecast.customers,
        description: 'Customer acquisition forecasts'
      }
    };

    return insights[selectedMetric];
  };

  const insights = getTrendInsights();

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return 'text-green-600';
      case 'decreasing':
        return 'text-red-600';
      default:
        return 'text-yellow-600';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'decreasing':
        return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />;
      default:
        return <Target className="h-4 w-4 text-yellow-600" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Predictive Analytics</h3>
          <p className="text-sm text-gray-600">Trend forecasting and growth predictions</p>
        </div>
        <div className="flex items-center space-x-2">
          <Target className="h-5 w-5 text-apex-red" />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex space-x-2">
          {(['revenue', 'orders', 'customers'] as const).map((metric) => (
            <Button
              key={metric}
              variant={selectedMetric === metric ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedMetric(metric)}
              className={selectedMetric === metric ? 'bg-apex-red hover:bg-apex-red/90' : ''}
            >
              {metric.charAt(0).toUpperCase() + metric.slice(1)}
            </Button>
          ))}
        </div>
        <div className="flex space-x-2">
          {(['30d', '90d', '180d', '1y'] as ForecastPeriod[]).map((period) => (
            <Button
              key={period}
              variant={forecastPeriod === period ? 'default' : 'outline'}
              size="sm"
              onClick={() => setForecastPeriod(period)}
              className={forecastPeriod === period ? 'bg-apex-gold hover:bg-apex-gold/90 text-white' : ''}
            >
              {period}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Forecast Chart */}
        <div className="lg:col-span-2">
          <div className="h-80">
            <Line data={chartData} options={options} />
          </div>
        </div>

        {/* Insights Panel */}
        <div className="space-y-4">
          {/* Trend Analysis */}
          <div className="p-4 bg-gradient-to-r from-apex-red/10 to-apex-gold/10 rounded-lg">
            <h4 className="text-md font-semibold text-gray-900 mb-3">Trend Analysis</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Current Trend:</span>
                <div className="flex items-center space-x-1">
                  {getTrendIcon(insights.trend)}
                  <span className={`text-sm font-medium ${getTrendColor(insights.trend)}`}>
                    {insights.trend.charAt(0).toUpperCase() + insights.trend.slice(1)}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Forecast Value:</span>
                <span className="text-sm font-semibold text-gray-900">
                  {selectedMetric === 'revenue'
                    ? `R${insights.forecast.toLocaleString()}`
                    : Math.round(insights.forecast).toLocaleString()
                  }
                </span>
              </div>
            </div>
          </div>

          {/* Growth Forecast */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-md font-semibold text-gray-900 mb-3">Growth Forecast</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Revenue Growth:</span>
                <span className="font-semibold text-green-600">+{((data.growth_forecast.revenue / 1000) * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Order Growth:</span>
                <span className="font-semibold text-blue-600">+{((data.growth_forecast.orders / 100) * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Customer Growth:</span>
                <span className="font-semibold text-purple-600">+{((data.growth_forecast.customers / 100) * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* Seasonal Patterns */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="text-md font-semibold text-gray-900 mb-3">Seasonal Patterns</h4>
            <div className="space-y-2">
              {data.seasonal_patterns.slice(0, 3).map((pattern, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">{pattern.period}</span>
                  <div className="flex items-center space-x-1">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      pattern.pattern_type === 'peak' ? 'bg-green-100 text-green-700' :
                      pattern.pattern_type === 'valley' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {pattern.pattern_type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Key Insights */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
        <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
          <AlertCircle className="h-4 w-4 mr-2 text-blue-600" />
          Predictive Insights
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h5 className="font-medium text-gray-900 mb-2">Growth Opportunities</h5>
            <ul className="space-y-1 text-gray-600">
              <li>• Revenue expected to grow by {((data.growth_forecast.revenue / 1000) * 100).toFixed(1)}%</li>
              <li>• Customer base projected to expand by {((data.growth_forecast.customers / 100) * 100).toFixed(1)}%</li>
              <li>• Order volume forecast: +{((data.growth_forecast.orders / 100) * 100).toFixed(1)}%</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-gray-900 mb-2">Strategic Recommendations</h5>
            <ul className="space-y-1 text-gray-600">
              <li>• Focus on {insights.trend === 'increasing' ? 'maintaining' : 'improving'} {selectedMetric} trends</li>
              <li>• Prepare for seasonal {data.seasonal_patterns[0]?.pattern_type || 'normal'} periods</li>
              <li>• Optimize inventory for forecasted demand</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictiveAnalytics;