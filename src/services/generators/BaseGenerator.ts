/* eslint-disable @typescript-eslint/no-explicit-any */
import { NormalizedData } from './types';

export abstract class BaseGenerator {
  // Helper function to normalize data format
  protected static normalizeDataFormat(data: any): NormalizedData {
    if (data && typeof data === 'object' && !Array.isArray(data) && 'labels' in data && 'datasets' in data) {
      // Chart.js format data
      return {
        labels: data.labels,
        datasets: data.datasets
      };
    } else if (data && typeof data === 'object' && !Array.isArray(data) && 'data' in data && data.data && 'datasets' in data.data) {
      // Nested data structure (like sample data)
      return {
        labels: data.data.labels || [],
        datasets: data.data.datasets
      };
    } else if (data && typeof data === 'object' && !Array.isArray(data) && 'datasets' in data && !data.labels) {
      // Datasets-only format (like scatter charts)
      return {
        labels: [],
        datasets: data.datasets
      };
    } else if (Array.isArray(data)) {
      // Array format data (legacy support)
      const labels = data.map(item => item.category || item.label || item.name || 'Item');
      const values = data.map(item => item.value || item.data || 0);
      return {
        labels,
        datasets: [{
          label: 'Values',
          data: values
        }]
      };
    } else {
      // Fallback for empty or invalid data
      return {
        labels: ['No Data'],
        datasets: [{
          label: 'Values',
          data: [0]
        }]
      };
    }
  }

  protected static getModuleName(selectedType: string, selectedLibrary: string): string {
    return `drupal_${selectedType}_${selectedLibrary}`.replace(/[^a-zA-Z0-9_]/g, '_');
  }

  protected static getClassName(selectedType: string, selectedLibrary: string): string {
    return `${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}${selectedLibrary.charAt(0).toUpperCase() + selectedLibrary.slice(1)}`;
  }

  protected static getChartType(selectedType: string, selectedSubtype: string): string {
    // Map visualization types to Chart.js chart types
    switch (selectedType) {
      case 'bar':
        return 'bar';
      case 'line':
        return 'line';
      case 'pie':
        return selectedSubtype === 'donut' ? 'doughnut' : 'pie';
      case 'radar':
        return 'radar';
      case 'scatter':
        return selectedSubtype === 'bubble' ? 'scatter' : 'scatter';
      case 'bubble':
        return 'bubble';
      case 'polarArea':
        return 'polarArea';
      case 'map':
        return 'bar'; // Fallback for map charts
      default:
        return 'bar'; // Default fallback
    }
  }

  protected static getHighchartsChartType(selectedType: string, selectedSubtype: string): string {
    // Map visualization types to Highcharts chart types
    switch (selectedType) {
      case 'bar':
        return 'bar';
      case 'line':
        return 'line';
      case 'pie':
        return 'pie';
      case 'radar':
        return 'area'; // Highcharts uses 'area' for radar charts
      case 'scatter':
        return selectedSubtype === 'bubble' ? 'bubble' : 'scatter';
      case 'bubble':
        return 'bubble';
      case 'map':
        return 'bar'; // Fallback for map charts
      default:
        return 'bar'; // Default fallback
    }
  }

  protected static getEChartsChartType(selectedType: string, selectedSubtype: string): string {
    // Map visualization types to ECharts chart types
    switch (selectedType) {
      case 'bar':
        return 'bar';
      case 'line':
        return 'line';
      case 'pie':
        return 'pie';
      case 'radar':
        return 'radar';
      case 'scatter':
        return selectedSubtype === 'bubble' ? 'scatter' : 'scatter';
      case 'bubble':
        return 'scatter';
      case 'map':
        return 'bar'; // Fallback for map charts
      default:
        return 'bar'; // Default fallback
    }
  }

  public static sanitizeForCodeGeneration(obj: any): any {
    if (typeof obj === 'string') {
      // Basic XSS prevention - remove script tags and javascript: protocols
      return obj.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                .replace(/javascript:/gi, '');
    }
    if (Array.isArray(obj)) {
      return obj.map(BaseGenerator.sanitizeForCodeGeneration);
    }
    if (obj && typeof obj === 'object') {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(obj)) {
        // Sanitize object keys
        const cleanKey = key.replace(/[<>]/g, '');
        sanitized[cleanKey] = BaseGenerator.sanitizeForCodeGeneration(value);
      }
      return sanitized;
    }
    return obj;
  }
} 
