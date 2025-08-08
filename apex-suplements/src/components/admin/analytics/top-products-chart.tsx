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
import type { ProductRanking } from '@/types/analytics';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface TopProductsChartProps {
  data: ProductRanking[];
}

const TopProductsChart: React.FC<TopProductsChartProps> = ({ data }) => {
  // Take top 5 products for better visualization
  const topProducts = data.slice(0, 5);

  const chartData = {
    labels: topProducts.map(product =>
      product.product_name.length > 15
        ? product.product_name.substring(0, 15) + '...'
        : product.product_name
    ),
    datasets: [
      {
        label: 'Revenue Generated',
        data: topProducts.map(product => product.revenue_generated),
        backgroundColor: '#e11d48',
        borderColor: '#be123c',
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false,
      }
    ]
  };

  const options = {
    indexAxis: 'y' as const,
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
            return topProducts[productIndex].product_name;
          },
          label: function(context: any) {
            return `Revenue: R${context.parsed.x.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      x: {
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
      },
      y: {
        grid: {
          display: false
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 11
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

export default TopProductsChart;