import React from 'react';

interface Library {
  id: string;
  name: string;
  license: string;
  homepage: string;
  bestFor: string;
  supports: string[];
}

interface LibrarySelectorProps {
  libraries: Library[];
  selectedLibrary: string;
  selectedType: string;
  onLibrarySelect: (library: string) => void;
}

const LibrarySelector: React.FC<LibrarySelectorProps> = ({
  libraries,
  selectedLibrary,
  selectedType,
  onLibrarySelect
}) => {
  const getFilteredLibraries = () => {
    if (!selectedType) return libraries;
    return libraries.filter(lib => lib.supports.includes(selectedType));
  };

  const getLibraryLogo = (libId: string) => {
    const logos: { [key: string]: string } = {
      'chartjs': '📊', // Chart.js
      'highcharts': '📈', // Highcharts  
      'echarts': '📉', // ECharts
      'd3': '🔵', // D3.js
      'plotly': '📋', // Plotly
      'recharts': '⚡', // Recharts
      'victory': '🏆', // Victory
      'nivo': '🎯', // Nivo
    };
    return logos[libId] || '📊';
  };

  const filteredLibraries = getFilteredLibraries();

  if (!selectedType) {
    return (
      <div className="mt-4 p-6 bg-[#1F2937]/20 dark:bg-[#1F2937]/20 bg-gray-50 rounded-lg border-2 border-dashed border-[#3E4C5E] dark:border-[#3E4C5E] border-gray-300 text-center">
        <p className="text-[#E5F1FF]/60 dark:text-[#E5F1FF]/60 text-gray-500">
          Select a visualization type to show compatible libraries
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredLibraries.map((lib) => {
        const isSelected = selectedLibrary === lib.id;
        
        return (
          <div
            key={lib.id}
            onClick={() => onLibrarySelect(lib.id)}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
              isSelected
                ? 'border-[#0074BD] bg-[#0074BD]/10 dark:border-[#00C9FF] dark:bg-[#00C9FF]/10'
                : 'border-[#3E4C5E] hover:border-[#0074BD]/50 dark:border-[#3E4C5E] dark:hover:border-[#00C9FF]/50'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="text-2xl flex-shrink-0">
                {getLibraryLogo(lib.id)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-[#E5F1FF] dark:text-[#E5F1FF] text-gray-900 text-sm mb-1">
                  {lib.name}
                </h4>
                <p className="text-xs text-[#E5F1FF]/70 dark:text-[#E5F1FF]/70 text-gray-600 mb-2">
                  {lib.bestFor}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs px-2 py-1 bg-[#3E4C5E]/30 dark:bg-[#3E4C5E]/30 bg-gray-200 rounded text-[#E5F1FF]/80 dark:text-[#E5F1FF]/80 text-gray-700">
                    {lib.license}
                  </span>
                  {isSelected && (
                    <div className="w-4 h-4 bg-[#0074BD] dark:bg-[#00C9FF] rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LibrarySelector; 