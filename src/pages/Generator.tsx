import React, { useState } from 'react';
import { ChevronDown, ChevronRight, BarChart3, LineChart, PieChart, Radar, ScatterChart as Scatter, Map, Upload, FileText, Database, Copy, Download, Check } from 'lucide-react';
import Papa from 'papaparse';
import librariesData from '../data/libraries.json';

interface ChartType {
  id: string;
  name: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  description: string;
  supportedLibraries: string[];
}

interface Library {
  id: string;
  name: string;
  license: string;
  homepage: string;
  bestFor: string;
  supports: string[];
}

interface Theme {
  id: string;
  name: string;
  colors: string[];
}

interface OutputFormat {
  id: string;
  name: string;
  description: string;
}

const Generator: React.FC = () => {
  const [activeAccordion, setActiveAccordion] = useState<string>('chart-type');
  const [selectedChartType, setSelectedChartType] = useState<string>('');
  const [selectedLibrary, setSelectedLibrary] = useState<string>('');
  const [selectedTheme, setSelectedTheme] = useState<string>('drupal-night');
  const [selectedOutputFormat, setSelectedOutputFormat] = useState<string>('raw-js');
  const [dataInputTab, setDataInputTab] = useState<string>('sample');
  const [csvData, setCsvData] = useState<any[]>([]);
  const [jsonData, setJsonData] = useState<string>('');
  const [sampleData, setSampleData] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);

  const chartTypes: ChartType[] = [
    {
      id: 'bar',
      name: 'Bar',
      icon: BarChart3,
      description: 'Compare categories with vertical or horizontal bars',
      supportedLibraries: ['chartjs', 'highcharts', 'echarts', 'd3']
    },
    {
      id: 'line',
      name: 'Line',
      icon: LineChart,
      description: 'Show trends and changes over time',
      supportedLibraries: ['chartjs', 'highcharts', 'echarts', 'd3']
    },
    {
      id: 'pie',
      name: 'Pie',
      icon: PieChart,
      description: 'Display proportions and percentages',
      supportedLibraries: ['chartjs', 'highcharts', 'echarts', 'd3']
    },
    {
      id: 'radar',
      name: 'Radar',
      icon: Radar,
      description: 'Multi-dimensional data comparison',
      supportedLibraries: ['chartjs', 'echarts', 'd3']
    },
    {
      id: 'scatter',
      name: 'Scatter',
      icon: Scatter,
      description: 'Show relationships between variables',
      supportedLibraries: ['chartjs', 'highcharts', 'echarts', 'd3']
    },
    {
      id: 'map',
      name: 'Map',
      icon: Map,
      description: 'Geographic data visualization',
      supportedLibraries: ['leaflet', 'echarts', 'd3']
    }
  ];

  const libraries: Library[] = [
  const libraries: Library[] = librariesData;

  const themes: Theme[] = [
    {
      id: 'drupal-night',
      name: 'Drupal Night',
      colors: ['#0074BD', '#00C9FF', '#E5F1FF', '#1F2937']
    },
    {
      id: 'futurist-hud',
      name: 'Futurist HUD',
      colors: ['#00FF41', '#0080FF', '#FF0080', '#FFFF00']
    },
    {
      id: 'antique',
      name: 'Antique',
      colors: ['#8B4513', '#D2691E', '#F4A460', '#DEB887']
    }
  ];

  const outputFormats: OutputFormat[] = [
    { id: 'raw-js', name: 'Raw JS', description: 'Pure JavaScript code' },
    { id: 'php-block', name: 'PHP Block', description: 'Drupal block plugin' },
    { id: 'drupal-controller', name: 'Drupal Controller', description: 'Controller with route' },
    { id: 'full-module', name: 'Full Module (ZIP)', description: 'Complete Drupal module' },
    { id: 'html-snippet', name: 'HTML Snippet', description: 'Standalone HTML file' }
  ];

  const sampleDatasets = [
    {
      id: 'sales',
      name: 'Monthly Sales',
      data: [
        { month: 'Jan', sales: 1200 },
        { month: 'Feb', sales: 1900 },
        { month: 'Mar', sales: 3000 },
        { month: 'Apr', sales: 5000 },
        { month: 'May', sales: 2300 }
      ]
    },
    {
      id: 'demographics',
      name: 'Age Demographics',
      data: [
        { age_group: '18-25', count: 450 },
        { age_group: '26-35', count: 680 },
        { age_group: '36-45', count: 520 },
        { age_group: '46-55', count: 340 },
        { age_group: '55+', count: 280 }
      ]
    }
  ];

  const toggleAccordion = (section: string) => {
    setActiveAccordion(activeAccordion === section ? '' : section);
  };

  const handleChartTypeSelect = (chartType: string) => {
    setSelectedChartType(chartType);
    setSelectedLibrary(''); // Reset library when chart type changes
  };

  const handleLibrarySelect = (library: string) => {
    setSelectedLibrary(library);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      Papa.parse(file, {
        complete: (results) => {
          setCsvData(results.data);
        },
        header: true,
        skipEmptyLines: true
      });
    }
  };

  const handleJsonInput = (value: string) => {
    setJsonData(value);
    try {
      JSON.parse(value);
    } catch (error) {
      console.error('Invalid JSON');
    }
  };

  const handleSampleDataSelect = (datasetId: string) => {
    const dataset = sampleDatasets.find(d => d.id === datasetId);
    if (dataset) {
      setSampleData(dataset.data);
    }
  };

  const generateCode = () => {
    const selectedChart = chartTypes.find(c => c.id === selectedChartType);
    const selectedLib = libraries.find(l => l.id === selectedLibrary);
    const selectedThemeObj = themes.find(t => t.id === selectedTheme);
    
    return `// Generated ${selectedChart?.name} Chart using ${selectedLib?.name}
// Theme: ${selectedThemeObj?.name}
// Output Format: ${outputFormats.find(f => f.id === selectedOutputFormat)?.name}

const chartConfig = {
  type: '${selectedChartType}',
  library: '${selectedLibrary}',
  theme: '${selectedTheme}',
  data: ${JSON.stringify(getCurrentData(), null, 2)}
};

// Implementation code would be generated here based on selections
console.log('Chart configuration:', chartConfig);`;
  };

  const getCurrentData = () => {
    if (dataInputTab === 'csv' && csvData.length > 0) return csvData;
    if (dataInputTab === 'json' && jsonData) {
      try {
        return JSON.parse(jsonData);
      } catch {
        return {};
      }
    }
    if (dataInputTab === 'sample' && sampleData.length > 0) return sampleData;
    return [];
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateCode());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard');
    }
  };

  const getFilteredLibraries = () => {
    if (!selectedChartType) return libraries;
    return libraries.filter(lib => lib.supports.includes(selectedChartType));
  };

  const AccordionSection: React.FC<{
    id: string;
    title: string;
    children: React.ReactNode;
    disabled?: boolean;
  }> = ({ id, title, children, disabled = false }) => {
    const isActive = activeAccordion === id;
    
    return (
      <div className="border border-[#3E4C5E] dark:border-[#3E4C5E] border-gray-200 rounded-lg mb-4">
        <button
          onClick={() => !disabled && toggleAccordion(id)}
          disabled={disabled}
          className={`w-full px-6 py-4 text-left flex items-center justify-between ${
            disabled 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:bg-[#1F2937]/20 dark:hover:bg-[#1F2937]/20 hover:bg-gray-50'
          } transition-colors duration-200`}
        >
          <h3 className="text-xl font-semibold font-['Inter','Segoe_UI',sans-serif] text-[#E5F1FF] dark:text-[#E5F1FF] text-gray-900">
            {title}
          </h3>
          {isActive ? (
            <ChevronDown className="text-[#00C9FF] dark:text-[#00C9FF] text-blue-600" size={20} />
          ) : (
            <ChevronRight className="text-[#E5F1FF]/60 dark:text-[#E5F1FF]/60 text-gray-400" size={20} />
          )}
        </button>
        {isActive && (
          <div className="px-6 pb-6 border-t border-[#3E4C5E] dark:border-[#3E4C5E] border-gray-200">
            {children}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold font-['Inter','Segoe_UI',sans-serif] text-[#E5F1FF] dark:text-[#E5F1FF] text-gray-900 mb-4">
            Generator
          </h1>
          <p className="text-xl text-[#E5F1FF]/80 dark:text-[#E5F1FF]/80 text-gray-600 max-w-3xl mx-auto">
            Create beautiful Drupal data visualizations in minutes
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Step 1: Chart Type */}
          <AccordionSection id="chart-type" title="Step 1: Chart Type">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {chartTypes.map((chart) => {
                const IconComponent = chart.icon;
                const isSelected = selectedChartType === chart.id;
                
                return (
                  <button
                    key={chart.id}
                    onClick={() => handleChartTypeSelect(chart.id)}
                    className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                      isSelected
                        ? 'border-[#0074BD] bg-[#0074BD]/10 dark:border-[#00C9FF] dark:bg-[#00C9FF]/10'
                        : 'border-[#3E4C5E] hover:border-[#0074BD]/50 dark:border-[#3E4C5E] dark:hover:border-[#00C9FF]/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <IconComponent 
                        size={24} 
                        className={isSelected ? 'text-[#0074BD] dark:text-[#00C9FF]' : 'text-[#E5F1FF]/80 dark:text-[#E5F1FF]/80'} 
                      />
                      <h4 className="font-semibold text-[#E5F1FF] dark:text-[#E5F1FF] text-gray-900">
                        {chart.name}
                      </h4>
                    </div>
                    <p className="text-sm text-[#E5F1FF]/70 dark:text-[#E5F1FF]/70 text-gray-600">
                      {chart.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </AccordionSection>

          {/* Step 2: Library */}
          <AccordionSection id="library" title="Step 2: Charting Library" disabled={!selectedChartType}>
            <div className="mt-4">
              <select
                value={selectedLibrary}
                onChange={(e) => handleLibrarySelect(e.target.value)}
                className="w-full p-3 bg-[#0E1B2A] dark:bg-[#0E1B2A] bg-white border border-[#3E4C5E] dark:border-[#3E4C5E] border-gray-300 rounded-lg text-[#E5F1FF] dark:text-[#E5F1FF] text-gray-900 focus:border-[#0074BD] dark:focus:border-[#00C9FF] focus:outline-none"
              >
                <option value="">Select a library...</option>
                {getFilteredLibraries().map((lib) => (
                  <option key={lib.id} value={lib.id}>
                    {lib.name} - {lib.bestFor}
                  </option>
                ))}
              </select>
            </div>
          </AccordionSection>

          {/* Step 3: Data Input */}
          <AccordionSection id="data-input" title="Step 3: Input Data" disabled={!selectedLibrary}>
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
                      onClick={() => setDataInputTab(tab.id)}
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
                    onChange={handleFileUpload}
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
                    onChange={(e) => handleJsonInput(e.target.value)}
                    placeholder="Paste your JSON data here..."
                    rows={8}
                    className="w-full p-3 bg-[#0E1B2A] dark:bg-[#0E1B2A] bg-white border border-[#3E4C5E] dark:border-[#3E4C5E] border-gray-300 rounded-lg text-[#E5F1FF] dark:text-[#E5F1FF] text-gray-900 font-mono text-sm focus:border-[#0074BD] dark:focus:border-[#00C9FF] focus:outline-none"
                  />
                </div>
              )}

              {dataInputTab === 'sample' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sampleDatasets.map((dataset) => (
                    <button
                      key={dataset.id}
                      onClick={() => handleSampleDataSelect(dataset.id)}
                      className="p-4 text-left border border-[#3E4C5E] dark:border-[#3E4C5E] border-gray-200 rounded-lg hover:border-[#0074BD] dark:hover:border-[#00C9FF] transition-colors duration-200"
                    >
                      <h4 className="font-semibold text-[#E5F1FF] dark:text-[#E5F1FF] text-gray-900 mb-2">
                        {dataset.name}
                      </h4>
                      <p className="text-sm text-[#E5F1FF]/70 dark:text-[#E5F1FF]/70 text-gray-600">
                        {dataset.data.length} data points
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </AccordionSection>

          {/* Step 4: Theme */}
          <AccordionSection id="theme" title="Step 4: Chart Style" disabled={!getCurrentData().length}>
            <div className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {themes.map((theme) => {
                  const isSelected = selectedTheme === theme.id;
                  
                  return (
                    <button
                      key={theme.id}
                      onClick={() => setSelectedTheme(theme.id)}
                      className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                        isSelected
                          ? 'border-[#0074BD] bg-[#0074BD]/10 dark:border-[#00C9FF] dark:bg-[#00C9FF]/10'
                          : 'border-[#3E4C5E] hover:border-[#0074BD]/50 dark:border-[#3E4C5E] dark:hover:border-[#00C9FF]/50'
                      }`}
                    >
                      <h4 className="font-semibold text-[#E5F1FF] dark:text-[#E5F1FF] text-gray-900 mb-3">
                        {theme.name}
                      </h4>
                      <div className="flex gap-2">
                        {theme.colors.map((color, index) => (
                          <div
                            key={index}
                            className="w-6 h-6 rounded-full border border-[#3E4C5E] dark:border-[#3E4C5E] border-gray-300"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </AccordionSection>

          {/* Step 5: Output Format */}
          <AccordionSection id="output-format" title="Step 5: Code Output Format" disabled={!selectedTheme}>
            <div className="mt-4 space-y-3">
              {outputFormats.map((format) => (
                <label
                  key={format.id}
                  className="flex items-start gap-3 p-3 rounded-lg border border-[#3E4C5E] dark:border-[#3E4C5E] border-gray-200 hover:bg-[#1F2937]/10 dark:hover:bg-[#1F2937]/10 hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                >
                  <input
                    type="radio"
                    name="outputFormat"
                    value={format.id}
                    checked={selectedOutputFormat === format.id}
                    onChange={(e) => setSelectedOutputFormat(e.target.value)}
                    className="mt-1 text-[#0074BD] dark:text-[#00C9FF]"
                  />
                  <div>
                    <h4 className="font-semibold text-[#E5F1FF] dark:text-[#E5F1FF] text-gray-900">
                      {format.name}
                    </h4>
                    <p className="text-sm text-[#E5F1FF]/70 dark:text-[#E5F1FF]/70 text-gray-600">
                      {format.description}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </AccordionSection>

          {/* Step 6: Preview & Output */}
          <AccordionSection id="preview" title="Step 6: Preview & Download" disabled={!selectedOutputFormat}>
            <div className="mt-4 space-y-6">
              {/* Chart Preview Placeholder */}
              <div className="bg-[#1F2937]/20 dark:bg-[#1F2937]/20 bg-gray-50 rounded-lg p-8 text-center border-2 border-dashed border-[#3E4C5E] dark:border-[#3E4C5E] border-gray-300">
                <div className="text-[#E5F1FF]/60 dark:text-[#E5F1FF]/60 text-gray-400 mb-4">
                  {selectedChartType ? (
                    <>
                      <div className="text-lg font-semibold mb-2">Chart Preview</div>
                      <div className="text-sm">
                        {chartTypes.find(c => c.id === selectedChartType)?.name} chart using{' '}
                        {libraries.find(l => l.id === selectedLibrary)?.name} would appear here
                      </div>
                    </>
                  ) : (
                    <div>Select chart type and configure options to see preview</div>
                  )}
                </div>
              </div>

              {/* Code Output */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-[#E5F1FF] dark:text-[#E5F1FF] text-gray-900">
                    Generated Code
                  </h4>
                  <div className="flex gap-2">
                    <button
                      onClick={copyToClipboard}
                      className="flex items-center gap-2 px-4 py-2 bg-[#0074BD] dark:bg-[#00C9FF] text-white rounded-lg hover:opacity-90 transition-opacity duration-200"
                    >
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                    {selectedOutputFormat === 'full-module' && (
                      <button className="flex items-center gap-2 px-4 py-2 bg-[#1F2937] dark:bg-[#1F2937] bg-gray-600 text-white rounded-lg hover:opacity-90 transition-opacity duration-200">
                        <Download size={16} />
                        Download ZIP
                      </button>
                    )}
                  </div>
                </div>
                
                <textarea
                  value={generateCode()}
                  readOnly
                  rows={20}
                  className="w-full p-4 bg-[#0E1B2A] dark:bg-[#0E1B2A] bg-gray-900 border border-[#3E4C5E] dark:border-[#3E4C5E] border-gray-700 rounded-lg text-sm text-[#E5F1FF] dark:text-[#E5F1FF] text-green-400 font-mono resize-y focus:border-[#0074BD] dark:focus:border-[#00C9FF] focus:outline-none"
                />
              </div>
            </div>
          </AccordionSection>
        </div>
      </div>
    </div>
  );
};

export default Generator;