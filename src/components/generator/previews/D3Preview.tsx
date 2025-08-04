import React, { useRef, useEffect } from 'react';

// Import theme data
import chartStylesData from '../../../data/chartStyles.json';

interface D3PreviewProps {
  selectedType: string;
  selectedSubtype: string;
  selectedTheme: string;
  data: any[];
  options: Record<string, any>;
}

const D3Preview: React.FC<D3PreviewProps> = ({
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

  // Transform data for D3
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
      return {
        labels: data.map(item => item.category || item.label || item.axis || item.month || item.x || `Item ${item.index}`),
        values: data.map(item => item.value || item.y || 0),
        series: ['Data']
      };
    }

    // Multi-series data
    const labels = data.map(item => item.category || item.label || item.axis || item.month || item.x || `Item ${item.index}`);
    const series = dataKeys.map(key => key.charAt(0).toUpperCase() + key.slice(1));
    const values = dataKeys.map(key => data.map(item => Number(item[key]) || 0));

    return { labels, values, series };
  };

  // Render D3 chart
  useEffect(() => {
    if (!containerRef.current || !data || data.length === 0) return;

    // Clear previous content
    containerRef.current.innerHTML = '';

    const theme = getThemeColors();
    const transformedData = transformData();

    // Load D3.js dynamically
    const script = document.createElement('script');
    script.src = 'https://d3js.org/d3.v7.min.js';
    
    script.onload = () => {
      if (typeof (window as any).d3 !== 'undefined') {
        const d3 = (window as any).d3;
        
        const width = containerRef.current!.clientWidth;
        const height = 400;
        const margin = { top: 20, right: 20, bottom: 40, left: 60 };

        const svg = d3.select(containerRef.current)
          .append('svg')
          .attr('width', width)
          .attr('height', height);

        if (selectedType === 'bar') {
          // Bar chart
          const x = d3.scaleBand()
            .domain(transformedData.labels)
            .range([margin.left, width - margin.right])
            .padding(0.1);

          const y = d3.scaleLinear()
            .domain([0, d3.max(transformedData.values.flat()) || 0])
            .range([height - margin.bottom, margin.top]);

          // Add bars for each series
          transformedData.values.forEach((seriesValues, seriesIndex) => {
            svg.selectAll(`.bar-series-${seriesIndex}`)
              .data(seriesValues)
              .enter()
              .append('rect')
              .attr('class', `bar-series-${seriesIndex}`)
              .attr('x', (d, i) => x(transformedData.labels[i])! + (x.bandwidth() / transformedData.values.length) * seriesIndex)
              .attr('y', d => y(d))
              .attr('width', x.bandwidth() / transformedData.values.length)
              .attr('height', d => height - margin.bottom - y(d))
              .attr('fill', theme.colors[seriesIndex % theme.colors.length])
              .attr('opacity', 0.8);
          });

          // Add axes
          svg.append('g')
            .attr('transform', `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x))
            .selectAll('text')
            .style('fill', theme.accent)
            .style('font-family', 'Roboto, system-ui, sans-serif');

          svg.append('g')
            .attr('transform', `translate(${margin.left},0)`)
            .call(d3.axisLeft(y))
            .selectAll('text')
            .style('fill', theme.accent)
            .style('font-family', 'Roboto, system-ui, sans-serif');

        } else if (selectedType === 'line') {
          // Line chart
          const x = d3.scaleBand()
            .domain(transformedData.labels)
            .range([margin.left, width - margin.right]);

          const y = d3.scaleLinear()
            .domain([0, d3.max(transformedData.values.flat()) || 0])
            .range([height - margin.bottom, margin.top]);

          const line = d3.line()
            .x((d, i) => x(transformedData.labels[i])! + x.bandwidth() / 2)
            .y(d => y(d));

          // Add lines for each series
          transformedData.values.forEach((seriesValues, seriesIndex) => {
            svg.append('path')
              .datum(seriesValues)
              .attr('fill', 'none')
              .attr('stroke', theme.colors[seriesIndex % theme.colors.length])
              .attr('stroke-width', 3)
              .attr('d', line);

            // Add points
            svg.selectAll(`.point-series-${seriesIndex}`)
              .data(seriesValues)
              .enter()
              .append('circle')
              .attr('class', `point-series-${seriesIndex}`)
              .attr('cx', (d, i) => x(transformedData.labels[i])! + x.bandwidth() / 2)
              .attr('cy', d => y(d))
              .attr('r', 4)
              .attr('fill', theme.colors[seriesIndex % theme.colors.length]);
          });

          // Add axes
          svg.append('g')
            .attr('transform', `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x))
            .selectAll('text')
            .style('fill', theme.accent)
            .style('font-family', 'Roboto, system-ui, sans-serif');

          svg.append('g')
            .attr('transform', `translate(${margin.left},0)`)
            .call(d3.axisLeft(y))
            .selectAll('text')
            .style('fill', theme.accent)
            .style('font-family', 'Roboto, system-ui, sans-serif');

        } else if (selectedType === 'pie') {
          // Pie chart
          const radius = Math.min(width, height) / 2 - margin.top;
          const g = svg.append('g')
            .attr('transform', `translate(${width / 2},${height / 2})`);

          const pie = d3.pie()
            .value(d => d);

          const arc = d3.arc()
            .innerRadius(selectedSubtype === 'doughnut' ? radius * 0.5 : 0)
            .outerRadius(radius);

          g.selectAll('path')
            .data(pie(transformedData.values[0]))
            .enter()
            .append('path')
            .attr('d', arc)
            .attr('fill', (d, i) => theme.colors[i % theme.colors.length])
            .attr('stroke', theme.background)
            .attr('stroke-width', 2);

        } else if (selectedType === 'radar') {
          // Radar chart
          const radius = Math.min(width, height) / 2 - margin.top;
          const g = svg.append('g')
            .attr('transform', `translate(${width / 2},${height / 2})`);

          const angleSlice = (Math.PI * 2) / transformedData.labels.length;

          // Draw radar grid
          const levels = 5;
          for (let level = 1; level <= levels; level++) {
            const levelRadius = (radius / levels) * level;
            g.append('circle')
              .attr('r', levelRadius)
              .attr('fill', 'none')
              .attr('stroke', theme.accent + '20')
              .attr('stroke-width', 1);
          }

          // Draw axis lines
          transformedData.labels.forEach((label, i) => {
            const angle = angleSlice * i - Math.PI / 2;
            const x1 = Math.cos(angle) * radius;
            const y1 = Math.sin(angle) * radius;
            
            g.append('line')
              .attr('x1', 0)
              .attr('y1', 0)
              .attr('x2', x1)
              .attr('y2', y1)
              .attr('stroke', theme.accent + '40')
              .attr('stroke-width', 1);
          });

          // Draw data lines for each series
          transformedData.values.forEach((seriesValues, seriesIndex) => {
            const lineGenerator = d3.lineRadial()
              .radius(d => (d / Math.max(...seriesValues)) * radius)
              .angle((d, i) => angleSlice * i - Math.PI / 2);

            g.append('path')
              .datum(seriesValues)
              .attr('d', lineGenerator)
              .attr('fill', 'none')
              .attr('stroke', theme.colors[seriesIndex % theme.colors.length])
              .attr('stroke-width', 3);

            // Add points
            seriesValues.forEach((value, i) => {
              const angle = angleSlice * i - Math.PI / 2;
              const r = (value / Math.max(...seriesValues)) * radius;
              const x = Math.cos(angle) * r;
              const y = Math.sin(angle) * r;

              g.append('circle')
                .attr('cx', x)
                .attr('cy', y)
                .attr('r', 4)
                .attr('fill', theme.colors[seriesIndex % theme.colors.length]);
            });
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
          D3.js Preview
        </div>
        <div className="text-xs text-gray-400 mt-1">
          {selectedType} chart • {data.length} data points
        </div>
      </div>
    </div>
  );
};

export default D3Preview; 