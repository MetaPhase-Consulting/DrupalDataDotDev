import { CodeGeneratorConfig } from './types';
import { BaseGenerator } from './BaseGenerator';

export class DrupalBlockGenerator extends BaseGenerator {
  static generateCode(config: CodeGeneratorConfig): string {
    const { selectedLibrary } = config;
    
    switch (selectedLibrary) {
      case 'chartjs':
        return this.generateChartJSDrupalBlock(config);
      case 'd3':
        return this.generateD3DrupalBlock(config);
      case 'highcharts':
        return this.generateHighchartsDrupalBlock(config);
      case 'echarts':
        return this.generateEChartsDrupalBlock(config);
      case 'openlayers':
        return this.generateOpenLayersDrupalBlock(config);
      case 'leaflet':
        return this.generateLeafletDrupalBlock(config);
      default:
        return this.generateGenericDrupalBlock(config);
    }
  }

  private static generateChartJSDrupalBlock(config: CodeGeneratorConfig): string {
    const { selectedType, selectedLibrary, data, selectedOptions, selectedTheme } = config;
    const { labels, datasets } = this.normalizeDataFormat(data);
    const chartType = this.getChartType(selectedType, config.selectedSubtype);
    const themeColors = selectedTheme?.palette || ['#0074BD', '#00C9FF', '#E5F1FF', '#1F2937', '#4A90C2', '#B3D9FF'];
    
    return `<?php

/**
 * @file
 * Generated ${selectedType} chart block using Chart.js.
 * Generated on: ${new Date().toISOString()}
 */

namespace Drupal\\${this.getModuleName(selectedType, selectedLibrary)}\\Plugin\\Block;

use Drupal\\Core\\Block\\BlockBase;
use Drupal\\Core\\Form\\FormStateInterface;

/**
 * Provides a ${selectedType} chart block using Chart.js.
 *
 * @Block(
 *   id = "${this.getModuleName(selectedType, selectedLibrary)}_chart",
 *   admin_label = @Translation("${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Chart (Chart.js)"),
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
        'style' => 'max-width: 800px; margin: 0 auto; padding: 20px;',
      ],
      '#attached' => [
        'library' => ['${this.getModuleName(selectedType, selectedLibrary)}/chart-js'],
        'drupalSettings' => [
          '${this.getModuleName(selectedType, selectedLibrary)}' => [
            'chartData' => ${JSON.stringify({ labels, datasets }, null, 2)},
            'chartOptions' => ${JSON.stringify(selectedOptions, null, 2)},
            'theme' => '${selectedTheme.id}',
            'chartType' => '${chartType}',
            'themeColors' => ${JSON.stringify(themeColors)},
          ],
        ],
      ],
    ];
  }

}`;
  }

  private static generateD3DrupalBlock(config: CodeGeneratorConfig): string {
    const { selectedType, selectedLibrary, data, selectedOptions, selectedTheme } = config;
    const { labels, datasets } = this.normalizeDataFormat(data);
    const themeColors = selectedTheme?.palette || ['#0074BD', '#00C9FF', '#E5F1FF', '#1F2937', '#4A90C2', '#B3D9FF'];
    
    return `<?php

/**
 * @file
 * Generated ${selectedType} chart block using D3.js.
 * Generated on: ${new Date().toISOString()}
 */

namespace Drupal\\${this.getModuleName(selectedType, selectedLibrary)}\\Plugin\\Block;

use Drupal\\Core\\Block\\BlockBase;
use Drupal\\Core\\Form\\FormStateInterface;

/**
 * Provides a ${selectedType} chart block using D3.js.
 *
 * @Block(
 *   id = "${this.getModuleName(selectedType, selectedLibrary)}_chart",
 *   admin_label = @Translation("${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Chart (D3.js)"),
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
        'style' => 'max-width: 800px; margin: 0 auto; padding: 20px;',
      ],
      '#attached' => [
        'library' => ['${this.getModuleName(selectedType, selectedLibrary)}/d3-js'],
        'drupalSettings' => [
          '${this.getModuleName(selectedType, selectedLibrary)}' => [
            'chartData' => ${JSON.stringify({ labels, datasets }, null, 2)},
            'chartOptions' => ${JSON.stringify(selectedOptions, null, 2)},
            'theme' => '${selectedTheme.id}',
            'themeColors' => ${JSON.stringify(themeColors)},
          ],
        ],
      ],
    ];
  }

}`;
  }

  private static generateHighchartsDrupalBlock(config: CodeGeneratorConfig): string {
    const { selectedType, selectedLibrary, data, selectedOptions, selectedTheme } = config;
    const { labels, datasets } = this.normalizeDataFormat(data);
    const chartType = this.getHighchartsChartType(selectedType, config.selectedSubtype);
    const themeColors = selectedTheme?.palette || ['#0074BD', '#00C9FF', '#E5F1FF', '#1F2937', '#4A90C2', '#B3D9FF'];
    
    return `<?php

/**
 * @file
 * Generated ${selectedType} chart block using Highcharts.
 * Generated on: ${new Date().toISOString()}
 */

namespace Drupal\\${this.getModuleName(selectedType, selectedLibrary)}\\Plugin\\Block;

use Drupal\\Core\\Block\\BlockBase;
use Drupal\\Core\\Form\\FormStateInterface;

/**
 * Provides a ${selectedType} chart block using Highcharts.
 *
 * @Block(
 *   id = "${this.getModuleName(selectedType, selectedLibrary)}_chart",
 *   admin_label = @Translation("${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Chart (Highcharts)"),
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
        'style' => 'max-width: 800px; margin: 0 auto; padding: 20px;',
      ],
      '#attached' => [
        'library' => ['${this.getModuleName(selectedType, selectedLibrary)}/highcharts'],
        'drupalSettings' => [
          '${this.getModuleName(selectedType, selectedLibrary)}' => [
            'chartData' => ${JSON.stringify({ labels, datasets }, null, 2)},
            'chartOptions' => ${JSON.stringify(selectedOptions, null, 2)},
            'theme' => '${selectedTheme.id}',
            'chartType' => '${chartType}',
            'themeColors' => ${JSON.stringify(themeColors)},
          ],
        ],
      ],
    ];
  }

}`;
  }

  private static generateEChartsDrupalBlock(config: CodeGeneratorConfig): string {
    const { selectedType, selectedLibrary, data, selectedOptions, selectedTheme } = config;
    const { labels, datasets } = this.normalizeDataFormat(data);
    const chartType = this.getEChartsChartType(selectedType, config.selectedSubtype);
    const themeColors = selectedTheme?.palette || ['#0074BD', '#00C9FF', '#E5F1FF', '#1F2937', '#4A90C2', '#B3D9FF'];
    
    return `<?php

/**
 * @file
 * Generated ${selectedType} chart block using Apache ECharts.
 * Generated on: ${new Date().toISOString()}
 */

namespace Drupal\\${this.getModuleName(selectedType, selectedLibrary)}\\Plugin\\Block;

use Drupal\\Core\\Block\\BlockBase;
use Drupal\\Core\\Form\\FormStateInterface;

/**
 * Provides a ${selectedType} chart block using Apache ECharts.
 *
 * @Block(
 *   id = "${this.getModuleName(selectedType, selectedLibrary)}_chart",
 *   admin_label = @Translation("${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Chart (ECharts)"),
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
        'style' => 'width: 100%; height: 400px;',
      ],
      '#attached' => [
        'library' => ['${this.getModuleName(selectedType, selectedLibrary)}/echarts'],
        'drupalSettings' => [
          '${this.getModuleName(selectedType, selectedLibrary)}' => [
            'chartData' => ${JSON.stringify({ labels, datasets }, null, 2)},
            'chartOptions' => ${JSON.stringify(selectedOptions, null, 2)},
            'theme' => '${selectedTheme.id}',
            'chartType' => '${chartType}',
            'themeColors' => ${JSON.stringify(themeColors)},
          ],
        ],
      ],
    ];
  }

}`;
  }

  private static generateOpenLayersDrupalBlock(config: CodeGeneratorConfig): string {
    const { selectedType, selectedLibrary, data, selectedOptions, selectedTheme } = config;
    
    return `<?php

/**
 * @file
 * Generated ${selectedType} map block using OpenLayers.
 * Generated on: ${new Date().toISOString()}
 */

namespace Drupal\\${this.getModuleName(selectedType, selectedLibrary)}\\Plugin\\Block;

use Drupal\\Core\\Block\\BlockBase;
use Drupal\\Core\\Form\\FormStateInterface;

/**
 * Provides a ${selectedType} map block using OpenLayers.
 *
 * @Block(
 *   id = "${this.getModuleName(selectedType, selectedLibrary)}_map",
 *   admin_label = @Translation("${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Map (OpenLayers)"),
 *   category = @Translation("Maps")
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
        'id' => '${this.getModuleName(selectedType, selectedLibrary)}-map',
        'class' => ['map-container'],
        'style' => 'width: 100%; height: 400px;',
      ],
      '#attached' => [
        'library' => ['${this.getModuleName(selectedType, selectedLibrary)}/openlayers'],
        'drupalSettings' => [
          '${this.getModuleName(selectedType, selectedLibrary)}' => [
            'mapData' => ${JSON.stringify(data, null, 2)},
            'mapOptions' => ${JSON.stringify(selectedOptions, null, 2)},
            'theme' => '${selectedTheme.id}',
          ],
        ],
      ],
    ];
  }

}`;
  }

  private static generateLeafletDrupalBlock(config: CodeGeneratorConfig): string {
    const { selectedType, selectedLibrary, data, selectedOptions, selectedTheme } = config;
    
    return `<?php

/**
 * @file
 * Generated ${selectedType} map block using Leaflet.
 * Generated on: ${new Date().toISOString()}
 */

namespace Drupal\\${this.getModuleName(selectedType, selectedLibrary)}\\Plugin\\Block;

use Drupal\\Core\\Block\\BlockBase;
use Drupal\\Core\\Form\\FormStateInterface;

/**
 * Provides a ${selectedType} map block using Leaflet.
 *
 * @Block(
 *   id = "${this.getModuleName(selectedType, selectedLibrary)}_map",
 *   admin_label = @Translation("${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Map (Leaflet)"),
 *   category = @Translation("Maps")
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
        'id' => '${this.getModuleName(selectedType, selectedLibrary)}-map',
        'class' => ['map-container'],
        'style' => 'width: 100%; height: 400px;',
      ],
      '#attached' => [
        'library' => ['${this.getModuleName(selectedType, selectedLibrary)}/leaflet'],
        'drupalSettings' => [
          '${this.getModuleName(selectedType, selectedLibrary)}' => [
            'mapData' => ${JSON.stringify(data, null, 2)},
            'mapOptions' => ${JSON.stringify(selectedOptions, null, 2)},
            'theme' => '${selectedTheme.id}',
          ],
        ],
      ],
    ];
  }

}`;
  }

  private static generateGenericDrupalBlock(config: CodeGeneratorConfig): string {
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
 * Provides a ${selectedType} chart block using ${selectedLibrary}.
 *
 * @Block(
 *   id = "${this.getModuleName(selectedType, selectedLibrary)}_chart",
 *   admin_label = @Translation("${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Chart (${selectedLibrary})"),
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
        'style' => 'max-width: 800px; margin: 0 auto; padding: 20px;',
      ],
      '#attached' => [
        'library' => ['${this.getModuleName(selectedType, selectedLibrary)}/${selectedLibrary}'],
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
} 