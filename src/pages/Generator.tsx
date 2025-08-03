import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import Papa from 'papaparse';

// Import modular components
import AccordionSection from '../components/generator/AccordionSection';
import VisualizationTypeSelector from '../components/generator/VisualizationTypeSelector';
import VisualizationOptions from '../components/generator/VisualizationOptions';
import LibrarySelector from '../components/generator/LibrarySelector';
import ThemeSelector from '../components/generator/ThemeSelector';
import DataInput from '../components/generator/DataInput';
import OutputFormatSelector from '../components/generator/OutputFormatSelector';
import CodeOutput from '../components/generator/CodeOutput';

// Import services
import { CodeGenerator } from '../services/CodeGenerator';
import { DefaultConfigService } from '../services/DefaultConfig';

// Import data
import visualizationTypes from '../data/visualizationTypes';
import librariesData from '../data/libraries.json';
import chartStylesData from '../data/chartStyles.json';

// Import types
import { Theme } from '../types/Theme';

interface VisualizationType {
  type: string;
  label: string;
  description: string;
  subtypes: { id: string; label: string }[];
  options: Record<string, any>;
}

interface Library {
  id: string;
  name: string;
  license: string;
  homepage: string;
  bestFor: string;
  supports: string[];
}

interface OutputFormat {
  id: string;
  name: string;
  description: string;
}

const Generator: React.FC = () => {
  const [activeAccordion, setActiveAccordion] = useState<string>('visualization-type');
  const [selectedType, setSelectedType] = useState<string>('');
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

  const libraries: Library[] = librariesData;
  const themes: Theme[] = chartStylesData;

  const outputFormats: OutputFormat[] = [
    { id: 'raw-js', name: 'Raw JS', description: 'Pure JavaScript code' },
    { id: 'php-block', name: 'PHP Block', description: 'Drupal block plugin' },
    { id: 'drupal-controller', name: 'Drupal Controller', description: 'Controller with route' },
    { id: 'full-module', name: 'Full Module (ZIP)', description: 'Complete Drupal module' },
    { id: 'html-snippet', name: 'HTML Snippet', description: 'Standalone HTML file' }
  ];

  // Sample data will be loaded dynamically based on selected visualization type
  const getSampleDataForVisualizationType = async (visualizationType: string) => {
    try {
      const response = await import(`../data/sampleData/${visualizationType}.json`);
      return response.default;
    } catch (error) {
      console.error(`No sample data found for visualization type: ${visualizationType}`);
      return null;
    }
  };

  const toggleAccordion = (section: string) => {
    setActiveAccordion(activeAccordion === section ? '' : section);
  };

  const handleVisualizationTypeSelect = (visualizationType: string) => {
    setSelectedType(visualizationType);
    
    // Set defaults for the selected visualization type
    const defaultConfig = DefaultConfigService.getDefaultConfig(visualizationType);
    setSelectedSubtype(defaultConfig.subtype || '');
    setSelectedLibrary(defaultConfig.library || '');
    setSelectedOptions(defaultConfig.options || {});
    
    // Auto-load sample data for the selected visualization type
    handleSampleDataSelect(visualizationType);
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

  const handleSampleDataSelect = async (visualizationType: string) => {
    try {
      const dataset = await getSampleDataForVisualizationType(visualizationType);
      if (dataset && dataset.data) {
        setSampleData(dataset.data);
      } else {
        console.warn(`No valid data found for visualization type: ${visualizationType}`);
        setSampleData([]);
      }
    } catch (error) {
      console.error(`Failed to load sample data for ${visualizationType}:`, error);
      setSampleData([]);
    }
  };

  const generateCode = () => {
    // Input validation
    if (!selectedType) {
      return '// Please select a visualization type first';
    }
    
    const selectedVisualization = visualizationTypes.find(v => v.type === selectedType);
    const selectedSub = selectedVisualization?.subtypes.find(s => s.id === selectedSubtype);
    const selectedLib = libraries.find(l => l.id === selectedLibrary);
    const selectedThemeObj = themes.find(t => t.id === selectedTheme);
    
    // Sanitize data before including in code
    const currentData = sanitizeForCodeGeneration(getCurrentData());
    const sanitizedOptions = sanitizeForCodeGeneration(selectedOptions);
    
    return CodeGenerator.generateCode({
      selectedType,
      selectedSubtype,
      selectedLibrary,
      selectedTheme: selectedThemeObj!,
      selectedOptions: sanitizedOptions,
      data: currentData
    });
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

  const downloadFile = () => {
    const code = generateCode();
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `drupal-visualization-${selectedType}-${Date.now()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="text-[#00C9FF] dark:text-[#00C9FF] text-cyan-500" size={40} />
            <h1 className="text-4xl font-bold font-['Inter','Segoe_UI',sans-serif] text-[#E5F1FF] dark:text-[#E5F1FF] text-gray-900">
               Generator
            </h1>
          </div>
          <p className="text-xl text-[#E5F1FF]/80 dark:text-[#E5F1FF]/80 text-gray-600 max-w-3xl mx-auto">
            Create beautiful Drupal data visualizations in minutes
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Step 1: Visualization Type */}
          <AccordionSection 
            id="visualization-type" 
            title="Step 1: Visualization Type"
            isActive={activeAccordion === 'visualization-type'}
            onToggle={() => toggleAccordion('visualization-type')}
          >
            <VisualizationTypeSelector
              visualizationTypes={visualizationTypes}
              selectedType={selectedType}
              onTypeSelect={handleVisualizationTypeSelect}
            />
          </AccordionSection>

          {/* Step 2: Visualization Options */}
          <AccordionSection 
            id="visualization-options" 
            title="Step 2: Visualization Options"
            isActive={activeAccordion === 'visualization-options'}
            onToggle={() => toggleAccordion('visualization-options')}
          >
            <VisualizationOptions
              selectedType={selectedType}
              selectedSubtype={selectedSubtype}
              selectedOptions={selectedOptions}
              visualizationTypes={visualizationTypes}
              onSubtypeSelect={handleSubtypeSelect}
              onOptionChange={handleOptionChange}
            />
          </AccordionSection>

          {/* Step 3: Library */}
          <AccordionSection 
            id="library" 
            title="Step 3: Visualization Library"
            isActive={activeAccordion === 'library'}
            onToggle={() => toggleAccordion('library')}
          >
            <LibrarySelector
              libraries={libraries}
              selectedLibrary={selectedLibrary}
              selectedType={selectedType}
              onLibrarySelect={handleLibrarySelect}
            />
          </AccordionSection>

          {/* Step 4: Visualization Style */}
          <AccordionSection 
            id="visualization-style" 
            title="Step 4: Visualization Style"
            isActive={activeAccordion === 'visualization-style'}
            onToggle={() => toggleAccordion('visualization-style')}
          >
            <ThemeSelector
              themes={themes}
              selectedTheme={selectedTheme}
              onThemeSelect={setSelectedTheme}
            />
          </AccordionSection>

          {/* Step 5: Input Data */}
          <AccordionSection 
            id="input-data" 
            title="Step 5: Input Data"
            isActive={activeAccordion === 'input-data'}
            onToggle={() => toggleAccordion('input-data')}
          >
            <DataInput
              dataInputTab={dataInputTab}
              csvData={csvData}
              jsonData={jsonData}
              sampleData={sampleData}
              visualizationTypes={visualizationTypes}
              selectedType={selectedType}
              onTabChange={setDataInputTab}
              onFileUpload={handleFileUpload}
              onJsonInput={handleJsonInput}
              onSampleDataSelect={handleSampleDataSelect}
            />
          </AccordionSection>

          {/* Step 6: Output Format */}
          <AccordionSection 
            id="output-format" 
            title="Step 6: Output Format"
            isActive={activeAccordion === 'output-format'}
            onToggle={() => toggleAccordion('output-format')}
          >
            <OutputFormatSelector
              outputFormats={outputFormats}
              selectedFormat={selectedOutputFormat}
              onFormatSelect={setSelectedOutputFormat}
            />
          </AccordionSection>

          {/* Step 7: Preview */}
          <AccordionSection 
            id="preview" 
            title="Step 7: Preview"
            isActive={activeAccordion === 'preview'}
            onToggle={() => toggleAccordion('preview')}
          >
            <div className="mt-4">
              <div className="bg-[#1F2937]/20 dark:bg-[#1F2937]/20 bg-gray-50 rounded-lg p-8 text-center border-2 border-dashed border-[#3E4C5E] dark:border-[#3E4C5E] border-gray-300">
                <div className="text-[#E5F1FF]/60 dark:text-[#E5F1FF]/60 text-gray-400 mb-4">
                  {selectedType && selectedSubtype ? (
                    <>
                      <div className="text-lg font-semibold mb-2">Visualization Preview</div>
                      <div className="text-sm">
                        {visualizationTypes.find(v => v.type === selectedType)?.subtypes.find(s => s.id === selectedSubtype)?.label} visualization using{' '}
                        {libraries.find(l => l.id === selectedLibrary)?.name} would appear here
                      </div>
                    </>
                  ) : (
                    <div>Select visualization type, subtype, and configure options to see preview</div>
                  )}
                </div>
              </div>
            </div>
          </AccordionSection>

          {/* Step 8: Download */}
          <AccordionSection 
            id="download" 
            title="Step 8: Download"
            isActive={activeAccordion === 'download'}
            onToggle={() => toggleAccordion('download')}
          >
            <CodeOutput
              generatedCode={generateCode()}
              copied={copied}
              selectedType={selectedType}
              selectedOutputFormat={selectedOutputFormat}
              onCopy={copyToClipboard}
              onDownload={downloadFile}
            />
          </AccordionSection>
        </div>
      </div>
    </div>
  );
};

export default Generator;