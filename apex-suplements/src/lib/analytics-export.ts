import type { AnalyticsSummary, AnalyticsFilters, AnalyticsExport } from '@/types/analytics';

export interface ExportOptions {
  format: 'csv' | 'pdf' | 'excel';
  data: AnalyticsSummary;
  filters: AnalyticsFilters;
  includeCharts?: boolean;
  includeInsights?: boolean;
  customTitle?: string;
  customDescription?: string;
}

export interface ExportResult {
  success: boolean;
  data?: Blob;
  filename?: string;
  error?: string;
}

export class AnalyticsExportService {
  private formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(amount);
  };

  private formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  private generateCSV = (data: AnalyticsSummary, filters: AnalyticsFilters): string => {
    const rows: string[] = [];

    // Header
    rows.push('Apex Supplements - Analytics Report');
    rows.push(`Generated: ${new Date().toLocaleString('en-ZA')}`);
    rows.push('');

    // Revenue Summary
    rows.push('REVENUE SUMMARY');
    rows.push('Metric,Value');
    rows.push(`Total Revenue,${this.formatCurrency(data.revenue.total_revenue)}`);
    rows.push(`Average Order Value,${this.formatCurrency(data.revenue.average_order_value)}`);
    rows.push(`Revenue Growth Rate,${data.revenue.revenue_growth_rate.toFixed(2)}%`);
    rows.push('');

    // Revenue by Period
    rows.push('REVENUE BY PERIOD');
    rows.push('Date,Revenue');
    data.revenue.revenue_by_period.forEach(item => {
      rows.push(`${this.formatDate(item.date)},${this.formatCurrency(item.value)}`);
    });
    rows.push('');

    // Order Summary
    rows.push('ORDER SUMMARY');
    rows.push('Metric,Value');
    rows.push(`Total Orders,${data.orders.total_orders}`);
    rows.push(`Average Processing Time,${data.orders.average_processing_time} days`);
    rows.push(`Order Completion Rate,${data.orders.order_completion_rate.toFixed(2)}%`);
    rows.push('');

    // Orders by Status
    rows.push('ORDERS BY STATUS');
    rows.push('Status,Count');
    Object.entries(data.orders.orders_by_status).forEach(([status, count]) => {
      rows.push(`${status.charAt(0).toUpperCase() + status.slice(1)},${count}`);
    });
    rows.push('');

    // Customer Summary
    rows.push('CUSTOMER SUMMARY');
    rows.push('Metric,Value');
    rows.push(`Total Customers,${data.customers.total_customers}`);
    rows.push(`New Customers,${data.customers.new_customers}`);
    rows.push(`Returning Customers,${data.customers.returning_customers}`);
    rows.push(`Customer Acquisition Rate,${data.customers.customer_acquisition_rate.toFixed(2)}%`);
    rows.push(`Customer Retention Rate,${data.customers.customer_retention_rate.toFixed(2)}%`);
    rows.push('');

    // Top Customers
    rows.push('TOP CUSTOMERS');
    rows.push('Customer Name,Email,Total Orders,Total Spent,Average Order Value,Last Order');
    data.customers.top_customers.slice(0, 10).forEach(customer => {
      rows.push(`${customer.customer_name},${customer.customer_email},${customer.total_orders},${this.formatCurrency(customer.total_spent)},${this.formatCurrency(customer.average_order_value)},${this.formatDate(customer.last_order_date)}`);
    });
    rows.push('');

    // Product Summary
    rows.push('PRODUCT SUMMARY');
    rows.push('Metric,Value');
    rows.push(`Total Products,${data.products.total_products}`);
    rows.push(`Low Stock Products,${data.products.low_stock_products.length}`);
    rows.push('');

    // Top Products
    rows.push('TOP PRODUCTS');
    rows.push('Product Name,Category,Total Sold,Revenue Generated,Average Rating');
    data.products.top_products.slice(0, 10).forEach(product => {
      rows.push(`${product.product_name},${product.category},${product.total_sold},${this.formatCurrency(product.revenue_generated)},${product.average_rating.toFixed(1)}`);
    });
    rows.push('');

    // Geographic Summary
    rows.push('GEOGRAPHIC SUMMARY');
    rows.push('Region,Orders,Revenue');
    data.geography.top_regions.forEach(region => {
      rows.push(`${region.region},${region.orders},${this.formatCurrency(region.revenue)}`);
    });
    rows.push('');

    // Filters Applied
    if (Object.keys(filters).length > 0) {
      rows.push('FILTERS APPLIED');
      rows.push('Filter,Value');
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          rows.push(`${key},${value}`);
        }
      });
    }

    return rows.join('\n');
  };

  private generateExcel = async (data: AnalyticsSummary, filters: AnalyticsFilters): Promise<Blob> => {
    // For now, we'll return a CSV blob as Excel
    // In a real implementation, you'd use a library like xlsx
    const csvContent = this.generateCSV(data, filters);
    return new Blob([csvContent], { type: 'text/csv' });
  };

  private generatePDF = async (data: AnalyticsSummary, filters: AnalyticsFilters, options: ExportOptions): Promise<Blob> => {
    // For now, we'll return a text blob as PDF
    // In a real implementation, you'd use a library like jsPDF or puppeteer
    const content = this.generateCSV(data, filters);
    return new Blob([content], { type: 'application/pdf' });
  };

  public async exportData(options: ExportOptions): Promise<ExportResult> {
    try {
      const { format, data, filters, customTitle, customDescription } = options;

      let blob: Blob;
      let filename: string;

      const timestamp = new Date().toISOString().split('T')[0];
      const title = customTitle || 'Apex Supplements Analytics Report';

      switch (format) {
        case 'csv':
          const csvContent = this.generateCSV(data, filters);
          blob = new Blob([csvContent], { type: 'text/csv' });
          filename = `apex-analytics-${timestamp}.csv`;
          break;

        case 'excel':
          blob = await this.generateExcel(data, filters);
          filename = `apex-analytics-${timestamp}.xlsx`;
          break;

        case 'pdf':
          blob = await this.generatePDF(data, filters, options);
          filename = `apex-analytics-${timestamp}.pdf`;
          break;

        default:
          throw new Error(`Unsupported format: ${format}`);
      }

      return {
        success: true,
        data: blob,
        filename
      };

    } catch (error) {
      console.error('Export error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Export failed'
      };
    }
  }

  public downloadFile(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  public generateReportInsights(data: AnalyticsSummary): string[] {
    const insights: string[] = [];

    // Revenue insights
    if (data.revenue.revenue_growth_rate > 0) {
      insights.push(`Revenue is growing at ${data.revenue.revenue_growth_rate.toFixed(1)}%`);
    } else {
      insights.push(`Revenue declined by ${Math.abs(data.revenue.revenue_growth_rate).toFixed(1)}%`);
    }

    // Order insights
    if (data.orders.order_completion_rate > 90) {
      insights.push(`Excellent order completion rate of ${data.orders.order_completion_rate.toFixed(1)}%`);
    } else {
      insights.push(`Order completion rate needs improvement: ${data.orders.order_completion_rate.toFixed(1)}%`);
    }

    // Customer insights
    if (data.customers.customer_acquisition_rate > 10) {
      insights.push(`Strong customer acquisition rate of ${data.customers.customer_acquisition_rate.toFixed(1)}%`);
    } else {
      insights.push(`Customer acquisition rate is ${data.customers.customer_acquisition_rate.toFixed(1)}%`);
    }

    // Product insights
    if (data.products.low_stock_products.length > 0) {
      insights.push(`${data.products.low_stock_products.length} products need restocking`);
    }

    return insights;
  }
}

export const analyticsExportService = new AnalyticsExportService();