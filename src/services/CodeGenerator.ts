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
      case 'plotly':
        return this.generatePlotlyJavaScriptEmbed(config);
      case 'highcharts':
        return this.generateHighchartsJavaScriptEmbed(config);
      case 'apexcharts':
        return this.generateApexChartsJavaScriptEmbed(config);
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
      case 'plotly':
        return this.generatePlotlyStaticHTML(config);
      case 'highcharts':
        return this.generateHighchartsStaticHTML(config);
      case 'apexcharts':
        return this.generateApexChartsStaticHTML(config);
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
    const labels = data.map(item => item.category || item.label || item.name);
    const values = data.map(item => item.value || item.data || 0);
    
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

  private static generateD3JavaScriptEmbed(config: CodeGeneratorConfig): string {
    const { data, selectedOptions, selectedTheme } = config;
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

  private static generatePlotlyJavaScriptEmbed(config: CodeGeneratorConfig): string {
    const { selectedType, selectedSubtype, data, selectedOptions, selectedTheme } = config;
    const labels = data.map(item => item.category || item.label || item.name);
    const values = data.map(item => item.value || item.data || 0);
    
    const themeColors = selectedTheme?.palette || ['#0074BD', '#00C9FF', '#E5F1FF', '#1F2937', '#4A90C2', '#B3D9FF'];
    const chartType = this.getPlotlyChartType(selectedType, selectedSubtype);
    
    return `<div id="chart-container" style="max-width: 800px; margin: 0 auto; padding: 20px;">
  <div id="plotly-chart"></div>
</div>

<script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
<script>
  // Plotly.js JavaScript Embed
  const data = ${JSON.stringify(data)};
  const labels = ${JSON.stringify(labels)};
  const values = ${JSON.stringify(values)};
  const colors = ${JSON.stringify(themeColors.slice(0, values.length))};
  
  const trace = {
    x: labels,
    y: values,
    type: '${chartType}',
    marker: {
      color: colors,
      line: {
        color: colors,
        width: 1
      }
    }
  };
  
  const layout = {
    title: 'Chart Visualization',
    xaxis: {
      title: 'Categories'
    },
    yaxis: {
      title: 'Values'
    },
    plot_bgcolor: '${selectedTheme?.colors?.surface || '#1F2937'}',
    paper_bgcolor: '${selectedTheme?.colors?.background || '#0E1B2A'}',
    font: {
      color: '${selectedTheme?.colors?.text || '#E5F1FF'}'
    }
  };
  
  Plotly.newPlot('plotly-chart', [trace], layout);
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

  private static generateApexChartsJavaScriptEmbed(config: CodeGeneratorConfig): string {
    const { selectedType, selectedSubtype, data, selectedOptions, selectedTheme } = config;
    const labels = data.map(item => item.category || item.label || item.name);
    const values = data.map(item => item.value || item.data || 0);
    
    const themeColors = selectedTheme?.palette || ['#0074BD', '#00C9FF', '#E5F1FF', '#1F2937', '#4A90C2', '#B3D9FF'];
    const chartType = this.getApexChartsChartType(selectedType, selectedSubtype);
    
    return `<div id="chart-container" style="max-width: 800px; margin: 0 auto; padding: 20px;">
  <div id="apexcharts-chart"></div>
</div>

<script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
<script>
  // ApexCharts JavaScript Embed
  const data = ${JSON.stringify(data)};
  const labels = ${JSON.stringify(labels)};
  const values = ${JSON.stringify(values)};
  const colors = ${JSON.stringify(themeColors.slice(0, values.length))};
  
  const options = {
    series: [{
      name: 'Values',
      data: values
    }],
    chart: {
      type: '${chartType}',
      height: 350,
      background: '${selectedTheme?.colors?.surface || '#1F2937'}',
      foreColor: '${selectedTheme?.colors?.text || '#E5F1FF'}'
    },
    colors: colors,
    xaxis: {
      categories: labels
    },
    title: {
      text: 'Chart Visualization',
      style: {
        color: '${selectedTheme?.colors?.text || '#E5F1FF'}'
      }
    }
  };
  
  const chart = new ApexCharts(document.querySelector('#apexcharts-chart'), options);
  chart.render();
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

  private static generatePlotlyStaticHTML(config: CodeGeneratorConfig): string {
    const { selectedType, selectedSubtype, data, selectedOptions, selectedTheme } = config;
    const labels = data.map(item => item.category || item.label || item.name);
    const values = data.map(item => item.value || item.data || 0);
    
    const themeColors = selectedTheme?.palette || ['#0074BD', '#00C9FF', '#E5F1FF', '#1F2937', '#4A90C2', '#B3D9FF'];
    const chartType = this.getPlotlyChartType(selectedType, selectedSubtype);
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Drupal Data Visualization - Plotly.js</title>
    <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
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
        <div id="plotly-chart"></div>
    </div>

    <script>
        // Plotly.js Static HTML
        const data = ${JSON.stringify(data)};
        const labels = ${JSON.stringify(labels)};
        const values = ${JSON.stringify(values)};
        const colors = ${JSON.stringify(themeColors.slice(0, values.length))};
        
        const trace = {
          x: labels,
          y: values,
          type: '${chartType}',
          marker: {
            color: colors,
            line: {
              color: colors,
              width: 1
            }
          }
        };
        
        const layout = {
          title: 'Chart Visualization',
          xaxis: {
            title: 'Categories'
          },
          yaxis: {
            title: 'Values'
          },
          plot_bgcolor: '${selectedTheme?.colors?.surface || '#1F2937'}',
          paper_bgcolor: '${selectedTheme?.colors?.background || '#0E1B2A'}',
          font: {
            color: '${selectedTheme?.colors?.text || '#E5F1FF'}'
          }
        };
        
        Plotly.newPlot('plotly-chart', [trace], layout);
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

  private static generateApexChartsStaticHTML(config: CodeGeneratorConfig): string {
    const { selectedType, selectedSubtype, data, selectedOptions, selectedTheme } = config;
    const labels = data.map(item => item.category || item.label || item.name);
    const values = data.map(item => item.value || item.data || 0);
    
    const themeColors = selectedTheme?.palette || ['#0074BD', '#00C9FF', '#E5F1FF', '#1F2937', '#4A90C2', '#B3D9FF'];
    const chartType = this.getApexChartsChartType(selectedType, selectedSubtype);
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Drupal Data Visualization - ApexCharts</title>
    <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
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
        <div id="apexcharts-chart"></div>
    </div>

    <script>
        // ApexCharts Static HTML
        const data = ${JSON.stringify(data)};
        const labels = ${JSON.stringify(labels)};
        const values = ${JSON.stringify(values)};
        const colors = ${JSON.stringify(themeColors.slice(0, values.length))};
        
        const options = {
          series: [{
            name: 'Values',
            data: values
          }],
          chart: {
            type: '${chartType}',
            height: 350,
            background: '${selectedTheme?.colors?.surface || '#1F2937'}',
            foreColor: '${selectedTheme?.colors?.text || '#E5F1FF'}'
          },
          colors: colors,
          xaxis: {
            categories: labels
          },
          title: {
            text: 'Chart Visualization',
            style: {
              color: '${selectedTheme?.colors?.text || '#E5F1FF'}'
            }
          }
        };
        
        const chart = new ApexCharts(document.querySelector('#apexcharts-chart'), options);
        chart.render();
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

  private static getPlotlyChartType(selectedType: string, selectedSubtype: string): string {
    // Map visualization types to Plotly chart types
    switch (selectedType) {
      case 'bar':
        return 'bar';
      case 'line':
        return 'scatter';
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

  private static getApexChartsChartType(selectedType: string, selectedSubtype: string): string {
    // Map visualization types to ApexCharts chart types
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