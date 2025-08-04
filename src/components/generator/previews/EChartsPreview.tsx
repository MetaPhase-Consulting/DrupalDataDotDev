import React, { useRef, useEffect } from 'react';

// Import theme data
import chartStylesData from '../../../data/chartStyles.json';

interface EChartsPreviewProps {
  selectedType: string;
  selectedSubtype: string;
  selectedTheme: string;
  data: any[];
  options: Record<string, any>;
}

const EChartsPreview: React.FC<EChartsPreviewProps> = ({
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

  // Transform data for ECharts
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
      const xAxis = data.map(item => item.category || item.label || item.axis || item.month || item.x || `Item ${item.index}`);
      const series = [{
        name: 'Data',
        type: selectedType,
        data: data.map(item => Number(item.value || item.y || 0))
      }];
      
      return { xAxis, series };
    }

    // Multi-series data
    const xAxis = data.map(item => item.category || item.label || item.axis || item.month || item.x || `Item ${item.index}`);
    const series = dataKeys.map(key => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      type: selectedType,
      data: data.map(item => Number(item[key]) || 0)
    }));

    return { xAxis, series };
  };

  // Get chart type
  const getChartType = () => {
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
        return 'scatter';
      default:
        return 'bar';
    }
  };

  // Render ECharts chart
  useEffect(() => {
    if (!containerRef.current || !data || data.length === 0) return;

    // Clear previous content
    containerRef.current.innerHTML = '';

    const theme = getThemeColors();
    const transformedData = transformData();

    // Load ECharts dynamically
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js';
    
    script.onload = () => {
      if (typeof (window as any).echarts !== 'undefined') {
        const echarts = (window as any).echarts;
        
        const chart = echarts.init(containerRef.current);
        const chartType = getChartType();
        
        let option: any = {
          backgroundColor: theme.background,
          color: theme.colors,
          textStyle: {
            color: theme.accent,
            fontFamily: 'Roboto, system-ui, sans-serif'
          },
          legend: {
            textStyle: {
              color: theme.accent
            }
          }
        };

        if (chartType === 'pie') {
          // Pie chart
          option = {
            ...option,
            series: [{
              type: 'pie',
              radius: selectedSubtype === 'doughnut' ? ['40%', '70%'] : '50%',
              data: transformedData.xAxis.map((name, index) => ({
                name,
                value: transformedData.series[0].data[index]
              })),
              label: {
                color: theme.accent
              }
            }]
          };
        } else if (chartType === 'radar') {
          // Radar chart
          option = {
            ...option,
            radar: {
              indicator: transformedData.xAxis.map(name => ({ name })),
              axisName: {
                color: theme.accent
              },
              splitLine: {
                lineStyle: {
                  color: theme.accent + '20'
                }
              },
              splitArea: {
                show: false
              }
            },
            series: [{
              type: 'radar',
              data: transformedData.series.map(series => ({
                name: series.name,
                value: series.data
              }))
            }]
          };
        } else {
          // Bar, line, scatter charts
          option = {
            ...option,
            xAxis: {
              type: 'category',
              data: transformedData.xAxis,
              axisLabel: {
                color: theme.accent
              },
              axisLine: {
                lineStyle: {
                  color: theme.accent + '40'
                }
              }
            },
            yAxis: {
              type: 'value',
              axisLabel: {
                color: theme.accent
              },
              axisLine: {
                lineStyle: {
                  color: theme.accent + '40'
                }
              },
              splitLine: {
                lineStyle: {
                  color: theme.accent + '20'
                }
              }
            },
            series: transformedData.series.map(series => ({
              ...series,
              type: chartType,
              areaStyle: selectedSubtype === 'area' ? {} : undefined
            }))
          };
        }

        chart.setOption(option);
        
        // Handle window resize
        const handleResize = () => chart.resize();
        window.addEventListener('resize', handleResize);
        
        return () => {
          window.removeEventListener('resize', handleResize);
          chart.dispose();
        };
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
      <div ref={containerRef} className="w-full h-full" style={{ height: '400px' }}></div>
      <div className="mt-4 text-center">
        <div className="text-sm text-gray-500">
          ECharts Preview
        </div>
        <div className="text-xs text-gray-400 mt-1">
          {selectedType} chart • {data.length} data points
        </div>
      </div>
    </div>
  );
};

export default EChartsPreview; 