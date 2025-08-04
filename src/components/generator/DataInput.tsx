import React, { useState } from 'react';
import { Database, Copy, Check, AlertCircle } from 'lucide-react';

interface DataInputProps {
  dataInputTab: string;
  jsonData: string;
  sampleData: any;
  selectedType: string;
  csvData: unknown[];
  onTabChange: (tab: string) => void;
  onJsonInput: (value: string) => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const DataInput: React.FC<DataInputProps> = ({
  jsonData,
  sampleData,
  selectedType,
  onJsonInput
}) => {
  const [jsonDataCopied, setJsonDataCopied] = useState(false);

  const copyJsonData = async () => {
    try {
      await navigator.clipboard.writeText(jsonData);
      setJsonDataCopied(true);
      setTimeout(() => setJsonDataCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy JSON data:', error);
    }
  };

  const insertSampleData = () => {
    if (sampleData && typeof sampleData === 'object' && Object.keys(sampleData).length > 0) {
      onJsonInput(JSON.stringify(sampleData, null, 2));
    }
  };

  const clearData = () => {
    onJsonInput('');
  };

  const getDataFormatHelper = () => {
    if (selectedType === 'map') {
      return {
        title: 'GeoJSON Format',
        description: 'For map visualizations, use valid GeoJSON format data. This can be a FeatureCollection or individual Feature objects.',
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
        title: 'JSON Format',
        description: 'Use Chart.js format data with labels and datasets for chart visualizations.',
        example: `{
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
}`
      };
    }
  };

  const helper = getDataFormatHelper();

  return (
    <div className="mt-4">
      {/* IDE-Style JSON Data Editor */}
      <div className="bg-[#1e1e1e] rounded-lg border border-[#3e3e3e] overflow-hidden">
        {/* Header */}
        <div className="bg-[#2d2d30] border-b border-[#3e3e3e] px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-[#cccccc] text-sm font-medium">
              Input Data
            </span>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={insertSampleData}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#4a5568] hover:bg-[#5a6578] text-white text-sm rounded transition-colors duration-200"
            >
              <Database size={14} />
              Insert Sample
            </button>
            <button
              onClick={clearData}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#e53e3e] hover:bg-[#c53030] text-white text-sm rounded transition-colors duration-200"
            >
              Clear
            </button>
            <button
              onClick={copyJsonData}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#0e639c] hover:bg-[#1177bb] text-white text-sm rounded transition-colors duration-200"
            >
              {jsonDataCopied ? <Check size={14} /> : <Copy size={14} />}
              {jsonDataCopied ? 'Copied!' : 'Copy Data'}
            </button>
          </div>
        </div>

        {/* Code Area */}
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-[#1e1e1e] border-r border-[#3e3e3e] flex flex-col text-[#858585] text-xs font-mono pt-2">
            {jsonData.split('\n').map((_, index) => (
              <div key={index} className="px-2 text-right leading-5">
                {index + 1}
              </div>
            ))}
          </div>
          <textarea
            value={jsonData}
            onChange={(e) => onJsonInput(e.target.value)}
            placeholder="Enter your JSON data here..."
            maxLength={100000}
            rows={12}
            className="w-full pl-16 pr-4 py-2 bg-[#1e1e1e] text-[#d4d4d4] font-mono text-sm leading-5 resize-y border-none outline-none"
            style={{ 
              fontFamily: "'JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', monospace",
              tabSize: 2
            }}
            spellCheck="false"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
        </div>
      </div>

      {/* JSON Format Information */}
      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
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
    </div>
  );
};

export default DataInput;