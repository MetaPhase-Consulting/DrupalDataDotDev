import React, { useRef, useEffect } from 'react';
import { Chart, registerables } from 'chart.js';

// Import theme data
import chartStylesData from '../../../data/chartStyles.json';

Chart.register(...registerables);

interface ChartJSPreviewProps {
  selectedType: string;
  selectedSubtype: string;
  selectedTheme: string;
  data: any[];
  options: Record<string, any>;
}

const ChartJSPreview: React.FC<ChartJSPreviewProps> = ({
  selectedType,
  selectedSubtype,
  selectedTheme,
  data,
  options
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  // Get theme colors from actual theme data
  const getThemeColors = () => {
    const theme = chartStylesData.find(t => t.id === selectedTheme);
    
    if (!theme) {
      // Fallback to first theme if selected theme not found
      const fallbackTheme = chartStylesData[0];
      return {
        primary: fallbackTheme.colors.primary,
        secondary: fallbackTheme.colors.secondary,
        accent: fallbackTheme.colors.text,
        background: fallbackTheme.colors.background,
        colors: fallbackTheme.palette || fallbackTheme.colors
      };
    }
    
    return {
      primary: theme.colors.primary,
      secondary: theme.colors.secondary,
      accent: theme.colors.text,
      background: theme.colors.background,
      colors: theme.palette || theme.colors
    };
  };

  // Transform data for Chart.js
  const transformData = () => {
    if (!data || data.length === 0) return null;

    const firstItem = data[0];
    const keys = Object.keys(firstItem);
    
    // Remove common non-data keys
    const dataKeys = keys.filter(key => 
      !['category', 'label', 'axis', 'month', 'x', 'y'].includes(key)
    );

    if (dataKeys.length === 0) {
      // Single series data
      const labels = data.map(item => item.category || item.label || item.axis || item.month || item.x || `Item ${item.index}`);
      const values = data.map(item => item.value || item.y || 0);
      
      return {
        labels,
        datasets: [{
          label: 'Data',
          data: values,
          backgroundColor: getThemeColors().colors[0] + '80',
          borderColor: getThemeColors().colors[0],
          borderWidth: 2
        }]
      };
    }

    // Multi-series data
    const labels = data.map(item => item.category || item.label || item.axis || item.month || item.x || `Item ${item.index}`);
    const datasets = dataKeys.map((key, index) => ({
      label: key.charAt(0).toUpperCase() + key.slice(1),
      data: data.map(item => Number(item[key]) || 0),
      backgroundColor: getThemeColors().colors[index % getThemeColors().colors.length] + '80',
      borderColor: getThemeColors().colors[index % getThemeColors().colors.length],
      borderWidth: 2,
      fill: selectedType === 'line' && selectedSubtype === 'area'
    }));

    return { labels, datasets };
  };

  // Get chart type
  const getChartType = () => {
    switch (selectedType) {
      case 'bar':
        return selectedSubtype === 'horizontal' ? 'horizontalBar' : 'bar';
      case 'line':
        return selectedSubtype === 'area' ? 'line' : 'line';
      case 'pie':
        return selectedSubtype === 'doughnut' ? 'doughnut' : 'pie';
      case 'radar':
        return 'radar';
      case 'scatter':
        return 'scatter';
      default:
        return 'bar';
    }
  };

  // Render chart
  useEffect(() => {
    if (!canvasRef.current || !data || data.length === 0) return;

    // Destroy existing chart
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const transformedData = transformData();
    if (!transformedData) return;

    const theme = getThemeColors();
    const chartType = getChartType();

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    chartRef.current = new Chart(ctx, {
      type: chartType,
      data: transformedData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: theme.accent,
              font: {
                family: 'Roboto, system-ui, sans-serif'
              }
            }
          },
          title: {
            display: false
          }
        },
        scales: chartType !== 'pie' && chartType !== 'doughnut' && chartType !== 'radar' ? {
          x: {
            ticks: {
              color: theme.accent + '80',
              font: {
                family: 'Roboto, system-ui, sans-serif'
              }
            },
            grid: {
              color: theme.accent + '20'
            }
          },
          y: {
            ticks: {
              color: theme.accent + '80',
              font: {
                family: 'Roboto, system-ui, sans-serif'
              }
            },
            grid: {
              color: theme.accent + '20'
            }
          }
        } : undefined,
        elements: {
          point: {
            backgroundColor: theme.colors[0],
            borderColor: theme.colors[0]
          }
        }
      }
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [selectedType, selectedSubtype, selectedTheme, data, options]);

  if (!data || data.length === 0) {
    return (
      <div className="bg-[#1F2937]/20 dark:bg-[#1F2937]/20 bg-gray-50 rounded-lg p-8 text-center border-2 border-dashed border-[#3E4C5E] dark:border-[#3E4C5E] border-gray-300">
        <div className="text-[#E5F1FF]/60 dark:text-[#E5F1FF]/60 text-gray-400 mb-4">
          <div className="text-lg font-semibold mb-2">No Data Available</div>
          <div className="text-sm">
            Add data in Step 5 to see your chart preview
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <canvas ref={canvasRef} className="w-full h-full"></canvas>
      <div className="mt-4 text-center">
        <div className="text-sm text-gray-500">
          Chart.js Preview
        </div>
        <div className="text-xs text-gray-400 mt-1">
          {selectedType} chart • {data.length} data points
        </div>
      </div>
    </div>
  );
};

export default ChartJSPreview; 