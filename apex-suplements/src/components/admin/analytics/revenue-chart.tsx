"use client";

import React from 'react';
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
import type { TimeSeriesData } from '@/types/analytics';

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

interface RevenueChartProps {
  data: TimeSeriesData[];
}

const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  const safeData = Array.isArray(data) ? data.filter(d => d && typeof d.value === 'number' && !isNaN(d.value)) : [];
  const chartData = {
    labels: safeData.map(item => {
      const date = new Date(item.date);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }),
    datasets: [
      {
        label: 'Revenue',
        data: safeData.map(item => item.value),
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
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          label: function(context: any) {
            const y = context?.parsed?.y ?? 0;
            return `Revenue: R${Number(y).toLocaleString()}`;
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
          callback: function(value: any) {
            const v = Number(value ?? 0);
            return `R${v.toLocaleString()}`;
          }
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
      <Line data={chartData} options={options} />
    </div>
  );
};

export default RevenueChart;