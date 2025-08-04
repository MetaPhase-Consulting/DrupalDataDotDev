import React, { useRef, useEffect } from 'react';

// Import theme data
import chartStylesData from '../../../data/chartStyles.json';

interface EChartsPreviewProps {
  selectedType: string;
  selectedSubtype: string;
  selectedTheme: string;
  data: any;
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
    if (!containerRef.current || !data) return;

    // Clear previous content
    containerRef.current.innerHTML = '';

    const theme = getThemeColors();

    // Load ECharts dynamically
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js';
    
    script.onload = () => {
      if (typeof (window as any).echarts !== 'undefined') {
        const echarts = (window as any).echarts;
        
        const chart = echarts.init(containerRef.current);
        const chartType = getChartType();
        
        // Handle different data formats
        let xAxis: string[];
        let series: any[];

        if (data.xAxis && data.series) {
          // ECharts format from conversion
          xAxis = data.xAxis;
          series = data.series;
        } else if (data.labels && data.datasets) {
          // Chart.js format
          xAxis = data.labels;
          series = data.datasets.map((dataset: any) => ({
            name: dataset.label,
            type: chartType,
            data: dataset.data
          }));
        } else if (data.data && data.data.datasets) {
          // Nested data structure (like sample data)
          xAxis = data.data.labels || [];
          series = data.data.datasets.map((dataset: any) => ({
            name: dataset.label,
            type: chartType,
            data: dataset.data
          }));
        } else if (data.datasets && !data.labels) {
          // Datasets-only format (like scatter charts)
          xAxis = [];
          series = data.datasets.map((dataset: any) => ({
            name: dataset.label,
            type: chartType,
            data: dataset.data
          }));
        } else if (Array.isArray(data)) {
          // Legacy array format
          const firstItem = data[0];
          const keys = Object.keys(firstItem);
          const dataKeys = keys.filter(key => 
            !['category', 'label', 'axis', 'month', 'x', 'y'].includes(key)
          );
          
          xAxis = data.map((item: any) => 
            item.category || item.label || item.axis || item.month || item.x || `Item ${data.indexOf(item)}`
          );
          series = dataKeys.length > 0 
            ? dataKeys.map(key => ({
                name: key.charAt(0).toUpperCase() + key.slice(1),
                type: chartType,
                data: data.map((item: any) => Number(item[key]) || 0)
              }))
            : [{
                name: 'Data',
                type: chartType,
                data: data.map((item: any) => Number(item.value || item.y || 0))
              }];
        } else {
          return;
        }
        
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
              data: xAxis.map((name: string, index: number) => ({
                name,
                value: series[0].data[index]
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
              indicator: xAxis.map((name: string) => ({ name })),
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
              data: series.map((s: any) => ({
                name: s.name,
                value: s.data
              }))
            }]
          };
        } else {
          // Bar, line, scatter charts
          option = {
            ...option,
            xAxis: {
              type: 'category',
              data: xAxis,
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
            series: series.map((s: any) => ({
              ...s,
              areaStyle: selectedType === 'line' && selectedSubtype === 'area' ? {} : undefined
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
    </div>
  );
};

export default EChartsPreview; 