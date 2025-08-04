export interface DefaultConfig {
  subtype: string;
  library: string;
  options: Record<string, any>;
}

export class DefaultConfigService {
  private static defaults: Record<string, DefaultConfig> = {
    bar: {
      subtype: 'vertical',
      library: 'chartjs',
      options: {
        orientation: 'vertical',
        stacking: 'none',
        roundedCorners: false,
        threeD: false,
        axisLabelRotation: 'auto'
      }
    },
    line: {
      subtype: 'basic',
      library: 'chartjs',
      options: {
        showPoints: true,
        areaFill: 'none',
        lineStyle: 'solid',
        smooth: false
      }
    },
    pie: {
      subtype: 'pie',
      library: 'chartjs',
      options: {
        innerRadiusPercent: 0,
        sortSlices: false,
        startAngle: 0,
        explodeIndex: 'none'
      }
    },
    radar: {
      subtype: 'standard',
      library: 'chartjs',
      options: {
        axisShape: 'polygon',
        fillOpacity: 0.3,
        strokeWidth: 2
      }
    },
    scatter: {
      subtype: 'scatter',
      library: 'chartjs',
      options: {
        markerShape: 'circle',
        sizeByValue: false,
        axisScale: 'linear',
        regressionLine: false
      }
    },
    map: {
      subtype: 'choropleth',
      library: 'leaflet',
      options: {
        projection: 'mercator',
        tileSource: 'osm',
        zoomEnabled: true,
        colorScale: 'sequential'
      }
    },
    statistical: {
      subtype: 'boxplot',
      library: 'd3',
      options: {
        showOutliers: true,
        binSize: 10,
        quartileMethod: 'inclusive',
        confidenceInterval: 0.95
      }
    }
  };

  static getDefaultConfig(visualizationType: string): DefaultConfig {
    return this.defaults[visualizationType] || {
      subtype: '',
      library: '',
      options: {}
    };
  }
} 