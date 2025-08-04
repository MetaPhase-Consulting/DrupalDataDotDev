import { Theme } from '../types/Theme';

export interface CodeGeneratorConfig {
  selectedType: string;
  selectedSubtype: string;
  selectedLibrary: string;
  selectedOutputFormat: string;
  selectedTheme: Theme;
  selectedOptions: Record<string, any>;
  data: any[];
}

export class CodeGenerator {
  // Helper function to normalize data format
  private static normalizeDataFormat(data: any): { labels: string[], datasets: any[] } {
    if (data && typeof data === 'object' && !Array.isArray(data) && 'labels' in data && 'datasets' in data) {
      // Chart.js format data
      return {
        labels: data.labels,
        datasets: data.datasets
      };
    } else if (Array.isArray(data)) {
      // Array format data (legacy support)
      const labels = data.map(item => item.category || item.label || item.name || 'Item');
      const values = data.map(item => item.value || item.data || 0);
      return {
        labels,
        datasets: [{
          label: 'Values',
          data: values
        }]
      };
    } else {
      // Fallback for empty or invalid data
      return {
        labels: ['No Data'],
        datasets: [{
          label: 'Values',
          data: [0]
        }]
      };
    }
  }

  static generateCode(config: CodeGeneratorConfig): string {
    const { selectedType, selectedLibrary, selectedOutputFormat } = config;
    
    // Generate code based on output format
    switch (selectedOutputFormat) {
      case 'javascript-embed':
        return this.generateJavaScriptEmbed(config);
      case 'static-html':
        return this.generateStaticHTML(config);
      case 'drupal-block':
        return this.generateDrupalBlock(config);
      case 'drupal-controller':
        return this.generateDrupalController(config);
      default:
        return this.generateJavaScriptEmbed(config);
    }
  }

  private static generateJavaScriptEmbed(config: CodeGeneratorConfig): string {
    const { selectedType, selectedLibrary, data, selectedOptions, selectedTheme } = config;
    
    switch (selectedLibrary) {
      case 'chartjs':
        return this.generateChartJSJavaScriptEmbed(config);
      case 'd3':
        return this.generateD3JavaScriptEmbed(config);
      case 'highcharts':
        return this.generateHighchartsJavaScriptEmbed(config);
      case 'echarts':
        return this.generateEChartsJavaScriptEmbed(config);
      case 'openlayers':
        return this.generateOpenLayersJavaScriptEmbed(config);
      case 'leaflet':
        return this.generateLeafletJavaScriptEmbed(config);
      default:
        return this.generateGenericJavaScriptEmbed(config);
    }
  }

  private static generateStaticHTML(config: CodeGeneratorConfig): string {
    const { selectedType, selectedLibrary, data, selectedOptions, selectedTheme } = config;
    
    switch (selectedLibrary) {
      case 'chartjs':
        return this.generateChartJSStaticHTML(config);
      case 'd3':
        return this.generateD3StaticHTML(config);
      case 'highcharts':
        return this.generateHighchartsStaticHTML(config);
      case 'echarts':
        return this.generateEChartsStaticHTML(config);
      case 'openlayers':
        return this.generateOpenLayersStaticHTML(config);
      case 'leaflet':
        return this.generateLeafletStaticHTML(config);
      default:
        return this.generateGenericStaticHTML(config);
    }
  }

  private static generateDrupalBlock(config: CodeGeneratorConfig): string {
    const { selectedType, selectedLibrary, data, selectedOptions, selectedTheme } = config;
    
    return `<?php

/**
 * @file
 * Generated ${selectedType} chart block using ${selectedLibrary}.
 * Generated on: ${new Date().toISOString()}
 */

namespace Drupal\\${this.getModuleName(selectedType, selectedLibrary)}\\Plugin\\Block;

use Drupal\\Core\\Block\\BlockBase;
use Drupal\\Core\\Form\\FormStateInterface;

/**
 * Provides a ${selectedType} chart block.
 *
 * @Block(
 *   id = "${this.getModuleName(selectedType, selectedLibrary)}_chart",
 *   admin_label = @Translation("${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Chart"),
 *   category = @Translation("Charts")
 * )
 */
class ${this.getClassName(selectedType, selectedLibrary)}Block extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {
    return [
      '#type' => 'html_tag',
      '#tag' => 'div',
      '#attributes' => [
        'id' => '${this.getModuleName(selectedType, selectedLibrary)}-chart',
        'class' => ['chart-container'],
      ],
      '#attached' => [
        'library' => ['${this.getModuleName(selectedType, selectedLibrary)}/chart-js'],
        'drupalSettings' => [
          '${this.getModuleName(selectedType, selectedLibrary)}' => [
            'chartData' => ${JSON.stringify(data, null, 2)},
            'chartOptions' => ${JSON.stringify(selectedOptions, null, 2)},
            'theme' => '${selectedTheme.id}',
          ],
        ],
      ],
    ];
  }

}`;
  }

  private static generateDrupalController(config: CodeGeneratorConfig): string {
    const { selectedType, selectedLibrary, data, selectedOptions, selectedTheme } = config;
    
    return `<?php

/**
 * @file
 * Generated ${selectedType} chart controller using ${selectedLibrary}.
 * Generated on: ${new Date().toISOString()}
 */

namespace Drupal\\${this.getModuleName(selectedType, selectedLibrary)}\\Controller;

use Drupal\\Core\\Controller\\ControllerBase;
use Symfony\\Component\\HttpFoundation\\JsonResponse;

/**
 * Controller for ${selectedType} chart.
 */
class ${this.getClassName(selectedType, selectedLibrary)}Controller extends ControllerBase {

  /**
   * Returns the chart page.
   */
  public function chartPage() {
    return [
      '#type' => 'html_tag',
      '#tag' => 'div',
      '#attributes' => [
        'id' => '${this.getModuleName(selectedType, selectedLibrary)}-chart',
        'class' => ['chart-container'],
      ],
      '#attached' => [
        'library' => ['${this.getModuleName(selectedType, selectedLibrary)}/chart-js'],
        'drupalSettings' => [
          '${this.getModuleName(selectedType, selectedLibrary)}' => [
            'chartData' => ${JSON.stringify(data, null, 2)},
            'chartOptions' => ${JSON.stringify(selectedOptions, null, 2)},
            'theme' => '${selectedTheme.id}',
          ],
        ],
      ],
    ];
  }

  /**
   * Returns chart data as JSON.
   */
  public function chartData() {
    return new JsonResponse([
      'data' => ${JSON.stringify(data, null, 2)},
      'options' => ${JSON.stringify(selectedOptions, null, 2)},
      'theme' => '${selectedTheme.id}',
    ]);
  }

}`;
  }

  private static generateChartJSJavaScriptEmbed(config: CodeGeneratorConfig): string {
    const { selectedType, selectedSubtype, data, selectedOptions, selectedTheme } = config;
    
    // Normalize data format
    const { labels, datasets } = this.normalizeDataFormat(data);
    
    const themeColors = selectedTheme?.palette || ['#0074BD', '#00C9FF', '#E5F1FF', '#1F2937', '#4A90C2', '#B3D9FF'];
    
    // Determine chart type based on selected type and subtype
    const chartType = this.getChartType(selectedType, selectedSubtype);
    
    return `<div id="chart-container" style="max-width: 800px; margin: 0 auto; padding: 20px;">
  <canvas id="chartCanvas"></canvas>
</div>

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
  // Chart.js JavaScript Embed
  const ctx = document.getElementById('chartCanvas').getContext('2d');
  
  const chartData = {
    labels: ${JSON.stringify(labels)},
    datasets: ${JSON.stringify(datasets.map((dataset, index) => ({
      ...dataset,
      backgroundColor: dataset.backgroundColor || themeColors[index % themeColors.length] + '80',
      borderColor: dataset.borderColor || themeColors[index % themeColors.length],
      borderWidth: dataset.borderWidth || 2,
      borderRadius: selectedOptions.roundedCorners ? 8 : 0,
      borderSkipped: false,
    })))}
  };

  const config = {
    type: '${chartType}',
    data: chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: 'Chart Visualization',
          color: '${selectedTheme?.colors?.text || '#E5F1FF'}',
          font: {
            size: 16,
            weight: 'bold'
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: '${selectedTheme?.colors?.textSecondary || '#B3D9FF'}20'
          },
          ticks: {
            color: '${selectedTheme?.colors?.textSecondary || '#B3D9FF'}'
          }
        },
        x: {
          grid: {
            color: '${selectedTheme?.colors?.textSecondary || '#B3D9FF'}20'
          },
          ticks: {
            color: '${selectedTheme?.colors?.textSecondary || '#B3D9FF'}',
            maxRotation: ${selectedOptions.axisLabelRotation === 'auto' ? 45 : selectedOptions.axisLabelRotation || 0}
          }
        }
      }
    }
  };

  new Chart(ctx, config);
</script>`;
  }

  private static generateChartJSStaticHTML(config: CodeGeneratorConfig): string {
    const { selectedType, selectedSubtype, data, selectedOptions, selectedTheme } = config;
    const labels = data.map(item => item.category || item.label || item.name);
    const values = data.map(item => item.value || item.data || 0);
    
    const themeColors = selectedTheme?.palette || ['#0074BD', '#00C9FF', '#E5F1FF', '#1F2937', '#4A90C2', '#B3D9FF'];
    const chartType = this.getChartType(selectedType, selectedSubtype);
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Drupal Data Visualization - Static HTML</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        body {
            font-family: '${selectedTheme?.fonts?.[0] || 'Inter'}', system-ui, sans-serif;
            background-color: ${selectedTheme?.colors?.background || '#0E1B2A'};
            color: ${selectedTheme?.colors?.text || '#E5F1FF'};
            margin: 0;
            padding: 20px;
        }
        .chart-container {
            max-width: 800px;
            margin: 0 auto;
            background-color: ${selectedTheme?.colors?.surface || '#1F2937'};
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .chart-title {
            text-align: center;
            color: ${selectedTheme?.colors?.primary || '#0074BD'};
            margin-bottom: 20px;
            font-size: 1.5rem;
            font-weight: bold;
        }
        canvas {
            max-height: 400px;
        }
    </style>
</head>
<body>
    <div class="chart-container">
        <h1 class="chart-title">Chart Visualization</h1>
        <canvas id="chartCanvas"></canvas>
    </div>

    <script>
        // Chart.js Static HTML
        const ctx = document.getElementById('chartCanvas').getContext('2d');
        
        const chartData = {
            labels: ${JSON.stringify(labels)},
            datasets: [{
                label: 'Values',
                data: ${JSON.stringify(values)},
                backgroundColor: ${JSON.stringify(themeColors.slice(0, values.length))},
                borderColor: ${JSON.stringify(themeColors.slice(0, values.length))},
                borderWidth: 2,
                borderRadius: ${selectedOptions.roundedCorners ? 8 : 0},
                borderSkipped: false,
            }]
        };

        const config = {
            type: '${chartType}',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Chart Visualization',
                        color: '${selectedTheme?.colors?.text || '#E5F1FF'}',
                        font: {
                            size: 16,
                            weight: 'bold'
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: '${selectedTheme?.colors?.textSecondary || '#B3D9FF'}20'
                        },
                        ticks: {
                            color: '${selectedTheme?.colors?.textSecondary || '#B3D9FF'}'
                        }
                    },
                    x: {
                        grid: {
                            color: '${selectedTheme?.colors?.textSecondary || '#B3D9FF'}20'
                        },
                        ticks: {
                            color: '${selectedTheme?.colors?.textSecondary || '#B3D9FF'}',
                            maxRotation: ${selectedOptions.axisLabelRotation === 'auto' ? 45 : selectedOptions.axisLabelRotation || 0}
                        }
                    }
                }
            }
        };

        new Chart(ctx, config);
    </script>
</body>
</html>`;
  }

  private static generateD3JavaScriptEmbed(config: CodeGeneratorConfig): string {
    const { selectedType, data, selectedOptions, selectedTheme } = config;
    const labels = data.map(item => item.category || item.label || item.name);
    const values = data.map(item => item.value || item.data || 0);
    
    const themeColors = selectedTheme?.palette || ['#0074BD', '#00C9FF', '#E5F1FF', '#1F2937', '#4A90C2', '#B3D9FF'];
    
    return `<div id="chart-container" style="max-width: 800px; margin: 0 auto; padding: 20px;">
  <div id="d3-chart"></div>
</div>

<script src="https://d3js.org/d3.v7.min.js"></script>
<script>
  // D3.js JavaScript Embed
  const data = ${JSON.stringify(data)};
  const labels = ${JSON.stringify(labels)};
  const values = ${JSON.stringify(values)};
  const colors = ${JSON.stringify(themeColors.slice(0, values.length))};
  
  const margin = { top: 20, right: 20, bottom: 30, left: 40 };
  const width = 800 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;
  
  const svg = d3.select('#d3-chart')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', \`translate(\${margin.left},\${margin.top})\`);
  
  const x = d3.scaleBand()
    .range([0, width])
    .domain(labels)
    .padding(0.1);
  
  const y = d3.scaleLinear()
    .domain([0, d3.max(values)])
    .range([height, 0]);
  
  svg.append('g')
    .attr('transform', \`translate(0,\${height})\`)
    .call(d3.axisBottom(x));
  
  svg.append('g')
    .call(d3.axisLeft(y));
  
  svg.selectAll('rect')
    .data(values)
    .enter()
    .append('rect')
    .attr('x', (d, i) => x(labels[i]))
    .attr('y', d => y(d))
    .attr('width', x.bandwidth())
    .attr('height', d => height - y(d))
    .attr('fill', (d, i) => colors[i % colors.length]);
</script>`;
  }

  private static generateHighchartsJavaScriptEmbed(config: CodeGeneratorConfig): string {
    const { selectedType, selectedSubtype, data, selectedOptions, selectedTheme } = config;
    const labels = data.map(item => item.category || item.label || item.name);
    const values = data.map(item => item.value || item.data || 0);
    
    const themeColors = selectedTheme?.palette || ['#0074BD', '#00C9FF', '#E5F1FF', '#1F2937', '#4A90C2', '#B3D9FF'];
    const chartType = this.getHighchartsChartType(selectedType, selectedSubtype);
    
    return `<div id="chart-container" style="max-width: 800px; margin: 0 auto; padding: 20px;">
  <div id="highcharts-chart"></div>
</div>

<script src="https://code.highcharts.com/highcharts.js"></script>
<script>
  // Highcharts JavaScript Embed
  const data = ${JSON.stringify(data)};
  const labels = ${JSON.stringify(labels)};
  const values = ${JSON.stringify(values)};
  const colors = ${JSON.stringify(themeColors.slice(0, values.length))};
  
  Highcharts.chart('highcharts-chart', {
    chart: {
      type: '${chartType}',
      backgroundColor: '${selectedTheme?.colors?.surface || '#1F2937'}'
    },
    title: {
      text: 'Chart Visualization',
      style: {
        color: '${selectedTheme?.colors?.text || '#E5F1FF'}'
      }
    },
    xAxis: {
      categories: labels,
      labels: {
        style: {
          color: '${selectedTheme?.colors?.text || '#E5F1FF'}'
        }
      }
    },
    yAxis: {
      title: {
        text: 'Values',
        style: {
          color: '${selectedTheme?.colors?.text || '#E5F1FF'}'
        }
      },
      labels: {
        style: {
          color: '${selectedTheme?.colors?.text || '#E5F1FF'}'
        }
      }
    },
    series: [{
      name: 'Values',
      data: values,
      color: colors[0]
    }],
    credits: {
      enabled: false
    }
  });
</script>`;
  }

  private static generateEChartsJavaScriptEmbed(config: CodeGeneratorConfig): string {
    const { selectedType, selectedSubtype, data, selectedOptions, selectedTheme } = config;
    const labels = data.map(item => item.category || item.label || item.name);
    const values = data.map(item => item.value || item.data || 0);
    
    const themeColors = selectedTheme?.palette || ['#0074BD', '#00C9FF', '#E5F1FF', '#1F2937', '#4A90C2', '#B3D9FF'];
    const chartType = this.getEChartsChartType(selectedType, selectedSubtype);
    
    return `<div id="chart-container" style="max-width: 800px; margin: 0 auto; padding: 20px;">
  <div id="echarts-chart" style="width: 100%; height: 400px;"></div>
</div>

<script src="https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js"></script>
<script>
  // Apache ECharts JavaScript Embed
  const data = ${JSON.stringify(data)};
  const labels = ${JSON.stringify(labels)};
  const values = ${JSON.stringify(values)};
  const colors = ${JSON.stringify(themeColors.slice(0, values.length))};
  
  const chartDom = document.getElementById('echarts-chart');
  const myChart = echarts.init(chartDom);
  
  const option = {
    title: {
      text: 'Chart Visualization',
      textStyle: {
        color: '${selectedTheme?.colors?.text || '#E5F1FF'}'
      }
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: labels,
      axisLabel: {
        color: '${selectedTheme?.colors?.text || '#E5F1FF'}'
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '${selectedTheme?.colors?.text || '#E5F1FF'}'
      }
    },
    series: [{
      data: values,
      type: '${chartType}',
      itemStyle: {
        color: colors[0]
      }
    }],
    backgroundColor: '${selectedTheme?.colors?.surface || '#1F2937'}'
  };
  
  myChart.setOption(option);
</script>`;
  }

  private static generateOpenLayersJavaScriptEmbed(config: CodeGeneratorConfig): string {
    const { data, selectedOptions, selectedTheme } = config;
    
    return `<div id="chart-container" style="max-width: 800px; margin: 0 auto; padding: 20px;">
  <div id="openlayers-map" style="width: 100%; height: 400px;"></div>
</div>

<script src="https://cdn.jsdelivr.net/npm/ol@7.4.0/dist/ol.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ol@7.4.0/ol.css">
<script>
  // OpenLayers JavaScript Embed
  const data = ${JSON.stringify(data)};
  
  const map = new ol.Map({
    target: 'openlayers-map',
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      })
    ],
    view: new ol.View({
      center: ol.proj.fromLonLat([0, 0]),
      zoom: 2
    })
  });
  
  // Add markers or other map features based on data
  console.log('Map data:', data);
</script>`;
  }

  private static generateLeafletJavaScriptEmbed(config: CodeGeneratorConfig): string {
    const { data, selectedOptions, selectedTheme } = config;
    
    return `<div id="chart-container" style="max-width: 800px; margin: 0 auto; padding: 20px;">
  <div id="leaflet-map" style="width: 100%; height: 400px;"></div>
</div>

<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
<script>
  // Leaflet JavaScript Embed
  const data = ${JSON.stringify(data)};
  
  const map = L.map('leaflet-map').setView([0, 0], 2);
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);
  
  // Add markers or other map features based on data
  console.log('Map data:', data);
</script>`;
  }

  private static generateGenericJavaScriptEmbed(config: CodeGeneratorConfig): string {
    const { selectedType, selectedLibrary, data, selectedOptions, selectedTheme } = config;
    
    return `<div id="chart-container" style="max-width: 800px; margin: 0 auto; padding: 20px;">
  <div id="chart-placeholder">Chart will be rendered here</div>
</div>

<script>
  // Generic JavaScript Embed for ${selectedLibrary}
  const chartData = ${JSON.stringify(data, null, 2)};
  const chartOptions = ${JSON.stringify(selectedOptions, null, 2)};
  const theme = '${selectedTheme.id}';
  
  console.log('Chart configuration:', { chartData, chartOptions, theme });
  // Implementation for ${selectedLibrary} would go here
</script>`;
  }

  private static generateD3StaticHTML(config: CodeGeneratorConfig): string {
    const { data, selectedOptions, selectedTheme } = config;
    const labels = data.map(item => item.category || item.label || item.name);
    const values = data.map(item => item.value || item.data || 0);
    
    const themeColors = selectedTheme?.palette || ['#0074BD', '#00C9FF', '#E5F1FF', '#1F2937', '#4A90C2', '#B3D9FF'];
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Drupal Data Visualization - D3.js</title>
    <script src="https://d3js.org/d3.v7.min.js"></script>
    <style>
        body {
            font-family: '${selectedTheme?.fonts?.[0] || 'Inter'}', system-ui, sans-serif;
            background-color: ${selectedTheme?.colors?.background || '#0E1B2A'};
            color: ${selectedTheme?.colors?.text || '#E5F1FF'};
            margin: 0;
            padding: 20px;
        }
        .chart-container {
            max-width: 800px;
            margin: 0 auto;
            background-color: ${selectedTheme?.colors?.surface || '#1F2937'};
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
    </style>
</head>
<body>
    <div class="chart-container">
        <h1 class="chart-title">Chart Visualization</h1>
        <div id="d3-chart"></div>
    </div>

    <script>
        // D3.js Static HTML
        const data = ${JSON.stringify(data)};
        const labels = ${JSON.stringify(labels)};
        const values = ${JSON.stringify(values)};
        const colors = ${JSON.stringify(themeColors.slice(0, values.length))};
        
        const margin = { top: 20, right: 20, bottom: 30, left: 40 };
        const width = 800 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;
        
        const svg = d3.select('#d3-chart')
          .append('svg')
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .append('g')
          .attr('transform', \`translate(\${margin.left},\${margin.top})\`);
        
        const x = d3.scaleBand()
          .range([0, width])
          .domain(labels)
          .padding(0.1);
        
        const y = d3.scaleLinear()
          .domain([0, d3.max(values)])
          .range([height, 0]);
        
        svg.append('g')
          .attr('transform', \`translate(0,\${height})\`)
          .call(d3.axisBottom(x));
        
        svg.append('g')
          .call(d3.axisLeft(y));
        
        svg.selectAll('rect')
          .data(values)
          .enter()
          .append('rect')
          .attr('x', (d, i) => x(labels[i]))
          .attr('y', d => y(d))
          .attr('width', x.bandwidth())
          .attr('height', d => height - y(d))
          .attr('fill', (d, i) => colors[i % colors.length]);
    </script>
</body>
</html>`;
  }

  private static generateHighchartsStaticHTML(config: CodeGeneratorConfig): string {
    const { selectedType, selectedSubtype, data, selectedOptions, selectedTheme } = config;
    const labels = data.map(item => item.category || item.label || item.name);
    const values = data.map(item => item.value || item.data || 0);
    
    const themeColors = selectedTheme?.palette || ['#0074BD', '#00C9FF', '#E5F1FF', '#1F2937', '#4A90C2', '#B3D9FF'];
    const chartType = this.getHighchartsChartType(selectedType, selectedSubtype);
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Drupal Data Visualization - Highcharts</title>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <style>
        body {
            font-family: '${selectedTheme?.fonts?.[0] || 'Inter'}', system-ui, sans-serif;
            background-color: ${selectedTheme?.colors?.background || '#0E1B2A'};
            color: ${selectedTheme?.colors?.text || '#E5F1FF'};
            margin: 0;
            padding: 20px;
        }
        .chart-container {
            max-width: 800px;
            margin: 0 auto;
            background-color: ${selectedTheme?.colors?.surface || '#1F2937'};
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
    </style>
</head>
<body>
    <div class="chart-container">
        <h1 class="chart-title">Chart Visualization</h1>
        <div id="highcharts-chart"></div>
    </div>

    <script>
        // Highcharts Static HTML
        const data = ${JSON.stringify(data)};
        const labels = ${JSON.stringify(labels)};
        const values = ${JSON.stringify(values)};
        const colors = ${JSON.stringify(themeColors.slice(0, values.length))};
        
        Highcharts.chart('highcharts-chart', {
          chart: {
            type: '${chartType}',
            backgroundColor: '${selectedTheme?.colors?.surface || '#1F2937'}'
          },
          title: {
            text: 'Chart Visualization',
            style: {
              color: '${selectedTheme?.colors?.text || '#E5F1FF'}'
            }
          },
          xAxis: {
            categories: labels,
            labels: {
              style: {
                color: '${selectedTheme?.colors?.text || '#E5F1FF'}'
              }
            }
          },
          yAxis: {
            title: {
              text: 'Values',
              style: {
                color: '${selectedTheme?.colors?.text || '#E5F1FF'}'
              }
            },
            labels: {
              style: {
                color: '${selectedTheme?.colors?.text || '#E5F1FF'}'
              }
            }
          },
          series: [{
            name: 'Values',
            data: values,
            color: colors[0]
          }],
          credits: {
            enabled: false
          }
        });
    </script>
</body>
</html>`;
  }

  private static generateEChartsStaticHTML(config: CodeGeneratorConfig): string {
    const { selectedType, selectedSubtype, data, selectedOptions, selectedTheme } = config;
    const labels = data.map(item => item.category || item.label || item.name);
    const values = data.map(item => item.value || item.data || 0);
    
    const themeColors = selectedTheme?.palette || ['#0074BD', '#00C9FF', '#E5F1FF', '#1F2937', '#4A90C2', '#B3D9FF'];
    const chartType = this.getEChartsChartType(selectedType, selectedSubtype);
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Drupal Data Visualization - Apache ECharts</title>
    <script src="https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js"></script>
    <style>
        body {
            font-family: '${selectedTheme?.fonts?.[0] || 'Inter'}', system-ui, sans-serif;
            background-color: ${selectedTheme?.colors?.background || '#0E1B2A'};
            color: ${selectedTheme?.colors?.text || '#E5F1FF'};
            margin: 0;
            padding: 20px;
        }
        .chart-container {
            max-width: 800px;
            margin: 0 auto;
            background-color: ${selectedTheme?.colors?.surface || '#1F2937'};
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
    </style>
</head>
<body>
    <div class="chart-container">
        <h1 class="chart-title">Chart Visualization</h1>
        <div id="echarts-chart" style="width: 100%; height: 400px;"></div>
    </div>

    <script>
        // Apache ECharts Static HTML
        const data = ${JSON.stringify(data)};
        const labels = ${JSON.stringify(labels)};
        const values = ${JSON.stringify(values)};
        const colors = ${JSON.stringify(themeColors.slice(0, values.length))};
        
        const chartDom = document.getElementById('echarts-chart');
        const myChart = echarts.init(chartDom);
        
        const option = {
          title: {
            text: 'Chart Visualization',
            textStyle: {
              color: '${selectedTheme?.colors?.text || '#E5F1FF'}'
            }
          },
          tooltip: {
            trigger: 'axis'
          },
          xAxis: {
            type: 'category',
            data: labels,
            axisLabel: {
              color: '${selectedTheme?.colors?.text || '#E5F1FF'}'
            }
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              color: '${selectedTheme?.colors?.text || '#E5F1FF'}'
            }
          },
          series: [{
            data: values,
            type: '${chartType}',
            itemStyle: {
              color: colors[0]
            }
          }],
          backgroundColor: '${selectedTheme?.colors?.surface || '#1F2937'}'
        };
        
        myChart.setOption(option);
    </script>
</body>
</html>`;
  }

  private static generateOpenLayersStaticHTML(config: CodeGeneratorConfig): string {
    const { data, selectedOptions, selectedTheme } = config;
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Drupal Data Visualization - OpenLayers</title>
    <script src="https://cdn.jsdelivr.net/npm/ol@7.4.0/dist/ol.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ol@7.4.0/ol.css">
    <style>
        body {
            font-family: '${selectedTheme?.fonts?.[0] || 'Inter'}', system-ui, sans-serif;
            background-color: ${selectedTheme?.colors?.background || '#0E1B2A'};
            color: ${selectedTheme?.colors?.text || '#E5F1FF'};
            margin: 0;
            padding: 20px;
        }
        .chart-container {
            max-width: 800px;
            margin: 0 auto;
            background-color: ${selectedTheme?.colors?.surface || '#1F2937'};
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
    </style>
</head>
<body>
    <div class="chart-container">
        <h1 class="chart-title">Chart Visualization</h1>
        <div id="openlayers-map" style="width: 100%; height: 400px;"></div>
    </div>

    <script>
        // OpenLayers Static HTML
        const data = ${JSON.stringify(data)};
        
        const map = new ol.Map({
          target: 'openlayers-map',
          layers: [
            new ol.layer.Tile({
              source: new ol.source.OSM()
            })
          ],
          view: new ol.View({
            center: ol.proj.fromLonLat([0, 0]),
            zoom: 2
          })
        });
        
        // Add markers or other map features based on data
        console.log('Map data:', data);
    </script>
</body>
</html>`;
  }

  private static generateLeafletStaticHTML(config: CodeGeneratorConfig): string {
    const { data, selectedOptions, selectedTheme } = config;
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Drupal Data Visualization - Leaflet</title>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
    <style>
        body {
            font-family: '${selectedTheme?.fonts?.[0] || 'Inter'}', system-ui, sans-serif;
            background-color: ${selectedTheme?.colors?.background || '#0E1B2A'};
            color: ${selectedTheme?.colors?.text || '#E5F1FF'};
            margin: 0;
            padding: 20px;
        }
        .chart-container {
            max-width: 800px;
            margin: 0 auto;
            background-color: ${selectedTheme?.colors?.surface || '#1F2937'};
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
    </style>
</head>
<body>
    <div class="chart-container">
        <h1 class="chart-title">Chart Visualization</h1>
        <div id="leaflet-map" style="width: 100%; height: 400px;"></div>
    </div>

    <script>
        // Leaflet Static HTML
        const data = ${JSON.stringify(data)};
        
        const map = L.map('leaflet-map').setView([0, 0], 2);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);
        
        // Add markers or other map features based on data
        console.log('Map data:', data);
    </script>
</body>
</html>`;
  }

  private static generateGenericStaticHTML(config: CodeGeneratorConfig): string {
    const { selectedType, selectedLibrary, data, selectedOptions, selectedTheme } = config;
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Drupal Data Visualization - ${selectedLibrary}</title>
    <style>
        body {
            font-family: '${selectedTheme?.fonts?.[0] || 'Inter'}', system-ui, sans-serif;
            background-color: ${selectedTheme?.colors?.background || '#0E1B2A'};
            color: ${selectedTheme?.colors?.text || '#E5F1FF'};
            margin: 0;
            padding: 20px;
        }
        .chart-container {
            max-width: 800px;
            margin: 0 auto;
            background-color: ${selectedTheme?.colors?.surface || '#1F2937'};
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
    </style>
</head>
<body>
    <div class="chart-container">
        <h1>Chart Visualization</h1>
        <div id="chart-placeholder">Chart will be rendered here</div>
    </div>

    <script>
        // Generic Static HTML for ${selectedLibrary}
        const chartData = ${JSON.stringify(data, null, 2)};
        const chartOptions = ${JSON.stringify(selectedOptions, null, 2)};
        const theme = '${selectedTheme.id}';
        
        console.log('Chart configuration:', { chartData, chartOptions, theme });
        // Implementation for ${selectedLibrary} would go here
    </script>
</body>
</html>`;
  }

  private static getModuleName(selectedType: string, selectedLibrary: string): string {
    return `drupal_${selectedType}_${selectedLibrary}`.replace(/[^a-zA-Z0-9_]/g, '_');
  }

  private static getClassName(selectedType: string, selectedLibrary: string): string {
    return `${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}${selectedLibrary.charAt(0).toUpperCase() + selectedLibrary.slice(1)}`;
  }

  private static getChartType(selectedType: string, selectedSubtype: string): string {
    // Map visualization types to Chart.js chart types
    switch (selectedType) {
      case 'bar':
        return 'bar';
      case 'line':
        return 'line';
      case 'pie':
        return 'pie';
      case 'doughnut':
        return 'doughnut';
      case 'radar':
        return 'radar';
      case 'scatter':
        return 'scatter';
      case 'bubble':
        return 'bubble';
      case 'polarArea':
        return 'polarArea';
      default:
        return 'bar'; // Default fallback
    }
  }

  private static getHighchartsChartType(selectedType: string, selectedSubtype: string): string {
    // Map visualization types to Highcharts chart types
    switch (selectedType) {
      case 'bar':
        return 'bar';
      case 'line':
        return 'line';
      case 'pie':
        return 'pie';
      case 'scatter':
        return 'scatter';
      case 'bubble':
        return 'bubble';
      default:
        return 'bar'; // Default fallback
    }
  }

  private static getEChartsChartType(selectedType: string, selectedSubtype: string): string {
    // Map visualization types to ECharts chart types
    switch (selectedType) {
      case 'bar':
        return 'bar';
      case 'line':
        return 'line';
      case 'pie':
        return 'pie';
      case 'scatter':
        return 'scatter';
      case 'bubble':
        return 'scatter';
      default:
        return 'bar'; // Default fallback
    }
  }

  private static generateConfigObject(config: CodeGeneratorConfig): string {
    const { selectedType, selectedSubtype, selectedLibrary, selectedTheme, selectedOptions, data } = config;
    
    return `// Generated ${selectedType} (${selectedSubtype}) Visualization using ${selectedLibrary}
// Theme: ${selectedTheme?.name}
// Generated on: ${new Date().toISOString()}

const visualizationConfig = {
  type: '${selectedType}',
  subtype: '${selectedSubtype}',
  library: '${selectedLibrary}',
  theme: '${selectedTheme?.id}',
  options: ${JSON.stringify(selectedOptions, null, 2)},
  data: ${JSON.stringify(data, null, 2)}
};

// Implementation code would be generated here based on selections
console.log('Visualization configuration:', visualizationConfig);`;
  }
} 