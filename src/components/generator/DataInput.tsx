import React, { useState } from 'react';
import { FileText, Database, Copy, Check, AlertCircle } from 'lucide-react';

interface VisualizationType {
  type: string;
  label: string;
  description: string;
  subtypes: { id: string; label: string }[];
  options: Record<string, unknown>;
}

interface DataInputProps {
  dataInputTab: string;
  jsonData: string;
  sampleData: any[];
  selectedType: string;
  onTabChange: (tab: string) => void;
  onJsonInput: (value: string) => void;
}

const DataInput: React.FC<DataInputProps> = ({
  dataInputTab,
  jsonData,
  sampleData,
  selectedType,
  onTabChange,
  onJsonInput
}) => {
  const [sampleDataCopied, setSampleDataCopied] = useState(false);
  
  const copySampleData = async () => {
    try {
      const dataString = JSON.stringify(sampleData, null, 2);
      await navigator.clipboard.writeText(dataString);
      setSampleDataCopied(true);
      setTimeout(() => setSampleDataCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy sample data:', error);
    }
  };
  
  const getIconForVisualizationType = (type: string) => {
    const iconMap: Record<string, string> = {
      bar: '📊',
      line: '📈',
      pie: '🥧',
      radar: '🕷️',
      scatter: '💫',
      map: '🗺️',
      statistical: '📊',
      mini: '📊',
      timeline: '📅',
      hierarchical: '🌳'
    };
    return iconMap[type] || '📊';
  };

  const getDataFormatHelper = () => {
    if (selectedType === 'map') {
      return {
        title: 'GeoJSON Format Required',
        description: 'For map visualizations, paste valid GeoJSON data. This can be a FeatureCollection or individual Feature objects.',
        example: `{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-122.4194, 37.7749]
      },
      "properties": {
        "name": "San Francisco",
        "population": 873965
      }
    }
  ]
}`
      };
    } else {
      return {
        title: 'Chart.js JSON Format',
        description: 'For charts, paste data in Chart.js format with labels and datasets, or use an array of objects. You can also paste Highcharts format data.',
        example: `// Chart.js Format
{
  "labels": ["Jan", "Feb", "Mar", "Apr"],
  "datasets": [
    {
      "label": "Sales",
      "data": [65, 59, 80, 81]
    },
    {
      "label": "Profit", 
      "data": [28, 48, 40, 19]
    }
  ]
}

// Highcharts Format
{
  "categories": ["Jan", "Feb", "Mar", "Apr"],
  "series": [
    {
      "name": "Sales",
      "data": [65, 59, 80, 81]
    },
    {
      "name": "Profit",
      "data": [28, 48, 40, 19]
    }
  ]
}

// Array of Objects
[
  {"month": "Jan", "sales": 65, "profit": 28},
  {"month": "Feb", "sales": 59, "profit": 48},
  {"month": "Mar", "sales": 80, "profit": 40},
  {"month": "Apr", "sales": 81, "profit": 19}
]`
      };
    }
  };

  const helper = getDataFormatHelper();

  return (
    <div className="mt-4">
      <div className="flex border-b border-[#3E4C5E] dark:border-[#3E4C5E] border-gray-200 mb-4">
        {[
          { id: 'json', label: 'Paste JSON', icon: FileText },
          { id: 'sample', label: 'Sample Data', icon: Database }
        ].map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors duration-200 ${
                dataInputTab === tab.id
                  ? 'border-[#0074BD] text-[#0074BD] dark:border-[#00C9FF] dark:text-[#00C9FF]'
                  : 'border-transparent text-[#E5F1FF]/70 hover:text-[#E5F1FF] dark:text-[#E5F1FF]/70 dark:hover:text-[#E5F1FF]'
              }`}
            >
              <IconComponent size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {dataInputTab === 'json' && (
        <div>
          <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-1">
                  {helper.title}
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                  {helper.description}
                </p>
                <details className="text-sm">
                  <summary className="cursor-pointer text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300">
                    View Example Format
                  </summary>
                  <pre className="mt-2 p-3 bg-blue-100 dark:bg-blue-900/30 rounded text-xs text-blue-800 dark:text-blue-200 overflow-x-auto">
                    {helper.example}
                  </pre>
                </details>
              </div>
            </div>
          </div>
          
          <textarea
            value={jsonData}
            onChange={(e) => onJsonInput(e.target.value)}
            placeholder={`Paste your ${selectedType === 'map' ? 'GeoJSON' : 'Chart.js JSON'} data here...`}
            maxLength={100000}
            rows={12}
            className="w-full p-3 bg-[#0E1B2A] dark:bg-[#0E1B2A] bg-white border border-[#3E4C5E] dark:border-[#3E4C5E] border-gray-300 rounded-lg text-[#E5F1FF] dark:text-[#E5F1FF] text-gray-900 font-mono text-sm focus:border-[#0074BD] dark:focus:border-[#00C9FF] focus:outline-none resize-y"
            spellCheck="false"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
        </div>
      )}

      {dataInputTab === 'sample' && (
        <div className="p-4 bg-[#1F2937]/20 dark:bg-[#1F2937]/20 bg-gray-50 rounded-lg border border-[#3E4C5E] dark:border-[#3E4C5E] border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">{getIconForVisualizationType(selectedType)}</span>
            <div>
              <h4 className="font-semibold text-[#E5F1FF] dark:text-[#E5F1FF] text-gray-900">
                Sample Data for {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Charts
              </h4>
              <p className="text-sm text-[#E5F1FF]/70 dark:text-[#E5F1FF]/70 text-gray-600">
                Using pre-loaded sample dataset for {selectedType} visualization
              </p>
            </div>
          </div>
        </div>
      )}

      {dataInputTab === 'sample' && sampleData.length > 0 && (
        <div className="mt-4">
          {/* IDE-Style Sample Data Preview */}
          <div className="bg-[#1e1e1e] rounded-lg border border-[#3e3e3e] overflow-hidden">
            {/* Header */}
            <div className="bg-[#2d2d30] border-b border-[#3e3e3e] px-4 py-2 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-3 h-3 bg-[#ff5f57] rounded-full"></div>
                  <div className="w-3 h-3 bg-[#ffbd2e] rounded-full"></div>
                  <div className="w-3 h-3 bg-[#28ca42] rounded-full"></div>
                </div>
                <span className="text-[#cccccc] text-sm font-mono ml-4">
                  sample-data-{selectedType}.json
                </span>
              </div>
              
              {/* Copy Button */}
              <button
                onClick={copySampleData}
                className="flex items-center gap-2 px-3 py-1.5 bg-[#0e639c] hover:bg-[#1177bb] text-white text-sm rounded transition-colors duration-200"
              >
                {sampleDataCopied ? <Check size={14} /> : <Copy size={14} />}
                {sampleDataCopied ? 'Copied!' : 'Copy Data'}
              </button>
            </div>

            {/* Code Area */}
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-12 bg-[#1e1e1e] border-r border-[#3e3e3e] flex flex-col text-[#858585] text-xs font-mono pt-2">
                {JSON.stringify(sampleData, null, 2).split('\n').map((_, index) => (
                  <div key={index} className="px-2 text-right leading-5">
                    {index + 1}
                  </div>
                ))}
              </div>
              <pre className="pl-16 pr-4 py-2 bg-[#1e1e1e] text-[#d4d4d4] font-mono text-sm leading-5 overflow-x-auto max-h-60 overflow-y-auto">
                {JSON.stringify(sampleData, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataInput; 