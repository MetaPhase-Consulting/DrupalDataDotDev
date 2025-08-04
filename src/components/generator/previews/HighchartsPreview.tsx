import React, { useRef, useEffect } from 'react';

// Import theme data
import chartStylesData from '../../../data/chartStyles.json';

interface HighchartsPreviewProps {
  selectedType: string;
  selectedSubtype: string;
  selectedTheme: string;
  data: any;
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
        return selectedSubtype === 'horizontal' ? 'bar' : 'column';
      case 'line':
        return 'line';
      case 'pie':
        return 'pie';
      case 'scatter':
        return 'scatter';
      default:
        return 'column';
    }
  };

  // Render Highcharts chart
  useEffect(() => {
    if (!containerRef.current || !data) return;

    // Clear previous content
    containerRef.current.innerHTML = '';

    const theme = getThemeColors();

    // Load Highcharts dynamically
    const script = document.createElement('script');
    script.src = 'https://code.highcharts.com/highcharts.js';
    
    script.onload = () => {
      if (typeof (window as any).Highcharts !== 'undefined') {
        const Highcharts = (window as any).Highcharts;
        
        const chartType = getChartType();
        
        // Handle different data formats
        let categories: string[];
        let series: any[];

        if (data.categories && data.series) {
          // Highcharts format from conversion
          categories = data.categories;
          series = data.series;
        } else if (data.labels && data.datasets) {
          // Chart.js format
          categories = data.labels;
          series = data.datasets.map((dataset: any) => ({
            name: dataset.label,
            data: dataset.data
          }));
        } else if (Array.isArray(data)) {
          // Legacy array format
          const firstItem = data[0];
          const keys = Object.keys(firstItem);
          const dataKeys = keys.filter(key => 
            !['category', 'label', 'axis', 'month', 'x', 'y'].includes(key)
          );
          
          categories = data.map((item: any) => 
            item.category || item.label || item.axis || item.month || item.x || `Item ${data.indexOf(item)}`
          );
          series = dataKeys.length > 0 
            ? dataKeys.map(key => ({
                name: key.charAt(0).toUpperCase() + key.slice(1),
                data: data.map((item: any) => Number(item[key]) || 0)
              }))
            : [{
                name: 'Data',
                data: data.map((item: any) => Number(item.value || item.y || 0))
              }];
        } else {
          return;
        }
        
        if (chartType === 'pie') {
          // Pie chart
          Highcharts.chart(containerRef.current, {
            chart: {
              type: 'pie',
              backgroundColor: theme.background
            },
            title: {
              text: '',
              style: { color: theme.accent }
            },
            plotOptions: {
              pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                  enabled: true,
                  style: { color: theme.accent }
                }
              }
            },
            series: [{
              name: 'Data',
              colorByPoint: true,
              data: series[0].data.map((value: number, index: number) => ({
                name: categories[index],
                y: value,
                color: theme.colors[index % theme.colors.length]
              }))
            }]
          });
        } else {
          // Other chart types
          Highcharts.chart(containerRef.current, {
            chart: {
              type: chartType,
              backgroundColor: theme.background
            },
            title: {
              text: '',
              style: { color: theme.accent }
            },
            xAxis: {
              categories: categories,
              labels: {
                style: { color: theme.accent }
              }
            },
            yAxis: {
              title: {
                text: '',
                style: { color: theme.accent }
              },
              labels: {
                style: { color: theme.accent }
              }
            },
            legend: {
              itemStyle: { color: theme.accent },
              itemHoverStyle: { color: theme.primary }
            },
            plotOptions: {
              series: {
                colors: theme.colors
              }
            },
            series: series
          });
        }
      }
    };
    
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
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
      <div ref={containerRef} className="w-full h-full" style={{ height: '400px' }}></div>
      <div className="mt-4 text-center">
        <div className="text-sm text-gray-500">
          Highcharts Preview
        </div>
        <div className="text-xs text-gray-400 mt-1">
          {selectedType} chart • {Array.isArray(data) ? data.length : (data.categories?.length || data.labels?.length || 0)} data points
        </div>
      </div>
    </div>
  );
};

export default HighchartsPreview; 