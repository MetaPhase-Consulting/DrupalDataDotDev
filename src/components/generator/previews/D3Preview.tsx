import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

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

  // Transform data for D3
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
      labels: data.map(item => item[labelField]),
      values: data.map(item => Number(item[valueFields[0]]) || 0),
      fields: valueFields
    };
  };

  // Render D3 chart
  useEffect(() => {
    if (!containerRef.current || !data || data.length === 0) return;

    // Clear previous content
    containerRef.current.innerHTML = '';

    const transformedData = transformData();
    if (!transformedData) return;

    const theme = getThemeColors();
    const { labels, values } = transformedData;

    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(containerRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create scales
    const x = d3.scaleBand()
      .range([0, width])
      .domain(labels)
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(values) || 0])
      .range([height, 0]);

    // Add axes
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .style('color', theme.accent);

    svg.append('g')
      .call(d3.axisLeft(y))
      .style('color', theme.accent);

    // Add bars or other chart elements based on type
    switch (selectedType) {
      case 'bar':
        svg.selectAll('rect')
          .data(values)
          .enter()
          .append('rect')
          .attr('x', (d, i) => x(labels[i]) || 0)
          .attr('y', d => y(d))
          .attr('width', x.bandwidth())
          .attr('height', d => height - y(d))
          .attr('fill', (d, i) => theme.colors[i % theme.colors.length]);
        break;

      case 'line':
        const line = d3.line<number>()
          .x((d, i) => (x(labels[i]) || 0) + x.bandwidth() / 2)
          .y(d => y(d))
          .curve(d3.curveMonotoneX);

        svg.append('path')
          .datum(values)
          .attr('fill', 'none')
          .attr('stroke', theme.colors[0])
          .attr('stroke-width', 2)
          .attr('d', line);
        break;

      case 'pie':
        const pie = d3.pie<number>();
        const arc = d3.arc<d3.PieArcDatum<number>>()
          .innerRadius(0)
          .outerRadius(Math.min(width, height) / 2);

        const pieData = pie(values);
        const pieGroup = svg.append('g')
          .attr('transform', `translate(${width / 2},${height / 2})`);

        pieGroup.selectAll('path')
          .data(pieData)
          .enter()
          .append('path')
          .attr('d', arc)
          .attr('fill', (d, i) => theme.colors[i % theme.colors.length]);
        break;

      case 'radar':
        // Simple radar implementation
        const radarRadius = Math.min(width, height) / 3;
        const radarGroup = svg.append('g')
          .attr('transform', `translate(${width / 2},${height / 2})`);

        // Draw radar grid
        for (let i = 1; i <= 3; i++) {
          const radius = (radarRadius / 3) * i;
          radarGroup.append('circle')
            .attr('cx', 0)
            .attr('cy', 0)
            .attr('r', radius)
            .attr('fill', 'none')
            .attr('stroke', theme.accent + '20')
            .attr('stroke-width', 1);
        }

        // Draw radar data
        const radarLine = d3.lineRadial<number>()
          .radius(d => (d / Math.max(...values)) * radarRadius)
          .angle((d, i) => (i / labels.length) * 2 * Math.PI);

        radarGroup.append('path')
          .datum(values)
          .attr('fill', theme.colors[0] + '20')
          .attr('stroke', theme.colors[0])
          .attr('stroke-width', 2)
          .attr('d', radarLine);
        break;

      default:
        // Default to bar chart
        svg.selectAll('rect')
          .data(values)
          .enter()
          .append('rect')
          .attr('x', (d, i) => x(labels[i]) || 0)
          .attr('y', d => y(d))
          .attr('width', x.bandwidth())
          .attr('height', d => height - y(d))
          .attr('fill', (d, i) => theme.colors[i % theme.colors.length]);
    }

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

export default D3Preview; 