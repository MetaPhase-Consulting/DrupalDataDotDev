import React, { useRef, useEffect } from 'react';

// Import theme data
import chartStylesData from '../../../data/chartStyles.json';

interface HighchartsPreviewProps {
  selectedType: string;
  selectedSubtype: string;
  selectedTheme: string;
  data: any[];
  options: Record<string, any>;
}

const HighchartsPreview: React.FC<HighchartsPreviewProps> = ({
  selectedType,
  selectedSubtype,
  selectedTheme,
  data,
  options
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

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

  // Transform data for Highcharts
  const transformData = () => {
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

    return {
      categories: data.map(item => item[labelField]),
      series: valueFields.map(field => ({
        name: field.charAt(0).toUpperCase() + field.slice(1),
        data: data.map(item => Number(item[field]) || 0)
      }))
    };
  };

  // Get chart type for Highcharts
  const getChartType = () => {
    switch (selectedType) {
      case 'bar':
        return 'column';
      case 'line':
        return 'line';
      case 'pie':
        return 'pie';
      case 'radar':
        return 'line';
      case 'scatter':
        return 'scatter';
      default:
        return 'column';
    }
  };

  // Render Highcharts chart
  useEffect(() => {
    if (!containerRef.current || !data || data.length === 0) return;

    // Clear previous content
    containerRef.current.innerHTML = '';

    const transformedData = transformData();
    if (!transformedData) return;

    const theme = getThemeColors();
    const chartType = getChartType();

    // Load Highcharts dynamically
    const script = document.createElement('script');
    script.src = 'https://code.highcharts.com/highcharts.js';
    script.onload = () => {
      if (typeof (window as any).Highcharts !== 'undefined') {
        const Highcharts = (window as any).Highcharts;
        
        Highcharts.chart(containerRef.current, {
          chart: {
            type: chartType,
            backgroundColor: theme.background,
            height: 400
          },
          title: {
            text: `${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Chart Preview`,
            style: {
              color: theme.accent
            }
          },
          xAxis: {
            categories: transformedData.categories,
            labels: {
              style: {
                color: theme.accent
              }
            }
          },
          yAxis: {
            title: {
              text: 'Values',
              style: {
                color: theme.accent
              }
            },
            labels: {
              style: {
                color: theme.accent
              }
            }
          },
          series: transformedData.series.map((series, index) => ({
            ...series,
            color: theme.colors[index % theme.colors.length]
          })),
          credits: {
            enabled: false
          },
          legend: {
            itemStyle: {
              color: theme.accent
            }
          }
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
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
      <div ref={containerRef} className="w-full h-full"></div>
    </div>
  );
};

export default HighchartsPreview; 