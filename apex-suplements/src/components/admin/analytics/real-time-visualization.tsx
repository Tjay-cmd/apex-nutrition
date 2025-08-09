"use client";

import React, { useState, useEffect, useRef } from 'react';
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
import {
  Activity,
  Wifi,
  WifiOff,
  Play,
  Pause,
  RotateCcw,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { TimeSeriesData, RealTimeMetrics } from '@/types/analytics';

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

interface RealTimeVisualizationProps {
  title: string;
  description: string;
  data: TimeSeriesData[];
  realTimeMetrics: RealTimeMetrics;
  onDataUpdate?: (newData: TimeSeriesData[]) => void;
  updateInterval?: number;
  maxDataPoints?: number;
}

const RealTimeVisualization: React.FC<RealTimeVisualizationProps> = ({
  title,
  description,
  data,
  realTimeMetrics,
  onDataUpdate,
  updateInterval = 15000,
  maxDataPoints = 50
}) => {
  const [isLive, setIsLive] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const [currentData, setCurrentData] = useState<TimeSeriesData[]>(data);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [updateCount, setUpdateCount] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Simulate real-time data updates
  useEffect(() => {
    if (!isLive || updateInterval === 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      // Simulate new data point
      const newDataPoint: TimeSeriesData = {
        date: new Date().toISOString(),
        value: Math.random() * 1000 + 500, // Simulate revenue between 500-1500
        label: new Date().toLocaleTimeString()
      };

      setCurrentData(prevData => {
        const updatedData = [...prevData, newDataPoint];
        // Keep only the last maxDataPoints
        if (updatedData.length > maxDataPoints) {
          return updatedData.slice(-maxDataPoints);
        }
        return updatedData;
      });

      setLastUpdate(new Date());
      setUpdateCount(prev => prev + 1);

      // Notify parent component
      if (onDataUpdate) {
        onDataUpdate(currentData);
      }
    }, updateInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isLive, updateInterval, maxDataPoints, onDataUpdate]);

  // Simulate connection status changes
  useEffect(() => {
    const connectionInterval = setInterval(() => {
      // Simulate occasional connection issues
      if (Math.random() < 0.1) {
        setIsConnected(false);
        setTimeout(() => setIsConnected(true), 2000);
      }
    }, 30000);

    return () => clearInterval(connectionInterval);
  }, []);

  const chartData = {
    labels: currentData.map(item => {
      const date = new Date(item.date);
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    }),
    datasets: [
      {
        label: 'Real-time Revenue',
        data: currentData.map(item => item.value),
        borderColor: '#e11d48',
        backgroundColor: 'rgba(225, 29, 72, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#e11d48',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
        animation: false
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
          label: function(context: any) {
            return `Revenue: R${context.parsed.y.toLocaleString()}`;
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
            size: 10
          },
          maxTicksLimit: 8
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
            return `R${value.toLocaleString()}`;
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index' as const
    },
    animation: false
  };

  const handleToggleLive = () => {
    setIsLive(!isLive);
  };

  const handleReset = () => {
    setCurrentData(data);
    setUpdateCount(0);
    setLastUpdate(new Date());
  };

  const getConnectionStatus = () => {
    if (!isConnected) {
      return {
        icon: <WifiOff className="h-4 w-4 text-red-500" />,
        text: 'Disconnected',
        color: 'text-red-500'
      };
    }
    return {
      icon: <Wifi className="h-4 w-4 text-green-500" />,
      text: 'Connected',
      color: 'text-green-500'
    };
  };

  const connectionStatus = getConnectionStatus();

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {isLive && (
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-600">Live</span>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Connection Status */}
          <div className="flex items-center space-x-1 px-3 py-1 bg-gray-50 rounded-lg">
            {connectionStatus.icon}
            <span className={`text-xs font-medium ${connectionStatus.color}`}>
              {connectionStatus.text}
            </span>
          </div>

          {/* Live Toggle */}
          <Button
            variant={isLive ? 'default' : 'outline'}
            size="sm"
            onClick={handleToggleLive}
            className={isLive ? 'bg-green-600 hover:bg-green-700' : ''}
          >
            {isLive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>

          {/* Reset Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="text-gray-600 hover:text-gray-800"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Current Revenue</p>
              <p className="text-lg font-bold text-gray-900">
                R{realTimeMetrics.today_revenue.toLocaleString()}
              </p>
            </div>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
        </div>

        <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Today's Orders</p>
              <p className="text-lg font-bold text-gray-900">
                {realTimeMetrics.today_orders}
              </p>
            </div>
            <Activity className="h-5 w-5 text-blue-600" />
          </div>
        </div>

        <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Pending Orders</p>
              <p className="text-lg font-bold text-gray-900">
                {realTimeMetrics.pending_orders}
              </p>
            </div>
            <AlertCircle className="h-5 w-5 text-purple-600" />
          </div>
        </div>

        <div className="p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Updates</p>
              <p className="text-lg font-bold text-gray-900">
                {updateCount}
              </p>
            </div>
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-80 mb-4">
        <Line data={chartData} options={options} />
      </div>

      {/* Footer Stats */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center space-x-4">
          <span>Last update: {lastUpdate.toLocaleTimeString()}</span>
          <span>Data points: {currentData.length}</span>
          <span>Update interval: {updateInterval / 1000}s</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs">Live updates: {isLive ? 'ON' : 'OFF'}</span>
        </div>
      </div>
    </div>
  );
};

export default RealTimeVisualization;