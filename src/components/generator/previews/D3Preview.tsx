/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/exhaustive-deps, @typescript-eslint/no-unused-vars */
import React, { useRef, useEffect } from 'react';

// Import theme data
import chartStylesData from '../../../data/chartStyles.json';

interface D3PreviewProps {
  selectedType: string;
  selectedSubtype: string;
  selectedTheme: string;
  data: any;
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

  // Render D3 chart
  useEffect(() => {
    if (!containerRef.current || !data) return;

    // Clear previous content
    containerRef.current.innerHTML = '';

    const theme = getThemeColors();

    // Check if D3 is already loaded
    if (typeof (window as any).d3 !== 'undefined') {
      const d3 = (window as any).d3;
      
      const width = containerRef.current!.clientWidth;
      const height = 400;
      const margin = { top: 20, right: 20, bottom: 40, left: 60 };

      const svg = d3.select(containerRef.current)
        .append('svg')
        .attr('width', width)
        .attr('height', height);

      // Handle different data formats
      let labels: string[];
      let values: number[][];
      let series: string[];

      if (data.labels && data.values && data.series) {
        // D3 format from conversion
        labels = data.labels;
        values = data.values;
        series = data.series;
      } else if (data.labels && data.datasets) {
        // Chart.js format
        labels = data.labels;
        values = data.datasets.map((dataset: any) => dataset.data);
        series = data.datasets.map((dataset: any) => dataset.label);
      } else if (data.data && data.data.datasets) {
        // Nested data structure (like sample data)
        labels = data.data.labels || [];
        values = data.data.datasets.map((dataset: any) => dataset.data);
        series = data.data.datasets.map((dataset: any) => dataset.label);
      } else if (data.datasets && !data.labels) {
        // Datasets-only format (like scatter charts)
        labels = [];
        values = data.datasets.map((dataset: any) => dataset.data);
        series = data.datasets.map((dataset: any) => dataset.label);
      } else if (Array.isArray(data)) {
        // Legacy array format
        const firstItem = data[0];
        const keys = Object.keys(firstItem);
        const dataKeys = keys.filter(key => 
          !['category', 'label', 'axis', 'month', 'x', 'y'].includes(key)
        );
        
        labels = data.map((item: any) => 
          item.category || item.label || item.axis || item.month || item.x || `Item ${data.indexOf(item)}`
        );
        values = dataKeys.length > 0 
          ? dataKeys.map(key => data.map((item: any) => Number(item[key]) || 0))
          : [data.map((item: any) => Number(item.value || item.y || 0))];
        series = dataKeys.length > 0 
          ? dataKeys.map(key => key.charAt(0).toUpperCase() + key.slice(1))
          : ['Data'];
      } else {
        return;
      }

      if (selectedType === 'bar') {
        // Bar chart
        const x = d3.scaleBand()
          .domain(labels)
          .range([margin.left, width - margin.right])
          .padding(0.1);

        const y = d3.scaleLinear()
          .domain([0, d3.max(values.flat()) || 0])
          .range([height - margin.bottom, margin.top]);

        // Add bars for each series
        values.forEach((seriesValues, seriesIndex) => {
          svg.selectAll(`.bar-series-${seriesIndex}`)
            .data(seriesValues)
            .enter()
            .append('rect')
            .attr('class', `bar-series-${seriesIndex}`)
            .attr('x', (d: number, i: number) => x(labels[i])! + (x.bandwidth() / values.length) * seriesIndex)
            .attr('y', (d: number) => y(d))
            .attr('width', x.bandwidth() / values.length)
            .attr('height', (d: number) => height - margin.bottom - y(d))
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
          .domain(labels)
          .range([margin.left, width - margin.right]);

        const y = d3.scaleLinear()
          .domain([0, d3.max(values.flat()) || 0])
          .range([height - margin.bottom, margin.top]);

        const line = d3.line()
          .x((d: number, i: number) => x(labels[i])! + x.bandwidth() / 2)
          .y((d: number) => y(d));

        // Add lines for each series
        values.forEach((seriesValues, seriesIndex) => {
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
            .attr('cx', (d: number, i: number) => x(labels[i])! + x.bandwidth() / 2)
            .attr('cy', (d: number) => y(d))
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
          .value((d: number) => d);

        const arc = d3.arc()
          .innerRadius(selectedSubtype === 'donut' ? radius * 0.5 : 0)
          .outerRadius(radius);

        g.selectAll('path')
          .data(pie(values[0]))
          .enter()
          .append('path')
          .attr('d', arc)
          .attr('fill', (d: any, i: number) => theme.colors[i % theme.colors.length])
          .attr('stroke', theme.background)
          .attr('stroke-width', 2);

      } else if (selectedType === 'radar') {
        // Radar chart
        const radius = Math.min(width, height) / 2 - margin.top;
        const g = svg.append('g')
          .attr('transform', `translate(${width / 2},${height / 2})`);

        const angleSlice = (Math.PI * 2) / labels.length;

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
        labels.forEach((label, i) => {
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
        values.forEach((seriesValues, seriesIndex) => {
          const lineGenerator = d3.lineRadial()
            .radius((d: number) => (d / Math.max(...seriesValues)) * radius)
            .angle((d: number, i: number) => angleSlice * i - Math.PI / 2);

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
    } else {
      // Load D3.js dynamically if not already loaded
      const script = document.createElement('script');
      script.src = 'https://d3js.org/d3.v7.min.js';
      
      script.onerror = () => {
        if (containerRef.current) {
          containerRef.current.innerHTML = '<p style="color:red;text-align:center;">Failed to load D3.js library</p>';
        }
      };

      script.onload = () => {
        // Re-run the chart creation after D3 loads
        if (containerRef.current && typeof (window as any).d3 !== 'undefined') {
          // Clear container and recreate chart
          containerRef.current.innerHTML = '';
          const d3 = (window as any).d3;
          
          const width = containerRef.current.clientWidth;
          const height = 400;
          const margin = { top: 20, right: 20, bottom: 40, left: 60 };

          const svg = d3.select(containerRef.current)
            .append('svg')
            .attr('width', width)
            .attr('height', height);

          // Handle different data formats
          let labels: string[];
          let values: number[][];
          let series: string[];

          if (data.labels && data.values && data.series) {
            // D3 format from conversion
            labels = data.labels;
            values = data.values;
            series = data.series;
          } else if (data.labels && data.datasets) {
            // Chart.js format
            labels = data.labels;
            values = data.datasets.map((dataset: any) => dataset.data);
            series = data.datasets.map((dataset: any) => dataset.label);
          } else if (data.data && data.data.datasets) {
            // Nested data structure (like sample data)
            labels = data.data.labels || [];
            values = data.data.datasets.map((dataset: any) => dataset.data);
            series = data.data.datasets.map((dataset: any) => dataset.label);
          } else if (data.datasets && !data.labels) {
            // Datasets-only format (like scatter charts)
            labels = [];
            values = data.datasets.map((dataset: any) => dataset.data);
            series = data.datasets.map((dataset: any) => dataset.label);
          } else if (Array.isArray(data)) {
            // Legacy array format
            const firstItem = data[0];
            const keys = Object.keys(firstItem);
            const dataKeys = keys.filter(key => 
              !['category', 'label', 'axis', 'month', 'x', 'y'].includes(key)
            );
            
            labels = data.map((item: any) => 
              item.category || item.label || item.axis || item.month || item.x || `Item ${data.indexOf(item)}`
            );
            values = dataKeys.length > 0 
              ? dataKeys.map(key => data.map((item: any) => Number(item[key]) || 0))
              : [data.map((item: any) => Number(item.value || item.y || 0))];
            series = dataKeys.length > 0 
              ? dataKeys.map(key => key.charAt(0).toUpperCase() + key.slice(1))
              : ['Data'];
          } else {
            return;
          }

          if (selectedType === 'bar') {
            // Bar chart
            const x = d3.scaleBand()
              .domain(labels)
              .range([margin.left, width - margin.right])
              .padding(0.1);

            const y = d3.scaleLinear()
              .domain([0, d3.max(values.flat()) || 0])
              .range([height - margin.bottom, margin.top]);

            // Add bars for each series
            values.forEach((seriesValues, seriesIndex) => {
              svg.selectAll(`.bar-series-${seriesIndex}`)
                .data(seriesValues)
                .enter()
                .append('rect')
                .attr('class', `bar-series-${seriesIndex}`)
                .attr('x', (d: number, i: number) => x(labels[i])! + (x.bandwidth() / values.length) * seriesIndex)
                .attr('y', (d: number) => y(d))
                .attr('width', x.bandwidth() / values.length)
                .attr('height', (d: number) => height - margin.bottom - y(d))
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
              .domain(labels)
              .range([margin.left, width - margin.right]);

            const y = d3.scaleLinear()
              .domain([0, d3.max(values.flat()) || 0])
              .range([height - margin.bottom, margin.top]);

            const line = d3.line()
              .x((d: number, i: number) => x(labels[i])! + x.bandwidth() / 2)
              .y((d: number) => y(d));

            // Add lines for each series
            values.forEach((seriesValues, seriesIndex) => {
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
                .attr('cx', (d: number, i: number) => x(labels[i])! + x.bandwidth() / 2)
                .attr('cy', (d: number) => y(d))
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

            const pie = d3.pie();
            const arc = d3.arc()
              .innerRadius(0)
              .outerRadius(radius);

            const pieData = values[0] || [];
            const arcs = pie(pieData);

            g.selectAll('path')
              .data(arcs)
              .enter()
              .append('path')
              .attr('d', arc)
              .attr('fill', (d: any, i: number) => theme.colors[i % theme.colors.length])
              .attr('stroke', theme.background)
              .attr('stroke-width', 2);

          } else if (selectedType === 'radar') {
            // Radar chart
            const radius = Math.min(width, height) / 2 - margin.top;
            const g = svg.append('g')
              .attr('transform', `translate(${width / 2},${height / 2})`);

            const angleSlice = (Math.PI * 2) / labels.length;

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
            labels.forEach((label, i) => {
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
            values.forEach((seriesValues, seriesIndex) => {
              const lineGenerator = d3.lineRadial()
                .radius((d: number) => (d / Math.max(...seriesValues)) * radius)
                .angle((d: number, i: number) => angleSlice * i - Math.PI / 2);

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
    }

    return () => {
      // Don't remove script element — D3 stays on window and subsequent
      // renders take the fast path without re-adding the script tag.
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
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

export default D3Preview; 