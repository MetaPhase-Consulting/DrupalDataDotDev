// Data transformation utilities for converting between chart library formats

export interface ChartJsData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
  }>;
}

export interface HighchartsData {
  categories: string[];
  series: Array<{
    name: string;
    data: number[];
  }>;
}

export interface EChartsData {
  xAxis: string[];
  series: Array<{
    name: string;
    type: string;
    data: number[];
  }>;
}

export interface D3Data {
  labels: string[];
  values: number[][];
  series: string[];
}

// Validation functions
export function isValidGeoJSON(data: any): boolean {
  if (!data || typeof data !== 'object') return false;
  
  // Basic GeoJSON structure check
  if (data.type !== 'FeatureCollection' && data.type !== 'Feature') return false;
  
  if (data.type === 'FeatureCollection') {
    return Array.isArray(data.features) && data.features.length > 0;
  }
  
  if (data.type === 'Feature') {
    return data.geometry && data.geometry.type && data.geometry.coordinates;
  }
  
  return false;
}

export function isValidChartJsData(data: any): boolean {
  if (!data || typeof data !== 'object') return false;
  
  // Check for required Chart.js structure
  if (!Array.isArray(data.labels) || !Array.isArray(data.datasets)) {
    return false;
  }
  
  // Ensure datasets is not empty
  if (data.datasets.length === 0) return false;
  
  // Check each dataset has required properties
  for (const dataset of data.datasets) {
    if (!dataset.label || !Array.isArray(dataset.data)) {
      return false;
    }
    
    // Ensure data array length matches labels length
    if (dataset.data.length !== data.labels.length) {
      return false;
    }
  }
  
  return true;
}

// Conversion utilities
export function toHighcharts(chartJsData: ChartJsData): HighchartsData {
  if (!isValidChartJsData(chartJsData)) {
    throw new Error('Invalid Chart.js data format');
  }
  
  return {
    categories: chartJsData.labels,
    series: chartJsData.datasets.map(dataset => ({
      name: dataset.label,
      data: dataset.data
    }))
  };
}

export function toECharts(chartJsData: ChartJsData): EChartsData {
  if (!isValidChartJsData(chartJsData)) {
    throw new Error('Invalid Chart.js data format');
  }
  
  return {
    xAxis: chartJsData.labels,
    series: chartJsData.datasets.map(dataset => ({
      name: dataset.label,
      type: 'bar', // Default type, will be overridden by chart type
      data: dataset.data
    }))
  };
}

export function toD3(chartJsData: ChartJsData): D3Data {
  if (!isValidChartJsData(chartJsData)) {
    throw new Error('Invalid Chart.js data format');
  }
  
  return {
    labels: chartJsData.labels,
    values: chartJsData.datasets.map(dataset => dataset.data),
    series: chartJsData.datasets.map(dataset => dataset.label)
  };
}

// Helper function to convert raw data to Chart.js format
export function convertRawDataToChartJs(rawData: any[]): ChartJsData {
  if (!Array.isArray(rawData) || rawData.length === 0) {
    throw new Error('Raw data must be a non-empty array');
  }
  
  const firstItem = rawData[0];
  const keys = Object.keys(firstItem);
  
  // Remove common non-data keys
  const dataKeys = keys.filter(key => 
    !['category', 'label', 'axis', 'month', 'x', 'y'].includes(key)
  );
  
  if (dataKeys.length === 0) {
    // Single series data
    const labels = rawData.map(item => 
      item.category || item.label || item.axis || item.month || item.x || `Item ${rawData.indexOf(item)}`
    );
    const values = rawData.map(item => Number(item.value || item.y || 0));
    
    return {
      labels,
      datasets: [{
        label: 'Data',
        data: values
      }]
    };
  }
  
  // Multi-series data
  const labels = rawData.map(item => 
    item.category || item.label || item.axis || item.month || item.x || `Item ${rawData.indexOf(item)}`
  );
  const datasets = dataKeys.map(key => ({
    label: key.charAt(0).toUpperCase() + key.slice(1),
    data: rawData.map(item => Number(item[key]) || 0)
  }));
  
  return { labels, datasets };
}

// Main conversion function that handles any input format
export function convertDataForLibrary(
  rawData: any, 
  library: string, 
  chartType: string
): any {
  // Handle GeoJSON for maps
  if (chartType === 'map') {
    if (!isValidGeoJSON(rawData)) {
      throw new Error('Map visualizations require valid GeoJSON data');
    }
    return rawData; // Return GeoJSON as-is for maps
  }
  
  // For non-map charts, convert to Chart.js format first
  let chartJsData: ChartJsData;
  
  if (isValidChartJsData(rawData)) {
    chartJsData = rawData;
  } else if (Array.isArray(rawData)) {
    chartJsData = convertRawDataToChartJs(rawData);
  } else {
    throw new Error('Invalid data format. Expected Chart.js JSON or array of objects.');
  }
  
  // Convert to target library format
  switch (library) {
    case 'chartjs':
      return chartJsData;
    case 'highcharts':
      return toHighcharts(chartJsData);
    case 'echarts':
      const echartsData = toECharts(chartJsData);
      // Update series type based on chart type
      echartsData.series.forEach(series => {
        series.type = chartType;
      });
      return echartsData;
    case 'd3':
      return toD3(chartJsData);
    default:
      return chartJsData; // Fallback to Chart.js format
  }
} 