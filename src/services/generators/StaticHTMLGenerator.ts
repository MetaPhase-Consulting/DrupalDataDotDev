/* eslint-disable @typescript-eslint/no-unused-vars */
import { CodeGeneratorConfig } from './types';
import { BaseGenerator } from './BaseGenerator';

export class StaticHTMLGenerator extends BaseGenerator {
  static generateCode(config: CodeGeneratorConfig): string {
    const { selectedLibrary } = config;
    
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

  private static generateChartJSStaticHTML(config: CodeGeneratorConfig): string {
    const { selectedType, selectedSubtype, data, selectedOptions, selectedTheme } = config;
    
    // Normalize data format to handle nested structures
    const normalizedData = this.normalizeDataFormat(data);
    const labels = normalizedData.labels;
    const values = normalizedData.datasets[0]?.data || [];
    
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

  private static generateD3StaticHTML(config: CodeGeneratorConfig): string {
    const { data, selectedOptions, selectedTheme } = config;
    
    // Normalize data format to handle nested structures
    const normalizedData = this.normalizeDataFormat(data);
    const labels = normalizedData.labels;
    const values = normalizedData.datasets[0]?.data || [];
    
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
    
    // Normalize data format to handle nested structures
    const normalizedData = this.normalizeDataFormat(data);
    const labels = normalizedData.labels;
    const values = normalizedData.datasets[0]?.data || [];
    
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
    
    // Normalize data format to handle nested structures
    const normalizedData = this.normalizeDataFormat(data);
    const labels = normalizedData.labels;
    const values = normalizedData.datasets[0]?.data || [];
    
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
        // Map data processed
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
        // Map data processed
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
        
        // Chart configuration processed
        // Implementation for ${selectedLibrary} would go here
    </script>
</body>
</html>`;
  }
} 