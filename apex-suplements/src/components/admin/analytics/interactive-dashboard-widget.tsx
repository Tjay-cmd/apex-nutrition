"use client";

import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  RefreshCw,
  Maximize2,
  Minimize2,
  Download,
  Settings,
  Eye,
  EyeOff,
  Calendar,
  TrendingUp,
  BarChart3,
  PieChart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { TimeSeriesData, ChartConfig } from '@/types/analytics';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface InteractiveDashboardWidgetProps {
  title: string;
  description: string;
  data: TimeSeriesData[] | any;
  type: 'line' | 'bar' | 'doughnut';
  config?: ChartConfig;
  onRefresh?: () => void;
  onExport?: () => void;
  realTime?: boolean;
  refreshInterval?: number;
}

const InteractiveDashboardWidget: React.FC<InteractiveDashboardWidgetProps> = ({
  title,
  description,
  data,
  type,
  config = {},
  onRefresh,
  onExport,
  realTime = false,
  refreshInterval = 30000
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showLegend, setShowLegend] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(realTime);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      handleRefresh();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  const handleRefresh = async () => {
    if (onRefresh) {
      setIsLoading(true);
      try {
        await onRefresh();
        setLastUpdated(new Date());
      } catch (error) {
        console.error('Error refreshing data:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleExport = () => {
    if (onExport) {
      onExport();
    }
  };

  const getChartData = () => {
    const baseConfig = {
      line: {
        labels: data.map((item: TimeSeriesData) => {
          const date = new Date(item.date);
          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }),
        datasets: [{
          label: title,
          data: data.map((item: TimeSeriesData) => item.value),
          borderColor: '#e11d48',
          backgroundColor: 'rgba(225, 29, 72, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#e11d48',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        }]
      },
      bar: {
        labels: data.map((item: TimeSeriesData) => {
          const date = new Date(item.date);
          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }),
        datasets: [{
          label: title,
          data: data.map((item: TimeSeriesData) => item.value),
          backgroundColor: '#facc15',
          borderColor: '#e11d48',
          borderWidth: 1,
          borderRadius: 4,
          borderSkipped: false,
        }]
      },
      doughnut: {
        labels: data.labels || [],
        datasets: [{
          data: data.data || [],
          backgroundColor: ['#e11d48', '#facc15', '#10b981', '#3b82f6', '#8b5cf6'],
          borderColor: ['#be123c', '#eab308', '#059669', '#2563eb', '#7c3aed'],
          borderWidth: 2,
          hoverOffset: 4
        }]
      }
    };

    return baseConfig[type];
  };

  const getChartOptions = () => {
    const baseOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: showLegend,
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
          displayColors: false,
          callbacks: {
            label: function(context: any) {
              if (type === 'line' || type === 'bar') {
                return `${context.dataset.label}: ${context.parsed.y.toLocaleString()}`;
              } else {
                const total = context.dataset.data.reduce((sum: number, val: number) => sum + val, 0);
                const percentage = ((context.parsed / total) * 100).toFixed(1);
                return `${context.label}: ${context.parsed} (${percentage}%)`;
              }
            }
          }
        },
        // Zoom and pan functionality removed due to Chart.js compatibility
      },
      scales: type !== 'doughnut' ? {
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
              return value.toLocaleString();
            }
          }
        }
      } : undefined,
      interaction: {
        intersect: false,
        mode: 'index' as const
      }
    };

    return { ...baseOptions, ...config };
  };

  const chartData = getChartData();
  const chartOptions = getChartOptions();

  const renderChart = () => {
    switch (type) {
      case 'line':
        return <Line data={chartData} options={chartOptions} />;
      case 'bar':
        return <Bar data={chartData} options={chartOptions} />;
      case 'doughnut':
        return <Doughnut data={chartData} options={chartOptions} />;
      default:
        return <Line data={chartData} options={chartOptions} />;
    }
  };

  return (
    <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 transition-all duration-300 ${
      isExpanded ? 'fixed inset-4 z-50 bg-white' : ''
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {autoRefresh && (
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-600">Live</span>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
          <p className="text-xs text-gray-500 mt-1">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Legend Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowLegend(!showLegend)}
            className="text-gray-600 hover:text-gray-800"
          >
            {showLegend ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </Button>

          {/* Auto Refresh Toggle */}
          {realTime && (
            <Button
              variant={autoRefresh ? 'default' : 'outline'}
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={autoRefresh ? 'bg-green-600 hover:bg-green-700' : ''}
            >
              <RefreshCw className={`h-4 w-4 ${autoRefresh ? 'animate-spin' : ''}`} />
            </Button>
          )}

          {/* Refresh Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
            className="text-gray-600 hover:text-gray-800"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>

          {/* Export Button */}
          {onExport && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="text-gray-600 hover:text-gray-800"
            >
              <Download className="h-4 w-4" />
            </Button>
          )}

          {/* Expand/Collapse Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-600 hover:text-gray-800"
          >
            {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Chart Container */}
      <div className={`p-6 ${isExpanded ? 'h-[calc(100vh-200px)]' : 'h-80'}`}>
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 border-4 border-apex-red/20 border-t-apex-red rounded-full animate-spin"></div>
              <p className="mt-2 text-sm text-gray-600">Updating data...</p>
            </div>
          </div>
        ) : (
          renderChart()
        )}
      </div>

      {/* Footer Controls */}
      <div className="flex items-center justify-between p-4 border-t border-gray-100 bg-gray-50">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-600">Chart Type:</span>
            <div className="flex space-x-1">
              {['line', 'bar', 'doughnut'].map((chartType) => (
                <Button
                  key={chartType}
                  variant={type === chartType ? 'default' : 'outline'}
                  size="sm"
                  className={type === chartType ? 'bg-apex-red hover:bg-apex-red/90' : ''}
                >
                  {chartType === 'line' && <TrendingUp className="h-3 w-3" />}
                  {chartType === 'bar' && <BarChart3 className="h-3 w-3" />}
                  {chartType === 'doughnut' && <PieChart className="h-3 w-3" />}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-600">
            {data.length || 0} data points
          </span>
        </div>
      </div>
    </div>
  );
};

export default InteractiveDashboardWidget;