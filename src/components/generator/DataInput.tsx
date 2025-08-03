import React from 'react';
import { Upload, FileText, Database } from 'lucide-react';
import Papa from 'papaparse';

interface VisualizationType {
  type: string;
  label: string;
  description: string;
  subtypes: { id: string; label: string }[];
  options: Record<string, any>;
}

interface DataInputProps {
  dataInputTab: string;
  csvData: any[];
  jsonData: string;
  sampleData: any[];
  visualizationTypes: VisualizationType[];
  selectedType: string;
  onTabChange: (tab: string) => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onJsonInput: (value: string) => void;
  onSampleDataSelect: (type: string) => void;
}

const DataInput: React.FC<DataInputProps> = ({
  dataInputTab,
  csvData,
  jsonData,
  sampleData,
  visualizationTypes,
  selectedType,
  onTabChange,
  onFileUpload,
  onJsonInput,
  onSampleDataSelect
}) => {
  const getIconForVisualizationType = (type: string) => {
    const iconMap: Record<string, any> = {
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

  return (
    <div className="mt-4">
      <div className="flex border-b border-[#3E4C5E] dark:border-[#3E4C5E] border-gray-200 mb-4">
        {[
          { id: 'csv', label: 'Upload CSV', icon: Upload },
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

      {dataInputTab === 'csv' && (
        <div>
          <input
            type="file"
            accept=".csv"
            onChange={onFileUpload}
            className="w-full p-3 bg-[#0E1B2A] dark:bg-[#0E1B2A] bg-white border border-[#3E4C5E] dark:border-[#3E4C5E] border-gray-300 rounded-lg text-[#E5F1FF] dark:text-[#E5F1FF] text-gray-900"
          />
          {csvData.length > 0 && (
            <div className="mt-4 p-3 bg-[#1F2937]/20 dark:bg-[#1F2937]/20 bg-gray-50 rounded-lg">
              <p className="text-sm text-[#E5F1FF]/80 dark:text-[#E5F1FF]/80 text-gray-600 mb-2">
                Preview ({csvData.length} rows):
              </p>
              <pre className="text-xs text-[#E5F1FF] dark:text-[#E5F1FF] text-gray-800 overflow-x-auto">
                {JSON.stringify(csvData.slice(0, 3), null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      {dataInputTab === 'json' && (
        <div>
          <textarea
            value={jsonData}
            onChange={(e) => onJsonInput(e.target.value)}
            placeholder="Paste your JSON data here..."
            maxLength={100000}
            rows={8}
            className="w-full p-3 bg-[#0E1B2A] dark:bg-[#0E1B2A] bg-white border border-[#3E4C5E] dark:border-[#3E4C5E] border-gray-300 rounded-lg text-[#E5F1FF] dark:text-[#E5F1FF] text-gray-900 font-mono text-sm focus:border-[#0074BD] dark:focus:border-[#00C9FF] focus:outline-none"
          />
        </div>
      )}

      {dataInputTab === 'sample' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {visualizationTypes.map((visualizationType) => (
            <button
              key={visualizationType.type}
              onClick={() => onSampleDataSelect(visualizationType.type)}
              className={`p-4 text-left border border-[#3E4C5E] dark:border-[#3E4C5E] border-gray-200 rounded-lg hover:border-[#0074BD] dark:hover:border-[#00C9FF] transition-colors duration-200 ${
                selectedType === visualizationType.type ? 'border-[#0074BD] bg-[#0074BD]/10 dark:border-[#00C9FF] dark:bg-[#00C9FF]/10' : ''
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{getIconForVisualizationType(visualizationType.type)}</span>
                <h4 className="font-semibold text-[#E5F1FF] dark:text-[#E5F1FF] text-gray-900">
                  {visualizationType.label} Sample
                </h4>
              </div>
              <p className="text-sm text-[#E5F1FF]/70 dark:text-[#E5F1FF]/70 text-gray-600">
                Generic {visualizationType.label.toLowerCase()} data structure
              </p>
            </button>
          ))}
        </div>
      )}

      {sampleData.length > 0 && (
        <div className="mt-4 p-3 bg-[#1F2937]/20 dark:bg-[#1F2937]/20 bg-gray-50 rounded-lg">
          <p className="text-sm text-[#E5F1FF]/80 dark:text-[#E5F1FF]/80 text-gray-600 mb-2">
            Sample Data Preview:
          </p>
          <pre className="text-xs text-[#E5F1FF] dark:text-[#E5F1FF] text-gray-800 overflow-x-auto max-h-40 overflow-y-auto">
            {JSON.stringify(sampleData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default DataInput; 