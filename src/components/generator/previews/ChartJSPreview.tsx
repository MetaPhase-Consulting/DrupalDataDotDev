import React, { useRef, useEffect } from 'react';
import { Chart, registerables } from 'chart.js';

// Import theme data
import chartStylesData from '../../../data/chartStyles.json';

Chart.register(...registerables);

interface ChartJSPreviewProps {
  selectedType: string;
  selectedSubtype: string;
  selectedTheme: string;
  data: any;
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

  // Get chart type
  const getChartType = () => {
    switch (selectedType) {
      case 'bar':
        return 'bar'; // Chart.js uses 'bar' for both vertical and horizontal
      case 'line':
        return 'line'; // All line subtypes use 'line' type in Chart.js
      case 'pie':
        return selectedSubtype === 'donut' ? 'doughnut' : 'pie';
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
    if (!canvasRef.current || !data) return;

    // Destroy existing chart
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const theme = getThemeColors();
    const chartType = getChartType();

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Prepare chart data
    let chartData;
    
    // Check if data is already in Chart.js format
    if (data.labels && data.datasets) {
      chartData = {
        labels: data.labels,
        datasets: data.datasets.map((dataset: any, index: number) => {
          let backgroundColor, borderColor;
          
          // For pie charts, use different colors for each slice
          if (selectedType === 'pie') {
            backgroundColor = data.labels.map((_: any, labelIndex: number) => 
              theme.colors[labelIndex % theme.colors.length] + '80'
            );
            borderColor = data.labels.map((_: any, labelIndex: number) => 
              theme.colors[labelIndex % theme.colors.length]
            );
          } else {
            // For other chart types, use one color per dataset
            backgroundColor = dataset.backgroundColor || theme.colors[index % theme.colors.length] + '80';
            borderColor = dataset.borderColor || theme.colors[index % theme.colors.length];
          }
          
          return {
            ...dataset,
            backgroundColor,
            borderColor,
            borderWidth: dataset.borderWidth || 2,
            fill: selectedType === 'line' && selectedSubtype === 'area',
            tension: selectedType === 'line' && selectedSubtype === 'smooth' ? 0.4 : 0,
            // Radar chart specific properties
            ...(selectedType === 'radar' && {
              fill: selectedSubtype === 'filled',
              pointRadius: selectedSubtype === 'markers' ? 4 : 0
            }),
            // Scatter chart specific properties
            ...(selectedType === 'scatter' && {
              pointRadius: selectedSubtype === 'bubble' ? 8 : 4
            })
          };
        })
      };
    } else if (data.data && data.data.datasets) {
      // Handle nested data structure (like sample data)
      const chartDataFromNested = data.data;
      chartData = {
        labels: chartDataFromNested.labels || [],
        datasets: chartDataFromNested.datasets.map((dataset: any, index: number) => {
          let backgroundColor, borderColor;
          
          // For pie charts, use different colors for each slice
          if (selectedType === 'pie') {
            backgroundColor = (chartDataFromNested.labels || []).map((_: any, labelIndex: number) => 
              theme.colors[labelIndex % theme.colors.length] + '80'
            );
            borderColor = (chartDataFromNested.labels || []).map((_: any, labelIndex: number) => 
              theme.colors[labelIndex % theme.colors.length]
            );
          } else {
            // For other chart types, use one color per dataset
            backgroundColor = dataset.backgroundColor || theme.colors[index % theme.colors.length] + '80';
            borderColor = dataset.borderColor || theme.colors[index % theme.colors.length];
          }
          
          return {
            ...dataset,
            backgroundColor,
            borderColor,
            borderWidth: dataset.borderWidth || 2,
            fill: selectedType === 'line' && selectedSubtype === 'area',
            tension: selectedType === 'line' && selectedSubtype === 'smooth' ? 0.4 : 0,
            // Radar chart specific properties
            ...(selectedType === 'radar' && {
              fill: selectedSubtype === 'filled',
              pointRadius: selectedSubtype === 'markers' ? 4 : 0
            }),
            // Scatter chart specific properties
            ...(selectedType === 'scatter' && {
              pointRadius: selectedSubtype === 'bubble' ? 8 : 4
            })
          };
        })
      };
    } else if (data.datasets && !data.labels) {
      // Handle datasets-only format (like scatter charts)
      chartData = {
        labels: [], // Scatter charts don't need labels
        datasets: data.datasets.map((dataset: any, index: number) => {
          let backgroundColor, borderColor;
          
          // For scatter charts, use one color per dataset
          backgroundColor = dataset.backgroundColor || theme.colors[index % theme.colors.length] + '80';
          borderColor = dataset.borderColor || theme.colors[index % theme.colors.length];
          
          return {
            ...dataset,
            backgroundColor,
            borderColor,
            borderWidth: dataset.borderWidth || 2,
            fill: selectedType === 'line' && selectedSubtype === 'area',
            tension: selectedType === 'line' && selectedSubtype === 'smooth' ? 0.4 : 0,
            // Radar chart specific properties
            ...(selectedType === 'radar' && {
              fill: selectedSubtype === 'filled',
              pointRadius: selectedSubtype === 'markers' ? 4 : 0
            }),
            // Scatter chart specific properties
            ...(selectedType === 'scatter' && {
              pointRadius: selectedSubtype === 'bubble' ? 8 : 4
            })
          };
        })
      };
    } else if (Array.isArray(data)) {
      // Fallback for array data (legacy support)
      const labels = data.map((item: any, index: number) => 
        item.category || item.label || item.axis || item.month || item.x || `Item ${index}`
      );
      const values = data.map((item: any) => Number(item.value || item.y || 0));
      
      chartData = {
        labels,
        datasets: [{
          label: 'Data',
          data: values,
          backgroundColor: theme.colors[0] + '80',
          borderColor: theme.colors[0],
          borderWidth: 2
        }]
      };
    } else {
      // If data is not in expected format, show error
      console.error('Data is not in expected format:', data);
      return;
    }

    chartRef.current = new Chart(ctx, {
      type: chartType,
      data: chartData,
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
        indexAxis: selectedType === 'bar' && selectedSubtype === 'horizontal' ? 'y' : 'x',
        elements: {
          point: {
            backgroundColor: theme.colors[0],
            borderColor: theme.colors[0]
          }
        },
        // Radar chart specific options
        ...(chartType === 'radar' && {
          elements: {
            line: {
              fill: selectedSubtype === 'filled' ? true : false
            },
            point: {
              radius: selectedSubtype === 'markers' ? 4 : 0
            }
          }
        }),
        // Scatter chart specific options
        ...(chartType === 'scatter' && {
          elements: {
            point: {
              radius: selectedSubtype === 'bubble' ? 8 : 4,
              hoverRadius: selectedSubtype === 'bubble' ? 12 : 6
            }
          }
        })
      }
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [selectedType, selectedSubtype, selectedTheme, data, options]);

  if (!data) {
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
    </div>
  );
};

export default ChartJSPreview; 