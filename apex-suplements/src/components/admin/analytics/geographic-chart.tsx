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
import type { GeographicAnalytics } from '@/types/analytics';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface GeographicChartProps {
  data: GeographicAnalytics;
}

const GeographicChart: React.FC<GeographicChartProps> = ({ data }) => {
  // Take top 5 regions for better visualization
  const topRegions = data.top_regions.slice(0, 5);

  const chartData = {
    labels: topRegions.map(region => region.region),
    datasets: [
      {
        label: 'Orders',
        data: topRegions.map(region => region.orders),
        backgroundColor: '#e11d48',
        borderColor: '#be123c',
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false,
        yAxisID: 'y'
      },
      {
        label: 'Revenue',
        data: topRegions.map(region => region.revenue),
        backgroundColor: '#facc15',
        borderColor: '#eab308',
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false,
        yAxisID: 'y1'
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
            if (context.dataset.label === 'Revenue') {
              return `Revenue: R${context.parsed.y.toLocaleString()}`;
            }
            return `Orders: ${context.parsed.y}`;
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
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
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
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        grid: {
          drawOnChartArea: false,
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
    }
  };

  return (
    <div className="h-64">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default GeographicChart;