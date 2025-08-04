import React, { useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
} from 'chart.js';
import { Bar, Line, Pie, Doughnut, PolarArea, Radar } from 'react-chartjs-2';

// Import theme data
import chartStylesData from '../../../data/chartStyles.json';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale
);

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
  const chartRef = useRef<any>(null);

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
        colors: fallbackTheme.palette
      };
    }
    
    return {
      primary: theme.colors.primary,
      secondary: theme.colors.secondary,
      accent: theme.colors.text,
      background: theme.colors.background,
      colors: theme.palette
    };
  };

  // Transform data for Chart.js
  const transformData = () => {
    const theme = getThemeColors();
    
    if (!data || data.length === 0) return null;

    // Handle different data structures
    const firstItem = data[0];
    const keys = Object.keys(firstItem);
    
    // Try to identify label and value fields
    const labelField = keys.find(k => 
      k.toLowerCase().includes('label') || 
      k.toLowerCase().includes('name') || 
      k.toLowerCase().includes('category') ||
      k === keys[0] // fallback to first field
    ) || keys[0];
    
    const valueFields = keys.filter(k => 
      k !== labelField && 
      (typeof firstItem[k] === 'number' || !isNaN(Number(firstItem[k])))
    );

    const labels = data.map(item => item[labelField]);
    
    // For pie/doughnut charts, use single dataset
    if (selectedType === 'pie') {
      const values = data.map(item => Number(item[valueFields[0]]) || 0);
      return {
        labels,
        datasets: [{
          data: values,
          backgroundColor: theme.colors.slice(0, labels.length),
          borderColor: theme.colors.slice(0, labels.length).map(color => color + '80'),
          borderWidth: 2,
        }]
      };
    }

    // For other chart types, support multiple datasets
    const datasets = valueFields.map((field, index) => {
      const values = data.map(item => Number(item[field]) || 0);
      
      return {
        label: field.charAt(0).toUpperCase() + field.slice(1),
        data: values,
        backgroundColor: selectedType === 'bar' ? theme.colors[index % theme.colors.length] + '80' : theme.colors[index % theme.colors.length] + '20',
        borderColor: theme.colors[index % theme.colors.length],
        borderWidth: 2,
        fill: selectedType === 'line' ? false : undefined,
        tension: selectedType === 'line' ? 0.4 : undefined,
      };
    });

    return { labels, datasets };
  };

  // Get chart options
  const getChartOptions = () => {
    const theme = getThemeColors();
    
    const baseOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top' as const,
          labels: {
            color: theme.accent,
            font: {
              size: 12
            }
          }
        },
        title: {
          display: true,
          text: `${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Chart Preview`,
          color: theme.accent,
          font: {
            size: 16,
            weight: 'bold'
          }
        },
      },
      scales: {}
    };

    // Add scales for non-pie charts
    if (selectedType !== 'pie') {
      baseOptions.scales = {
        y: {
          beginAtZero: true,
          ticks: {
            color: theme.accent + '80',
          },
          grid: {
            color: theme.accent + '20',
          }
        },
        x: {
          ticks: {
            color: theme.accent + '80',
          },
          grid: {
            color: theme.accent + '20',
          }
        }
      };
    }

    return baseOptions;
  };

  // Get the appropriate Chart component
  const getChartComponent = () => {
    const chartData = transformData();
    const chartOptions = getChartOptions();
    
    if (!chartData) return null;

    switch (selectedType) {
      case 'bar':
        return <Bar ref={chartRef} data={chartData} options={chartOptions} />;
      case 'line':
        return <Line ref={chartRef} data={chartData} options={chartOptions} />;
      case 'pie':
        if (selectedSubtype === 'doughnut') {
          return <Doughnut ref={chartRef} data={chartData} options={chartOptions} />;
        } else if (selectedSubtype === 'polar') {
          return <PolarArea ref={chartRef} data={chartData} options={chartOptions} />;
        }
        return <Pie ref={chartRef} data={chartData} options={chartOptions} />;
      case 'radar':
        return <Radar ref={chartRef} data={chartData} options={chartOptions} />;
      default:
        return <Bar ref={chartRef} data={chartData} options={chartOptions} />;
    }
  };

  const chartComponent = getChartComponent();

  if (!chartComponent) {
    return (
      <div className="bg-[#1F2937]/20 dark:bg-[#1F2937]/20 bg-gray-50 rounded-lg p-8 text-center border-2 border-dashed border-[#3E4C5E] dark:border-[#3E4C5E] border-gray-300">
        <div className="text-[#E5F1FF]/60 dark:text-[#E5F1FF]/60 text-gray-400 mb-4">
          <div className="text-lg font-semibold mb-2">Unable to Render Chart</div>
          <div className="text-sm">
            Please check your data format and selected chart type
          </div>
        </div>
      </div>
    );
  }

  const theme = getThemeColors();
  
  return (
    <div className="h-full w-full">
      {chartComponent}
    </div>
  );
};

export default ChartJSPreview; 