import React, { Suspense, lazy } from 'react';

import chartStylesData from '../../data/chartStyles.json';
import type { VisualizationData } from '../../types/data';

const ChartJSPreview = lazy(() => import('./previews/ChartJSPreview'));
const D3Preview = lazy(() => import('./previews/D3Preview'));
const HighchartsPreview = lazy(() => import('./previews/HighchartsPreview'));
const EChartsPreview = lazy(() => import('./previews/EChartsPreview'));
const OpenLayersPreview = lazy(() => import('./previews/OpenLayersPreview'));
const LeafletPreview = lazy(() => import('./previews/LeafletPreview'));

interface ChartPreviewProps {
  selectedType: string;
  selectedSubtype: string;
  selectedLibrary: string;
  selectedTheme: string;
  data: VisualizationData;
  options: Record<string, unknown>;
}

const ChartPreview: React.FC<ChartPreviewProps> = ({
  selectedType,
  selectedSubtype,
  selectedLibrary,
  selectedTheme,
  data,
  options,
}) => {
  const getThemeColors = () => {
    const theme = chartStylesData.find((item) => item.id === selectedTheme);
    const fallbackTheme = theme ?? chartStylesData[0];

    return {
      primary: fallbackTheme.colors.primary,
      secondary: fallbackTheme.colors.secondary,
      accent: fallbackTheme.colors.text,
      background: fallbackTheme.colors.background,
      colors: fallbackTheme.palette,
    };
  };

  const hasData = (() => {
    if (!data) {
      return false;
    }

    if (Array.isArray(data)) {
      return data.length > 0;
    }

    if (typeof data === 'object') {
      const candidate = data as Record<string, unknown>;
      const labels = candidate.labels;
      const datasets = candidate.datasets;
      const nestedData = candidate.data as Record<string, unknown> | undefined;

      if (Array.isArray(labels) && labels.length > 0) {
        return true;
      }

      if (Array.isArray(datasets) && datasets.length > 0) {
        return true;
      }

      if (
        nestedData &&
        typeof nestedData === 'object' &&
        Array.isArray(nestedData.datasets) &&
        nestedData.datasets.length > 0
      ) {
        return true;
      }
    }

    return false;
  })();

  const getPreviewComponent = () => {
    if (!hasData) {
      return (
        <div className="bg-[#1F2937]/20 dark:bg-[#1F2937]/20 bg-gray-50 rounded-lg p-8 text-center border-2 border-dashed border-[#3E4C5E] dark:border-[#3E4C5E] border-gray-300">
          <div className="text-[#E5F1FF]/60 dark:text-[#E5F1FF]/60 text-gray-400 mb-4">
            <div className="text-lg font-semibold mb-2">No Data Available</div>
            <div className="text-sm">Add data in Step 5 to see your chart preview.</div>
          </div>
        </div>
      );
    }

    if (selectedLibrary === 'openlayers') {
      return (
        <OpenLayersPreview
          selectedType={selectedType}
          selectedSubtype={selectedSubtype}
          selectedTheme={selectedTheme}
          data={data}
          options={options}
        />
      );
    }

    if (selectedLibrary === 'leaflet') {
      return (
        <LeafletPreview
          selectedType={selectedType}
          selectedSubtype={selectedSubtype}
          selectedTheme={selectedTheme}
          data={data}
          options={options}
        />
      );
    }

    switch (selectedLibrary) {
      case 'chartjs':
        return (
          <ChartJSPreview
            selectedType={selectedType}
            selectedSubtype={selectedSubtype}
            selectedTheme={selectedTheme}
            data={data}
            options={options}
          />
        );
      case 'd3':
        return (
          <D3Preview
            selectedType={selectedType}
            selectedSubtype={selectedSubtype}
            selectedTheme={selectedTheme}
            data={data}
            options={options}
          />
        );
      case 'highcharts':
        return (
          <HighchartsPreview
            selectedType={selectedType}
            selectedSubtype={selectedSubtype}
            selectedTheme={selectedTheme}
            data={data}
            options={options}
          />
        );
      case 'echarts':
        return (
          <EChartsPreview
            selectedType={selectedType}
            selectedSubtype={selectedSubtype}
            selectedTheme={selectedTheme}
            data={data}
            options={options}
          />
        );
      default:
        return (
          <div className="bg-[#1F2937]/20 dark:bg-[#1F2937]/20 bg-gray-50 rounded-lg p-8 text-center border-2 border-dashed border-[#3E4C5E] dark:border-[#3E4C5E] border-gray-300">
            <div className="text-[#E5F1FF]/60 dark:text-[#E5F1FF]/60 text-gray-400 mb-4">
              <div className="text-lg font-semibold mb-2">Library Not Supported</div>
              <div className="text-sm">Preview not available for {selectedLibrary}.</div>
            </div>
          </div>
        );
    }
  };

  const previewComponent = getPreviewComponent();
  const theme = getThemeColors();

  return (
    <div className="mt-4">
      <div
        className="rounded-lg border p-6 transition-colors duration-300"
        style={{
          backgroundColor: theme.background,
          borderColor: theme.colors[1] + '40',
          color: theme.accent,
        }}
      >
        <div className="h-96 w-full">
          <Suspense
            fallback={
              <div className="h-full flex items-center justify-center text-sm text-[#E5F1FF]/70 dark:text-[#E5F1FF]/70">
                Loading preview…
              </div>
            }
          >
            {previewComponent}
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default ChartPreview;
