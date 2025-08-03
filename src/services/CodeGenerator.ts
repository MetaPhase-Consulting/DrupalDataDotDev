import { Theme } from '../types/Theme';

export interface CodeGeneratorConfig {
  selectedType: string;
  selectedSubtype: string;
  selectedLibrary: string;
  selectedTheme: Theme;
  selectedOptions: Record<string, any>;
  data: any[];
}

export class CodeGenerator {
  static generateCode(config: CodeGeneratorConfig): string {
    const { selectedType, selectedLibrary } = config;
    
    // Generate actual working code based on visualization type and library
    if (selectedType === 'bar' && selectedLibrary === 'chartjs') {
      return this.generateChartJSBarCode(config);
    }
    
    // Fallback to configuration object
    return this.generateConfigObject(config);
  }

  private static generateChartJSBarCode(config: CodeGeneratorConfig): string {
    const { data, selectedOptions, selectedTheme } = config;
    const labels = data.map(item => item.category || item.label || item.name);
    const values = data.map(item => item.value || item.data || 0);
    
    const themeColors = selectedTheme?.palette || ['#0074BD', '#00C9FF', '#E5F1FF', '#1F2937', '#4A90C2', '#B3D9FF'];
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Drupal Data Visualization - Bar Visualization</title>
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
        <h1 class="chart-title">Bar Visualization</h1>
        <canvas id="barChart"></canvas>
    </div>

    <script>
        // Chart.js Bar Visualization Configuration
        const ctx = document.getElementById('barChart').getContext('2d');
        
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
            type: 'bar',
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
                        text: 'Bar Visualization Data',
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