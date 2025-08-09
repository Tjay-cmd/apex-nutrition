"use client";

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import type { TimeSeriesData } from '@/types/analytics';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface OrderTrendsChartProps {
  data: TimeSeriesData[];
}

const OrderTrendsChart: React.FC<OrderTrendsChartProps> = ({ data }) => {
  const safeData = Array.isArray(data) ? data.filter(d => d && typeof d.value === 'number' && !isNaN(d.value)) : [];
  const chartData = {
    labels: safeData.map(item => {
      const date = new Date(item.date);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }),
    datasets: [
      {
        label: 'Orders',
        data: safeData.map(item => item.value),
        backgroundColor: '#facc15',
        borderColor: '#e11d48',
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
        borderColor: '#facc15',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          label: function(context: any) {
            const y = context?.parsed?.y ?? 0;
            return `Orders: ${Number(y).toLocaleString()}`;
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
            size: 12
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
          stepSize: 1
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index' as const
    }
  };

  return (
    <div className="h-64">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default OrderTrendsChart;