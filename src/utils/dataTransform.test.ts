import { describe, expect, it } from 'vitest';
import {
  convertDataForLibrary,
  convertRawDataToChartJs,
  isValidChartJsData,
  isValidGeoJSON,
  toD3,
  toECharts,
  toHighcharts,
} from './dataTransform';

describe('dataTransform validation helpers', () => {
  it('validates GeoJSON feature collections', () => {
    const geo = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [-74.006, 40.7128] },
          properties: { name: 'NYC' },
        },
      ],
    };

    expect(isValidGeoJSON(geo)).toBe(true);
  });

  it('rejects malformed GeoJSON', () => {
    expect(isValidGeoJSON({ type: 'FeatureCollection', features: [] })).toBe(false);
    expect(isValidGeoJSON({ type: 'Point' })).toBe(false);
    expect(isValidGeoJSON(null)).toBe(false);
  });

  it('validates Chart.js format', () => {
    const chart = {
      labels: ['Jan', 'Feb'],
      datasets: [{ label: 'Sales', data: [10, 20] }],
    };

    expect(isValidChartJsData(chart)).toBe(true);
  });

  it('rejects invalid Chart.js format', () => {
    expect(isValidChartJsData({ labels: ['Jan'], datasets: [] })).toBe(false);
    expect(isValidChartJsData({ labels: ['Jan'], datasets: [{ label: 'A', data: [1, 2] }] })).toBe(false);
    expect(isValidChartJsData({ datasets: [{ label: 'A', data: [1] }] })).toBe(false);
  });
});

describe('dataTransform conversion helpers', () => {
  const chartJsData = {
    labels: ['Jan', 'Feb'],
    datasets: [
      { label: 'Sales', data: [10, 20] },
      { label: 'Profit', data: [4, 9] },
    ],
  };

  it('converts chart data to Highcharts format', () => {
    const out = toHighcharts(chartJsData);
    expect(out.categories).toEqual(['Jan', 'Feb']);
    expect(out.series).toHaveLength(2);
    expect(out.series[0]).toEqual({ name: 'Sales', data: [10, 20] });
  });

  it('converts chart data to ECharts format', () => {
    const out = toECharts(chartJsData);
    expect(out.xAxis).toEqual(['Jan', 'Feb']);
    expect(out.series[1]).toEqual({ name: 'Profit', type: 'bar', data: [4, 9] });
  });

  it('converts chart data to D3 format', () => {
    const out = toD3(chartJsData);
    expect(out.labels).toEqual(['Jan', 'Feb']);
    expect(out.values).toEqual([
      [10, 20],
      [4, 9],
    ]);
    expect(out.series).toEqual(['Sales', 'Profit']);
  });

  it('converts tabular rows to Chart.js', () => {
    const out = convertRawDataToChartJs([
      { category: 'Q1', revenue: 100, cost: 75 },
      { category: 'Q2', revenue: 120, cost: 90 },
    ]);

    expect(out.labels).toEqual(['Q1', 'Q2']);
    expect(out.datasets).toHaveLength(2);
    expect(out.datasets[0].label).toBe('Revenue');
    expect(out.datasets[0].data).toEqual([100, 120]);
  });

  it('throws for empty raw data arrays', () => {
    expect(() => convertRawDataToChartJs([])).toThrow('Raw data must be a non-empty array');
  });
});

describe('convertDataForLibrary', () => {
  it('returns chartjs data unchanged when valid', () => {
    const input = {
      labels: ['A', 'B'],
      datasets: [{ label: 'One', data: [1, 2] }],
    };

    expect(convertDataForLibrary(input, 'chartjs', 'bar')).toEqual(input);
  });

  it('converts array input to target chart library', () => {
    const out = convertDataForLibrary(
      [
        { category: 'A', value: 5 },
        { category: 'B', value: 6 },
      ],
      'highcharts',
      'bar',
    );

    expect(out).toEqual({
      categories: ['A', 'B'],
      series: [{ name: 'Value', data: [5, 6] }],
    });
  });

  it('converts chart series type for ECharts', () => {
    const out = convertDataForLibrary(
      {
        labels: ['A', 'B'],
        datasets: [{ label: 'One', data: [1, 2] }],
      },
      'echarts',
      'line',
    );

    expect(out.series[0].type).toBe('line');
  });

  it('requires GeoJSON for map chart type', () => {
    expect(() => convertDataForLibrary({ bad: true }, 'chartjs', 'map')).toThrow(
      'Map visualizations require valid GeoJSON data',
    );
  });

  it('returns valid GeoJSON as-is for maps', () => {
    const geo = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [-74.006, 40.7128] },
          properties: {},
        },
      ],
    };

    expect(convertDataForLibrary(geo, 'leaflet', 'map')).toEqual(geo);
  });

  it('throws on non-map invalid object input', () => {
    expect(() => convertDataForLibrary({ foo: 'bar' }, 'chartjs', 'bar')).toThrow(
      'Invalid data format. Expected Chart.js JSON or array of objects.',
    );
  });
});
