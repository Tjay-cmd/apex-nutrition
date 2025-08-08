"use client";

import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import type { CustomerAnalytics } from '@/types/analytics';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

interface CustomerAnalyticsChartProps {
  data: CustomerAnalytics;
}

const CustomerAnalyticsChart: React.FC<CustomerAnalyticsChartProps> = ({ data }) => {
  const chartData = {
    labels: ['New Customers', 'Returning Customers'],
    datasets: [
      {
        data: [data.new_customers, data.returning_customers],
        backgroundColor: [
          '#e11d48',
          '#facc15'
        ],
        borderColor: [
          '#be123c',
          '#eab308'
        ],
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
            const total = data.new_customers + data.returning_customers;
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <div className="h-64">
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

export default CustomerAnalyticsChart;