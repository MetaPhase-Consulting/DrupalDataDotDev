import React from 'react';

// Import separate preview components
import ChartJSPreview from './previews/ChartJSPreview';
import D3Preview from './previews/D3Preview';
import HighchartsPreview from './previews/HighchartsPreview';
import EChartsPreview from './previews/EChartsPreview';
import OpenLayersPreview from './previews/OpenLayersPreview';
import LeafletPreview from './previews/LeafletPreview';

// Import theme data
import chartStylesData from '../../data/chartStyles.json';

interface ChartPreviewProps {
  selectedType: string;
  selectedSubtype: string;
  selectedLibrary: string;
  selectedTheme: string;
  data: any[];
  options: Record<string, any>;
}

const ChartPreview: React.FC<ChartPreviewProps> = ({
  selectedType,
  selectedSubtype,
  selectedLibrary,
  selectedTheme,
  data,
  options
}) => {
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
        colors: fallbackTheme.palette
      };
    }
    
    return {
      primary: theme.colors.primary,
      secondary: theme.colors.secondary,
      accent: theme.colors.text,
      background: theme.colors.background,
      colors: theme.colors
    };
  };

  // Get the appropriate preview component
  const getPreviewComponent = () => {
    if (!data || data.length === 0) {
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

    // Handle map libraries
    if (selectedLibrary === 'openlayers') {
      return (
        <OpenLayersPreview
          selectedTheme={selectedTheme}
          data={data}
          options={options}
        />
      );
    }

    if (selectedLibrary === 'leaflet') {
      return (
        <LeafletPreview
          selectedTheme={selectedTheme}
          data={data}
          options={options}
        />
      );
    }

    // Handle chart libraries
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
              <div className="text-sm">
                Preview not available for {selectedLibrary}. Chart will render in final output.
              </div>
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
          color: theme.accent
        }}
      >
        <div className="h-96 w-full">
          {previewComponent}
        </div>
      </div>
    </div>
  );
};

export default ChartPreview;