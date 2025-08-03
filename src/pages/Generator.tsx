import React, { useState } from 'react';
import { ChevronDown, ChevronRight, BarChart3, LineChart, PieChart, Radar, ScatterChart as Scatter, Map, Upload, FileText, Database, Copy, Download, Check } from 'lucide-react';
import Papa from 'papaparse';
import librariesData from '../data/libraries.json';
import chartTypesData from '../data/chartTypes.json';
import chartStylesData from '../data/chartStyles.json';

interface ChartType {
  type: string;
  label: string;
  description: string;
  subtypes: { id: string; label: string }[];
  options: Record<string, any>;
}

interface ChartSubtype {
  id: string;
  label: string;
}

interface OldChartType {
  id: string;
  label: string;
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
  description: string;
  mood: string;
  fonts: string[];
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
  };
  palette: string[];
}

interface OutputFormat {
  id: string;
  name: string;
  description: string;
}

const Generator: React.FC = () => {
  const [activeAccordion, setActiveAccordion] = useState<string>('chart-type');
  const [selectedChartType, setSelectedChartType] = useState<string>('');
  const [selectedSubtype, setSelectedSubtype] = useState<string>('');
  const [selectedOptions, setSelectedOptions] = useState<Record<string, any>>({});
  const [selectedLibrary, setSelectedLibrary] = useState<string>('');
  const [selectedTheme, setSelectedTheme] = useState<string>('drupal-night');
  const [selectedOutputFormat, setSelectedOutputFormat] = useState<string>('raw-js');
  const [dataInputTab, setDataInputTab] = useState<string>('sample');
  const [csvData, setCsvData] = useState<any[]>([]);
  const [jsonData, setJsonData] = useState<string>('');
  const [sampleData, setSampleData] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);

  const chartTypes: ChartType[] = chartTypesData;

  const oldChartTypes: OldChartType[] = [
    {
      id: 'bar',
      label: 'Bar',
      icon: BarChart3,
      description: 'Compare categories with vertical or horizontal bars',
      supportedLibraries: ['chartjs', 'highcharts', 'echarts', 'd3']
    },
    {
      id: 'line',
      label: 'Line',
      icon: LineChart,
      description: 'Show trends and changes over time',
      supportedLibraries: ['chartjs', 'highcharts', 'echarts', 'd3']
    },
    {
      id: 'pie',
      label: 'Pie',
      icon: PieChart,
      description: 'Display proportions and percentages',
      supportedLibraries: ['chartjs', 'highcharts', 'echarts', 'd3']
    },
    {
      id: 'radar',
      label: 'Radar',
      icon: Radar,
      description: 'Multi-dimensional data comparison',
      supportedLibraries: ['chartjs', 'echarts', 'd3']
    },
    {
      id: 'scatter',
      label: 'Scatter',
      icon: Scatter,
      description: 'Show relationships between variables',
      supportedLibraries: ['chartjs', 'highcharts', 'echarts', 'd3']
    },
    {
      id: 'map',
      label: 'Map',
      icon: Map,
      description: 'Geographic data visualization',
      supportedLibraries: ['leaflet', 'echarts', 'd3']
    }
  ];

  const libraries: Library[] = librariesData;

  const themes: Theme[] = chartStylesData;

  const outputFormats: OutputFormat[] = [
    { id: 'raw-js', name: 'Raw JS', description: 'Pure JavaScript code' },
    { id: 'php-block', name: 'PHP Block', description: 'Drupal block plugin' },
    { id: 'drupal-controller', name: 'Drupal Controller', description: 'Controller with route' },
    { id: 'full-module', name: 'Full Module (ZIP)', description: 'Complete Drupal module' },
    { id: 'html-snippet', name: 'HTML Snippet', description: 'Standalone HTML file' }
  ];

  // Sample data will be loaded dynamically based on selected chart type
  const getSampleDataForChartType = async (chartType: string) => {
    try {
      const response = await import(`../data/sampleData/${chartType}.json`);
      return response.default;
    } catch (error) {
      console.error(`No sample data found for chart type: ${chartType}`);
      return null;
    }
  };

  const toggleAccordion = (section: string) => {
    setActiveAccordion(activeAccordion === section ? '' : section);
  };

  const handleChartTypeSelect = (chartType: string) => {
    setSelectedChartType(chartType);
    setSelectedSubtype(''); // Reset subtype when chart type changes
    setSelectedOptions({}); // Reset options when chart type changes
    setSelectedLibrary(''); // Reset library when chart type changes
  };

  const handleSubtypeSelect = (subtype: string) => {
    setSelectedSubtype(subtype);
  };

  const handleOptionChange = (optionKey: string, value: any) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionKey]: value
    }));
  };

  const handleLibrarySelect = (library: string) => {
    setSelectedLibrary(library);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // File size validation (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      console.error('File too large. Maximum size is 10MB.');
      return;
    }
    
    // File type validation
    const allowedTypes = ['text/csv', 'application/csv', 'text/plain'];
    const fileExtension = file.name.toLowerCase().split('.').pop();
    
    if (!allowedTypes.includes(file.type) && fileExtension !== 'csv') {
      console.error('Invalid file type. Please upload a CSV file.');
      return;
    }
    
    Papa.parse(file, {
      complete: (results) => {
        if (results.errors && results.errors.length > 0) {
          console.error('CSV parsing errors:', results.errors);
        }
        if (results.data && Array.isArray(results.data)) {
          setCsvData(results.data);
        } else {
          console.error('Invalid CSV data format');
          setCsvData([]);
        }
      },
      error: (error) => {
        console.error('Failed to parse CSV:', error);
        setCsvData([]);
      },
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => {
        // Sanitize header names to prevent potential issues
        return header.trim().replace(/[<>]/g, '');
      }
    });
  };

  const sanitizeForCodeGeneration = (obj: any): any => {
    if (typeof obj === 'string') {
      // Basic XSS prevention - remove script tags and javascript: protocols
      return obj.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                .replace(/javascript:/gi, '');
    }
    if (Array.isArray(obj)) {
      return obj.map(sanitizeForCodeGeneration);
    }
    if (obj && typeof obj === 'object') {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(obj)) {
        // Sanitize object keys
        const cleanKey = key.replace(/[<>]/g, '');
        sanitized[cleanKey] = sanitizeForCodeGeneration(value);
      }
      return sanitized;
    }
    return obj;
  };

  const handleJsonInput = (value: string) => {
    setJsonData(value);
    if (value.trim()) {
      try {
        const parsed = JSON.parse(value);
        // Basic validation - ensure it's an object or array
        if (typeof parsed !== 'object' || parsed === null) {
          console.warn('JSON should be an object or array');
        }
      } catch (error) {
        console.error('Invalid JSON format:', error);
      }
    }
  };

  const handleSampleDataSelect = async (chartType: string) => {
    try {
      const dataset = await getSampleDataForChartType(chartType);
      if (dataset && dataset.data) {
        setSampleData(dataset.data);
      } else {
        console.warn(`No valid data found for chart type: ${chartType}`);
        setSampleData([]);
      }
    } catch (error) {
      console.error(`Failed to load sample data for ${chartType}:`, error);
      setSampleData([]);
    }
  };

  const generateCode = () => {
    // Input validation
    if (!selectedChartType) {
      return '// Please select a chart type first';
    }
    
    const selectedChart = chartTypes.find(c => c.type === selectedChartType);
    const selectedSub = selectedChart?.subtypes.find(s => s.id === selectedSubtype);
    const selectedLib = libraries.find(l => l.id === selectedLibrary);
    const selectedThemeObj = themes.find(t => t.id === selectedTheme);
    
    // Sanitize data before including in code
    const currentData = sanitizeForCodeGeneration(getCurrentData());
    const sanitizedOptions = sanitizeForCodeGeneration(selectedOptions);
    
    return `// Generated ${selectedChart?.label} (${selectedSub?.label}) Chart using ${selectedLib?.name}
// Theme: ${selectedThemeObj?.name}
// Output Format: ${outputFormats.find(f => f.id === selectedOutputFormat)?.name}
// Generated on: ${new Date().toISOString()}

const chartConfig = {
  type: '${selectedChartType}',
  subtype: '${selectedSubtype}',
  library: '${selectedLibrary}',
  theme: '${selectedTheme}',
  options: ${JSON.stringify(sanitizedOptions, null, 2)},
  data: ${JSON.stringify(currentData, null, 2)}
};

// Implementation code would be generated here based on selections
console.log('Chart configuration:', chartConfig);`;
  };

  const getCurrentData = () => {
    let data;
    if (dataInputTab === 'csv' && csvData.length > 0) return csvData;
    if (dataInputTab === 'json' && jsonData) {
      try {
        data = JSON.parse(jsonData);
        return data;
      } catch {
        console.error('Invalid JSON data');
        return [];
      }
    }
    if (dataInputTab === 'sample' && sampleData.length > 0) return sampleData;
    return [];
  };

  const copyToClipboard = async () => {
    try {
      const code = generateCode();
      if (code && code.length > 0) {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        console.error('No code to copy');
      }
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      // Fallback for older browsers
      try {
        const textArea = document.createElement('textarea');
        textArea.value = generateCode();
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackError) {
        console.error('Fallback copy also failed:', fallbackError);
      }
    }
  };

  const getFilteredLibraries = () => {
    if (!selectedChartType) return libraries;
    return libraries.filter(lib => lib.supports.includes(selectedChartType));
  };

  const getIconForChartType = (type: string) => {
    const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
      bar: BarChart3,
      line: LineChart,
      pie: PieChart,
      radar: Radar,
      scatter: Scatter,
      map: Map,
      statistical: BarChart3,
      mini: LineChart,
      timeline: BarChart3,
      hierarchical: PieChart
    };
    return iconMap[type] || BarChart3;
  };

  const AccordionSection: React.FC<{
    id: string;
    title: string;
    children: React.ReactNode;
  }> = ({ id, title, children }) => {
    const isActive = activeAccordion === id;
    
    return (
      <div className="border border-[#3E4C5E] dark:border-[#3E4C5E] border-gray-200 rounded-lg mb-4">
        <button
          onClick={() => toggleAccordion(id)}
          className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-[#1F2937]/20 dark:hover:bg-[#1F2937]/20 hover:bg-gray-50 transition-colors duration-200"
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
                const IconComponent = getIconForChartType(chart.type);
                const isSelected = selectedChartType === chart.type;
                
                return (
                  <button
                    key={chart.type}
                    onClick={() => handleChartTypeSelect(chart.type)}
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
                        {chart.label}
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

          {/* Step 2: Chart Options */}
          <AccordionSection id="chart-options" title="Step 2: Chart Options">
            <div className="mt-4 space-y-6">
              {selectedChartType && (
                <>
                  {/* Subtypes */}
                  <div>
                    <h4 className="text-lg font-semibold text-[#E5F1FF] dark:text-[#E5F1FF] text-gray-900 mb-3">
                      Chart Subtypes
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {chartTypes.find(c => c.type === selectedChartType)?.subtypes.map((subtype) => {
                        const isSelected = selectedSubtype === subtype.id;
                        
                        return (
                          <button
                            key={subtype.id}
                            onClick={() => handleSubtypeSelect(subtype.id)}
                            className={`p-3 rounded-lg border-2 text-left transition-all duration-200 ${
                              isSelected
                                ? 'border-[#0074BD] bg-[#0074BD]/10 dark:border-[#00C9FF] dark:bg-[#00C9FF]/10'
                                : 'border-[#3E4C5E] hover:border-[#0074BD]/50 dark:border-[#3E4C5E] dark:hover:border-[#00C9FF]/50'
                            }`}
                          >
                            <h4 className="font-semibold text-[#E5F1FF] dark:text-[#E5F1FF] text-gray-900 text-sm">
                              {subtype.label}
                            </h4>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Formatting Options */}
                  <div>
                    <h4 className="text-lg font-semibold text-[#E5F1FF] dark:text-[#E5F1FF] text-gray-900 mb-3">
                      Formatting Options
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(chartTypes.find(c => c.type === selectedChartType)?.options || {}).map(([optionKey, optionValue]) => (
                        <div key={optionKey} className="space-y-2">
                          <label className="block text-sm font-medium text-[#E5F1FF] dark:text-[#E5F1FF] text-gray-700 capitalize">
                            {optionKey.replace(/([A-Z])/g, ' $1').trim()}
                          </label>
                          
                          {Array.isArray(optionValue) ? (
                            <select
                              value={selectedOptions[optionKey] || ''}
                              onChange={(e) => handleOptionChange(optionKey, e.target.value)}
                              className="w-full p-2 bg-[#0E1B2A] dark:bg-[#0E1B2A] bg-white border border-[#3E4C5E] dark:border-[#3E4C5E] border-gray-300 rounded-lg text-[#E5F1FF] dark:text-[#E5F1FF] text-gray-900 text-sm focus:border-[#0074BD] dark:focus:border-[#00C9FF] focus:outline-none"
                            >
                              <option value="">Select {optionKey}...</option>
                              {optionValue.map((value) => (
                                <option key={String(value)} value={String(value)}>
                                  {String(value)}
                                </option>
                              ))}
                            </select>
                          ) : typeof optionValue === 'object' && optionValue.min !== undefined && optionValue.max !== undefined ? (
                            <div className="space-y-1">
                              <input
                                type="range"
                                min={optionValue.min}
                                max={optionValue.max}
                                step={optionValue.step || 1}
                                value={selectedOptions[optionKey] || optionValue.min}
                                onChange={(e) => handleOptionChange(optionKey, Number(e.target.value))}
                                className="w-full h-2 bg-[#3E4C5E] dark:bg-[#3E4C5E] bg-gray-200 rounded-lg appearance-none cursor-pointer"
                              />
                              <div className="flex justify-between text-xs text-[#E5F1FF]/70 dark:text-[#E5F1FF]/70 text-gray-500">
                                <span>{optionValue.min}</span>
                                <span className="font-medium text-[#00C9FF] dark:text-[#00C9FF] text-blue-600">
                                  {selectedOptions[optionKey] || optionValue.min}
                                </span>
                                <span>{optionValue.max}</span>
                              </div>
                            </div>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </AccordionSection>

          {/* Step 3: Library */}
          <AccordionSection id="library" title="Step 3: Charting Library">
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

          {/* Step 4: Chart Style */}
          <AccordionSection id="chart-style" title="Step 4: Chart Style">
            <div className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {themes.map((theme) => {
                  const isSelected = selectedTheme === theme.id;
                  
                  return (
                    <button
                      key={theme.id}
                      onClick={() => setSelectedTheme(theme.id)}
                      className={`p-5 rounded-lg border-2 text-left transition-all duration-200 ${
                        isSelected
                          ? 'border-[#0074BD] bg-[#0074BD]/10 dark:border-[#00C9FF] dark:bg-[#00C9FF]/10'
                          : 'border-[#3E4C5E] hover:border-[#0074BD]/50 dark:border-[#3E4C5E] dark:hover:border-[#00C9FF]/50'
                      }`}
                    >
                      <h4 className="font-bold text-[#E5F1FF] dark:text-[#E5F1FF] text-gray-900 mb-2">
                        {theme.name}
                      </h4>
                      <p className="text-sm text-[#E5F1FF]/80 dark:text-[#E5F1FF]/80 text-gray-600 mb-2">
                        {theme.description}
                      </p>
                      <p className="text-xs text-[#E5F1FF]/60 dark:text-[#E5F1FF]/60 text-gray-500 mb-3 italic">
                        {theme.mood}
                      </p>
                      <div className="mb-3">
                        <p className="text-xs text-[#E5F1FF]/70 dark:text-[#E5F1FF]/70 text-gray-500 mb-1">
                          Fonts: {theme.fonts.join(', ')}
                        </p>
                      </div>
                      <div className="flex gap-1 flex-wrap">
                        {theme.palette.map((color, index) => (
                          <div
                            key={index}
                            className="w-5 h-5 rounded-full border border-[#3E4C5E] dark:border-[#3E4C5E] border-gray-300 shadow-sm"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </AccordionSection>

          {/* Step 5: Input Data */}
          <AccordionSection id="input-data" title="Step 5: Input Data">
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
                    maxLength={100000}
                    rows={8}
                    className="w-full p-3 bg-[#0E1B2A] dark:bg-[#0E1B2A] bg-white border border-[#3E4C5E] dark:border-[#3E4C5E] border-gray-300 rounded-lg text-[#E5F1FF] dark:text-[#E5F1FF] text-gray-900 font-mono text-sm focus:border-[#0074BD] dark:focus:border-[#00C9FF] focus:outline-none"
                  />
                </div>
              )}

              {dataInputTab === 'sample' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {chartTypes.map((chartType) => (
                    <button
                      key={chartType.type}
                      onClick={() => handleSampleDataSelect(chartType.type)}
                      className={`p-4 text-left border border-[#3E4C5E] dark:border-[#3E4C5E] border-gray-200 rounded-lg hover:border-[#0074BD] dark:hover:border-[#00C9FF] transition-colors duration-200 ${
                        selectedChartType === chartType.type ? 'border-[#0074BD] bg-[#0074BD]/10 dark:border-[#00C9FF] dark:bg-[#00C9FF]/10' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        {React.createElement(getIconForChartType(chartType.type), {
                          size: 20,
                          className: selectedChartType === chartType.type ? 'text-[#0074BD] dark:text-[#00C9FF]' : 'text-[#E5F1FF]/80 dark:text-[#E5F1FF]/80'
                        })}
                        <h4 className="font-semibold text-[#E5F1FF] dark:text-[#E5F1FF] text-gray-900">
                          {chartType.label} Sample
                        </h4>
                      </div>
                      <p className="text-sm text-[#E5F1FF]/70 dark:text-[#E5F1FF]/70 text-gray-600">
                        Generic {chartType.label.toLowerCase()} data structure
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
          </AccordionSection>

          {/* Step 6: Output Format */}
          <AccordionSection id="output-format" title="Step 6: Output Format">
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

          {/* Step 7: Preview */}
          <AccordionSection id="preview" title="Step 7: Preview">
            <div className="mt-4">
              <div className="bg-[#1F2937]/20 dark:bg-[#1F2937]/20 bg-gray-50 rounded-lg p-8 text-center border-2 border-dashed border-[#3E4C5E] dark:border-[#3E4C5E] border-gray-300">
                <div className="text-[#E5F1FF]/60 dark:text-[#E5F1FF]/60 text-gray-400 mb-4">
                  {selectedChartType && selectedSubtype ? (
                    <>
                      <div className="text-lg font-semibold mb-2">Chart Preview</div>
                      <div className="text-sm">
                        {chartTypes.find(c => c.type === selectedChartType)?.subtypes.find(s => s.id === selectedSubtype)?.label} chart using{' '}
                        {libraries.find(l => l.id === selectedLibrary)?.name} would appear here
                      </div>
                    </>
                  ) : (
                    <div>Select chart type, subtype, and configure options to see preview</div>
                  )}
                </div>
              </div>
            </div>
          </AccordionSection>

          {/* Step 8: Download */}
          <AccordionSection id="download" title="Step 8: Download">
            <div className="mt-4 space-y-6">
              {/* Code Output */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-[#E5F1FF] dark:text-[#E5F1FF] text-gray-900">
                    Generated Code
                  </h4>
                </div>
                
                <textarea
                  value={generateCode()}
                  readOnly
                  placeholder="Generated code will appear here..."
                  rows={20}
                  className="w-full p-4 bg-[#0E1B2A] dark:bg-[#0E1B2A] bg-gray-900 border border-[#3E4C5E] dark:border-[#3E4C5E] border-gray-700 rounded-lg text-sm text-[#E5F1FF] dark:text-[#E5F1FF] text-green-400 font-mono resize-y focus:border-[#0074BD] dark:focus:border-[#00C9FF] focus:outline-none"
                />
              </div>

              {/* Download Options */}
              <div>
                <h4 className="text-lg font-semibold text-[#E5F1FF] dark:text-[#E5F1FF] text-gray-900 mb-4">
                  Download Options
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-[#0074BD] dark:bg-[#00C9FF] text-white rounded-lg hover:opacity-90 transition-opacity duration-200"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? 'Copied!' : 'Copy Code'}
                  </button>
                  
                  <button className="flex items-center justify-center gap-2 px-4 py-3 bg-[#1F2937] dark:bg-[#1F2937] bg-gray-600 text-white rounded-lg hover:opacity-90 transition-opacity duration-200">
                    <Download size={16} />
                    Download File
                  </button>
                  
                  {(selectedOutputFormat === 'full-module' || selectedOutputFormat === 'drupal-controller') && (
                    <button className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#0074BD] to-[#00C9FF] dark:from-[#0074BD] dark:to-[#00C9FF] from-blue-600 to-cyan-500 text-white rounded-lg hover:opacity-90 transition-opacity duration-200">
                      <Download size={16} />
                      Download ZIP
                    </button>
                  )}
                </div>
              </div>
            </div>
          </AccordionSection>
        </div>
      </div>
    </div>
  );
};

export default Generator;