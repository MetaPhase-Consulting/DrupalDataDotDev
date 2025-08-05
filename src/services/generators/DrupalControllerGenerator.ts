import { CodeGeneratorConfig } from './types';
import { BaseGenerator } from './BaseGenerator';

export class DrupalControllerGenerator extends BaseGenerator {
  static generateCode(config: CodeGeneratorConfig): string {
    const { selectedLibrary } = config;
    
    switch (selectedLibrary) {
      case 'chartjs':
        return this.generateChartJSDrupalController(config);
      case 'd3':
        return this.generateD3DrupalController(config);
      case 'highcharts':
        return this.generateHighchartsDrupalController(config);
      case 'echarts':
        return this.generateEChartsDrupalController(config);
      case 'openlayers':
        return this.generateOpenLayersDrupalController(config);
      case 'leaflet':
        return this.generateLeafletDrupalController(config);
      default:
        return this.generateGenericDrupalController(config);
    }
  }

  private static generateChartJSDrupalController(config: CodeGeneratorConfig): string {
    const { selectedType, selectedLibrary, data, selectedOptions, selectedTheme } = config;
    const { labels, datasets } = this.normalizeDataFormat(data);
    const chartType = this.getChartType(selectedType, config.selectedSubtype);
    const themeColors = selectedTheme?.palette || ['#0074BD', '#00C9FF', '#E5F1FF', '#1F2937', '#4A90C2', '#B3D9FF'];
    
    return `<?php

/**
 * @file
 * Generated ${selectedType} chart controller using Chart.js.
 * Generated on: ${new Date().toISOString()}
 */

namespace Drupal\\${this.getModuleName(selectedType, selectedLibrary)}\\Controller;

use Drupal\\Core\\Controller\\ControllerBase;
use Symfony\\Component\\HttpFoundation\\JsonResponse;

/**
 * Controller for ${selectedType} chart using Chart.js.
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

  /**
   * Returns chart data as JSON.
   */
  public function chartData() {
    return new JsonResponse([
      'data' => ${JSON.stringify({ labels, datasets }, null, 2)},
      'options' => ${JSON.stringify(selectedOptions, null, 2)},
      'theme' => '${selectedTheme.id}',
      'chartType' => '${chartType}',
      'themeColors' => ${JSON.stringify(themeColors)},
    ]);
  }

}`;
  }

  private static generateD3DrupalController(config: CodeGeneratorConfig): string {
    const { selectedType, selectedLibrary, data, selectedOptions, selectedTheme } = config;
    const { labels, datasets } = this.normalizeDataFormat(data);
    const themeColors = selectedTheme?.palette || ['#0074BD', '#00C9FF', '#E5F1FF', '#1F2937', '#4A90C2', '#B3D9FF'];
    
    return `<?php

/**
 * @file
 * Generated ${selectedType} chart controller using D3.js.
 * Generated on: ${new Date().toISOString()}
 */

namespace Drupal\\${this.getModuleName(selectedType, selectedLibrary)}\\Controller;

use Drupal\\Core\\Controller\\ControllerBase;
use Symfony\\Component\\HttpFoundation\\JsonResponse;

/**
 * Controller for ${selectedType} chart using D3.js.
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

  /**
   * Returns chart data as JSON.
   */
  public function chartData() {
    return new JsonResponse([
      'data' => ${JSON.stringify({ labels, datasets }, null, 2)},
      'options' => ${JSON.stringify(selectedOptions, null, 2)},
      'theme' => '${selectedTheme.id}',
      'themeColors' => ${JSON.stringify(themeColors)},
    ]);
  }

}`;
  }

  private static generateHighchartsDrupalController(config: CodeGeneratorConfig): string {
    const { selectedType, selectedLibrary, data, selectedOptions, selectedTheme } = config;
    const { labels, datasets } = this.normalizeDataFormat(data);
    const chartType = this.getHighchartsChartType(selectedType, config.selectedSubtype);
    const themeColors = selectedTheme?.palette || ['#0074BD', '#00C9FF', '#E5F1FF', '#1F2937', '#4A90C2', '#B3D9FF'];
    
    return `<?php

/**
 * @file
 * Generated ${selectedType} chart controller using Highcharts.
 * Generated on: ${new Date().toISOString()}
 */

namespace Drupal\\${this.getModuleName(selectedType, selectedLibrary)}\\Controller;

use Drupal\\Core\\Controller\\ControllerBase;
use Symfony\\Component\\HttpFoundation\\JsonResponse;

/**
 * Controller for ${selectedType} chart using Highcharts.
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

  /**
   * Returns chart data as JSON.
   */
  public function chartData() {
    return new JsonResponse([
      'data' => ${JSON.stringify({ labels, datasets }, null, 2)},
      'options' => ${JSON.stringify(selectedOptions, null, 2)},
      'theme' => '${selectedTheme.id}',
      'chartType' => '${chartType}',
      'themeColors' => ${JSON.stringify(themeColors)},
    ]);
  }

}`;
  }

  private static generateEChartsDrupalController(config: CodeGeneratorConfig): string {
    const { selectedType, selectedLibrary, data, selectedOptions, selectedTheme } = config;
    const { labels, datasets } = this.normalizeDataFormat(data);
    const chartType = this.getEChartsChartType(selectedType, config.selectedSubtype);
    const themeColors = selectedTheme?.palette || ['#0074BD', '#00C9FF', '#E5F1FF', '#1F2937', '#4A90C2', '#B3D9FF'];
    
    return `<?php

/**
 * @file
 * Generated ${selectedType} chart controller using Apache ECharts.
 * Generated on: ${new Date().toISOString()}
 */

namespace Drupal\\${this.getModuleName(selectedType, selectedLibrary)}\\Controller;

use Drupal\\Core\\Controller\\ControllerBase;
use Symfony\\Component\\HttpFoundation\\JsonResponse;

/**
 * Controller for ${selectedType} chart using Apache ECharts.
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

  /**
   * Returns chart data as JSON.
   */
  public function chartData() {
    return new JsonResponse([
      'data' => ${JSON.stringify({ labels, datasets }, null, 2)},
      'options' => ${JSON.stringify(selectedOptions, null, 2)},
      'theme' => '${selectedTheme.id}',
      'chartType' => '${chartType}',
      'themeColors' => ${JSON.stringify(themeColors)},
    ]);
  }

}`;
  }

  private static generateOpenLayersDrupalController(config: CodeGeneratorConfig): string {
    const { selectedType, selectedLibrary, data, selectedOptions, selectedTheme } = config;
    
    return `<?php

/**
 * @file
 * Generated ${selectedType} map controller using OpenLayers.
 * Generated on: ${new Date().toISOString()}
 */

namespace Drupal\\${this.getModuleName(selectedType, selectedLibrary)}\\Controller;

use Drupal\\Core\\Controller\\ControllerBase;
use Symfony\\Component\\HttpFoundation\\JsonResponse;

/**
 * Controller for ${selectedType} map using OpenLayers.
 */
class ${this.getClassName(selectedType, selectedLibrary)}Controller extends ControllerBase {

  /**
   * Returns the map page.
   */
  public function mapPage() {
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

  /**
   * Returns map data as JSON.
   */
  public function mapData() {
    return new JsonResponse([
      'data' => ${JSON.stringify(data, null, 2)},
      'options' => ${JSON.stringify(selectedOptions, null, 2)},
      'theme' => '${selectedTheme.id}',
    ]);
  }

}`;
  }

  private static generateLeafletDrupalController(config: CodeGeneratorConfig): string {
    const { selectedType, selectedLibrary, data, selectedOptions, selectedTheme } = config;
    
    return `<?php

/**
 * @file
 * Generated ${selectedType} map controller using Leaflet.
 * Generated on: ${new Date().toISOString()}
 */

namespace Drupal\\${this.getModuleName(selectedType, selectedLibrary)}\\Controller;

use Drupal\\Core\\Controller\\ControllerBase;
use Symfony\\Component\\HttpFoundation\\JsonResponse;

/**
 * Controller for ${selectedType} map using Leaflet.
 */
class ${this.getClassName(selectedType, selectedLibrary)}Controller extends ControllerBase {

  /**
   * Returns the map page.
   */
  public function mapPage() {
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

  /**
   * Returns map data as JSON.
   */
  public function mapData() {
    return new JsonResponse([
      'data' => ${JSON.stringify(data, null, 2)},
      'options' => ${JSON.stringify(selectedOptions, null, 2)},
      'theme' => '${selectedTheme.id}',
    ]);
  }

}`;
  }

  private static generateGenericDrupalController(config: CodeGeneratorConfig): string {
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
 * Controller for ${selectedType} chart using ${selectedLibrary}.
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
} 