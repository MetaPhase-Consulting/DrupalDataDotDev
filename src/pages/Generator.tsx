import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Sparkles } from 'lucide-react';
import Papa from 'papaparse';
import { useLocation, useNavigate } from 'react-router-dom';

import AccordionSection from '../components/generator/AccordionSection';
import VisualizationTypeSelector from '../components/generator/VisualizationTypeSelector';
import VisualizationOptions from '../components/generator/VisualizationOptions';
import LibrarySelector from '../components/generator/LibrarySelector';
import ThemeSelector from '../components/generator/ThemeSelector';
import DataInput, { type InputMode } from '../components/generator/DataInput';
import OutputFormatSelector from '../components/generator/OutputFormatSelector';
import CodeOutput from '../components/generator/CodeOutput';
import ChartPreview from '../components/generator/ChartPreview';

import { CodeGenerator } from '../services/CodeGenerator';
import { DefaultConfigService } from '../services/DefaultConfig';

import visualizationTypes from '../data/visualizationTypes';
import librariesData from '../data/libraries.json';
import chartStylesData from '../data/chartStyles.json';

import type { Theme } from '../types/Theme';
import type { ChartJsLikeData, GeoPoint, JsonObject, ManualInputRow, VisualizationData } from '../types/data';
import { convertRawDataToChartJs, isValidChartJsData, isValidGeoJSON } from '../utils/dataTransform';

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

type TabularRow = Record<string, string | number>;

const DEFAULT_INPUT_MODE: InputMode = 'json';
const STATUS_TIMEOUT_MS = 2500;

const getDefaultManualRows = (selectedType: string): ManualInputRow[] => {
  if (selectedType === 'map') {
    return [{ label: '', lat: '', lng: '', value: '' }];
  }

  return [{ label: '', value: '', secondaryValue: '' }];
};

const toNumber = (value: string | number | undefined): number | null => {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const encodeState = (value: unknown): string => {
  return btoa(encodeURIComponent(JSON.stringify(value)));
};

const decodeState = (value: string): unknown => {
  return JSON.parse(decodeURIComponent(atob(value)));
};

const sanitizeString = (value: string): string => {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

const sanitizeForCodeGeneration = (obj: unknown): unknown => {
  if (typeof obj === 'string') {
    return sanitizeString(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeForCodeGeneration);
  }

  if (obj && typeof obj === 'object') {
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      const cleanKey = sanitizeString(key);
      sanitized[cleanKey] = sanitizeForCodeGeneration(value);
    }
    return sanitized;
  }

  return obj;
};

const normalizeMapRows = (rows: TabularRow[]): GeoPoint[] => {
  return rows
    .map((row) => {
      const lat = toNumber(String(row.lat ?? row.latitude ?? ''));
      const lng = toNumber(String(row.lng ?? row.lon ?? row.longitude ?? ''));

      if (lat === null || lng === null) {
        return null;
      }

      return {
        lat,
        lng,
        label: String(row.label ?? row.name ?? ''),
        value: toNumber(String(row.value ?? row.population ?? row.y ?? '')) ?? undefined,
      };
    })
    .filter((row): row is GeoPoint => row !== null);
};

const normalizeManualRows = (rows: ManualInputRow[], selectedType: string): VisualizationData => {
  if (selectedType === 'map') {
    const points = rows
      .map((row) => {
        const lat = toNumber(row.lat);
        const lng = toNumber(row.lng);

        if (lat === null || lng === null) {
          return null;
        }

        return {
          lat,
          lng,
          label: row.label || undefined,
          value: toNumber(row.value) ?? undefined,
        } as GeoPoint;
      })
      .filter((point): point is GeoPoint => point !== null);

    return points;
  }

  const activeRows = rows.filter((row) => row.label.trim().length > 0 || row.value.trim().length > 0);
  const labels = activeRows.map((row, index) => row.label.trim() || `Item ${index + 1}`);
  const primaryData = activeRows.map((row) => toNumber(row.value) ?? 0);
  const secondaryData = activeRows.map((row) => toNumber(row.secondaryValue) ?? 0);

  const datasets: ChartJsLikeData['datasets'] = [
    {
      label: 'Series 1',
      data: primaryData,
    },
  ];

  if (activeRows.some((row) => (row.secondaryValue ?? '').trim().length > 0)) {
    datasets.push({
      label: 'Series 2',
      data: secondaryData,
    });
  }

  return {
    labels,
    datasets,
  };
};

const normalizeParsedJsonData = (parsed: unknown, selectedType: string): VisualizationData => {
  if (selectedType === 'map') {
    if (isValidGeoJSON(parsed)) {
      return parsed as JsonObject;
    }

    if (Array.isArray(parsed)) {
      return normalizeMapRows(parsed as TabularRow[]);
    }

    if (parsed && typeof parsed === 'object' && 'data' in parsed && Array.isArray((parsed as { data?: unknown }).data)) {
      return normalizeMapRows((parsed as { data: TabularRow[] }).data);
    }

    throw new Error('Map JSON must be GeoJSON or an array with lat/lng values.');
  }

  if (isValidChartJsData(parsed)) {
    return parsed as ChartJsLikeData;
  }

  if (
    parsed &&
    typeof parsed === 'object' &&
    'data' in parsed &&
    isValidChartJsData((parsed as { data?: unknown }).data)
  ) {
    return (parsed as { data: ChartJsLikeData }).data;
  }

  if (Array.isArray(parsed)) {
    return convertRawDataToChartJs(parsed as TabularRow[]);
  }

  throw new Error('Chart JSON must be Chart.js format or an array of tabular rows.');
};

const Generator: React.FC = () => {
  const [activeAccordion, setActiveAccordion] = useState<string>('visualization-type');
  const [selectedType, setSelectedType] = useState<string>('bar');
  const [selectedSubtype, setSelectedSubtype] = useState<string>('');
  const [selectedOptions, setSelectedOptions] = useState<Record<string, unknown>>({});
  const [selectedLibrary, setSelectedLibrary] = useState<string>('');
  const [selectedTheme, setSelectedTheme] = useState<string>('drupal-night');
  const [selectedOutputFormat, setSelectedOutputFormat] = useState<string>('javascript-embed');

  const [inputMode, setInputMode] = useState<InputMode>(DEFAULT_INPUT_MODE);
  const [csvData, setCsvData] = useState<TabularRow[]>([]);
  const [jsonData, setJsonData] = useState<string>('');
  const [manualRows, setManualRows] = useState<ManualInputRow[]>(getDefaultManualRows('bar'));
  const [sampleData, setSampleData] = useState<VisualizationData>([]);

  const [copied, setCopied] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const statusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initializedFromUrlRef = useRef(false);

  const libraries: Library[] = librariesData;
  const themes: Theme[] = chartStylesData;

  const outputFormats: OutputFormat[] = [
    { id: 'javascript-embed', name: 'JavaScript Embed', description: 'Embeddable HTML snippet with chart container and script.' },
    { id: 'static-html', name: 'Static HTML', description: 'Standalone HTML file for non-Drupal demos.' },
    { id: 'drupal-block', name: 'Drupal Block Plugin', description: 'Drupal block plugin scaffold with chart assets.' },
    { id: 'drupal-controller', name: 'Drupal Controller', description: 'Route + controller scaffold with rendered chart page.' },
  ];

  const setTransientStatus = (message: string) => {
    if (statusTimerRef.current) {
      clearTimeout(statusTimerRef.current);
    }

    setStatusMessage(message);
    setErrorMessage(null);
    statusTimerRef.current = setTimeout(() => {
      setStatusMessage(null);
    }, STATUS_TIMEOUT_MS);
  };

  const setError = (message: string) => {
    setErrorMessage(message);
    setStatusMessage(null);
  };

  const getSampleDataForVisualizationType = async (visualizationType: string): Promise<VisualizationData | null> => {
    try {
      const response = await import(`../data/sampleData/${visualizationType}.json`);
      const payload = response.default?.data;

      if (!payload) {
        return null;
      }

      return payload as VisualizationData;
    } catch {
      return null;
    }
  };

  const applyDefaultConfigForType = (visualizationType: string) => {
    const defaultConfig = DefaultConfigService.getDefaultConfig(visualizationType);
    const currentLibrary = libraries.find((library) => library.id === selectedLibrary);
    const supportsNewType = currentLibrary?.supports.includes(visualizationType);

    setSelectedType(visualizationType);
    setSelectedSubtype(defaultConfig.subtype || '');
    setSelectedOptions(defaultConfig.options || {});

    if (!supportsNewType) {
      setSelectedLibrary(defaultConfig.library || '');
    }
  };

  const handleSampleDataSelect = async (visualizationType: string) => {
    const dataset = await getSampleDataForVisualizationType(visualizationType);

    if (!dataset) {
      setSampleData([]);
      setJsonData('');
      return;
    }

    setSampleData(dataset);
    setInputMode('json');
    setJsonData(JSON.stringify(dataset, null, 2));
  };

  const handleVisualizationTypeSelect = async (visualizationType: string, loadSample = true) => {
    applyDefaultConfigForType(visualizationType);

    if (loadSample) {
      await handleSampleDataSelect(visualizationType);
    }

    if ((visualizationType === 'map' && selectedType !== 'map') || (visualizationType !== 'map' && selectedType === 'map')) {
      setManualRows(getDefaultManualRows(visualizationType));
    }
  };

  const handleSubtypeSelect = (subtype: string) => {
    setSelectedSubtype(subtype);
  };

  const handleOptionChange = (optionKey: string, value: unknown) => {
    setSelectedOptions((previous) => ({
      ...previous,
      [optionKey]: value,
    }));
  };

  const handleLibrarySelect = (library: string) => {
    setSelectedLibrary(library);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('CSV file is too large. Maximum size is 10MB.');
      return;
    }

    const allowedTypes = ['text/csv', 'application/csv', 'text/plain'];
    const fileExtension = file.name.toLowerCase().split('.').pop();

    if (!allowedTypes.includes(file.type) && fileExtension !== 'csv') {
      setError('Invalid file type. Please upload a CSV file.');
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      transformHeader: (header) => header.trim().replace(/[<>]/g, ''),
      complete: (results) => {
        const parsedRows = (results.data as TabularRow[]).filter((row) => Object.keys(row).length > 0);

        if (results.errors.length > 0) {
          setError(`CSV parsed with ${results.errors.length} warning(s). Fix malformed rows and try again.`);
        } else {
          setTransientStatus(`Loaded ${parsedRows.length} row(s) from CSV.`);
        }

        setCsvData(parsedRows);
        setInputMode('csv');
      },
      error: () => {
        setCsvData([]);
        setError('Unable to parse CSV file. Please verify the format and try again.');
      },
    });
  };

  const handleJsonInput = (value: string) => {
    setJsonData(value);

    if (!value.trim()) {
      setErrorMessage(null);
      return;
    }

    try {
      const parsed = JSON.parse(value);
      if (typeof parsed !== 'object' || parsed === null) {
        setError('JSON must be an object or array.');
        return;
      }
      setErrorMessage(null);
    } catch {
      setError('Invalid JSON syntax.');
    }
  };

  const currentData = useMemo<VisualizationData>(() => {
    try {
      if (inputMode === 'csv') {
        if (csvData.length === 0) {
          return [];
        }

        return selectedType === 'map' ? normalizeMapRows(csvData) : convertRawDataToChartJs(csvData);
      }

      if (inputMode === 'manual') {
        return normalizeManualRows(manualRows, selectedType);
      }

      if (!jsonData.trim()) {
        return [];
      }

      const parsed = JSON.parse(jsonData) as unknown;
      return normalizeParsedJsonData(parsed, selectedType);
    } catch {
      return [];
    }
  }, [csvData, inputMode, jsonData, manualRows, selectedType]);

  const generateCode = () => {
    if (!selectedType) {
      return '// Please select a visualization type first';
    }

    const selectedThemeObject = themes.find((theme) => theme.id === selectedTheme) ?? themes[0];

    return CodeGenerator.generateCode({
      selectedType,
      selectedSubtype,
      selectedLibrary,
      selectedOutputFormat,
      selectedTheme: selectedThemeObject,
      selectedOptions: sanitizeForCodeGeneration(selectedOptions) as Record<string, unknown>,
      data: sanitizeForCodeGeneration(currentData) as VisualizationData,
    });
  };

  const copyToClipboard = async () => {
    const code = generateCode();
    if (!code.trim()) {
      setError('No generated code is available to copy.');
      return;
    }

    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTransientStatus('Generated code copied to clipboard.');
      setTimeout(() => setCopied(false), STATUS_TIMEOUT_MS);
    } catch {
      setError('Copy failed. Please copy the generated code manually.');
    }
  };

  const buildSearchParams = (includeData: boolean) => {
    const params = new URLSearchParams();

    params.set('type', selectedType);
    params.set('subtype', selectedSubtype);
    params.set('lib', selectedLibrary);
    params.set('theme', selectedTheme);
    params.set('format', selectedOutputFormat);
    params.set('input', inputMode);
    params.set('opts', encodeState(selectedOptions));

    if (includeData) {
      params.set('data', encodeState(currentData));
    }

    return params;
  };

  const copyShareLink = async () => {
    try {
      const params = buildSearchParams(true);
      const shareUrl = `${window.location.origin}/generator?${params.toString()}`;
      await navigator.clipboard.writeText(shareUrl);

      setShareCopied(true);
      setTransientStatus('Share link copied to clipboard.');
      setTimeout(() => setShareCopied(false), STATUS_TIMEOUT_MS);
    } catch {
      setError('Unable to copy share link.');
    }
  };

  useEffect(() => {
    const initializeFromUrl = async () => {
      const params = new URLSearchParams(location.search);
      const supportedTypes = new Set(visualizationTypes.map((item) => item.type));

      const typeFromUrl = params.get('type');
      const sampleFromUrl = params.get('sample');
      const requestedType =
        (typeFromUrl && supportedTypes.has(typeFromUrl) ? typeFromUrl : null) ||
        (sampleFromUrl && supportedTypes.has(sampleFromUrl) ? sampleFromUrl : null) ||
        'bar';

      const hasDataPayload = Boolean(params.get('data'));
      await handleVisualizationTypeSelect(requestedType, !hasDataPayload);

      const subtype = params.get('subtype');
      if (subtype) {
        setSelectedSubtype(subtype);
      }

      const lib = params.get('lib');
      if (lib) {
        setSelectedLibrary(lib);
      }

      const theme = params.get('theme');
      if (theme) {
        setSelectedTheme(theme);
      }

      const format = params.get('format');
      if (format) {
        setSelectedOutputFormat(format);
      }

      const input = params.get('input') as InputMode | null;
      if (input === 'json' || input === 'csv' || input === 'manual') {
        setInputMode(input);
      }

      const optionsPayload = params.get('opts');
      if (optionsPayload) {
        try {
          const parsedOptions = decodeState(optionsPayload);
          if (parsedOptions && typeof parsedOptions === 'object' && !Array.isArray(parsedOptions)) {
            setSelectedOptions(parsedOptions as Record<string, unknown>);
          }
        } catch {
          setError('Unable to parse options from URL. Defaults were used.');
        }
      }

      const dataPayload = params.get('data');
      if (dataPayload) {
        try {
          const parsedData = decodeState(dataPayload);
          setInputMode('json');
          setJsonData(JSON.stringify(parsedData, null, 2));
          setTransientStatus('Loaded shared generator state from URL.');
        } catch {
          setError('Unable to parse data payload from URL.');
        }
      }

      initializedFromUrlRef.current = true;
    };

    if (!initializedFromUrlRef.current) {
      void initializeFromUrl();
    }

    return () => {
      if (statusTimerRef.current) {
        clearTimeout(statusTimerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!initializedFromUrlRef.current) {
      return;
    }

    const params = buildSearchParams(false);
    navigate(`/generator?${params.toString()}`, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    inputMode,
    navigate,
    selectedLibrary,
    selectedOptions,
    selectedOutputFormat,
    selectedSubtype,
    selectedTheme,
    selectedType,
  ]);

  const toggleAccordion = (section: string) => {
    setActiveAccordion(activeAccordion === section ? '' : section);
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
            Create Drupal-ready visualizations from JSON, CSV, or manual data.
          </p>
        </div>

        {errorMessage ? (
          <div role="alert" className="max-w-4xl mx-auto mb-4 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-red-700 dark:border-red-700/50 dark:bg-red-900/20 dark:text-red-200">
            {errorMessage}
          </div>
        ) : null}

        {!errorMessage && statusMessage ? (
          <div role="status" aria-live="polite" className="max-w-4xl mx-auto mb-4 rounded-md border border-green-300 bg-green-50 px-4 py-3 text-green-700 dark:border-green-700/50 dark:bg-green-900/20 dark:text-green-200">
            {statusMessage}
          </div>
        ) : null}

        <div className="max-w-4xl mx-auto">
          <AccordionSection
            id="visualization-type"
            title="Step 1: Visualization"
            isActive={activeAccordion === 'visualization-type'}
            onToggle={() => toggleAccordion('visualization-type')}
          >
            <VisualizationTypeSelector
              visualizationTypes={visualizationTypes}
              selectedType={selectedType}
              onTypeSelect={(type) => {
                void handleVisualizationTypeSelect(type, true);
              }}
            />
          </AccordionSection>

          <AccordionSection
            id="visualization-options"
            title="Step 2: Options"
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

          <AccordionSection
            id="library"
            title="Step 3: Library"
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

          <AccordionSection
            id="visualization-style"
            title="Step 4: Style"
            isActive={activeAccordion === 'visualization-style'}
            onToggle={() => toggleAccordion('visualization-style')}
          >
            <ThemeSelector themes={themes} selectedTheme={selectedTheme} onThemeSelect={setSelectedTheme} />
          </AccordionSection>

          <AccordionSection
            id="input-data"
            title="Step 5: Input"
            isActive={activeAccordion === 'input-data'}
            onToggle={() => toggleAccordion('input-data')}
          >
            <DataInput
              inputMode={inputMode}
              csvRowCount={csvData.length}
              jsonData={jsonData}
              manualRows={manualRows}
              sampleData={sampleData}
              selectedType={selectedType}
              errorMessage={errorMessage}
              statusMessage={statusMessage}
              onInputModeChange={setInputMode}
              onFileUpload={handleFileUpload}
              onInsertSampleData={() => {
                if (sampleData) {
                  setInputMode('json');
                  setJsonData(JSON.stringify(sampleData, null, 2));
                }
              }}
              onJsonInput={handleJsonInput}
              onManualRowsChange={setManualRows}
            />
          </AccordionSection>

          <AccordionSection
            id="output-format"
            title="Step 6: Output"
            isActive={activeAccordion === 'output-format'}
            onToggle={() => toggleAccordion('output-format')}
          >
            <OutputFormatSelector
              outputFormats={outputFormats}
              selectedFormat={selectedOutputFormat}
              onFormatSelect={setSelectedOutputFormat}
            />
          </AccordionSection>

          <AccordionSection
            id="preview"
            title="Step 7: Preview"
            isActive={activeAccordion === 'preview'}
            onToggle={() => toggleAccordion('preview')}
          >
            <ChartPreview
              selectedType={selectedType}
              selectedSubtype={selectedSubtype}
              selectedLibrary={selectedLibrary}
              selectedTheme={selectedTheme}
              data={currentData}
              options={selectedOptions}
            />
          </AccordionSection>

          <AccordionSection
            id="download"
            title="Step 8: Download"
            isActive={activeAccordion === 'download'}
            onToggle={() => toggleAccordion('download')}
          >
            <CodeOutput
              generatedCode={generateCode()}
              copied={copied}
              shareCopied={shareCopied}
              selectedType={selectedType}
              selectedOutputFormat={selectedOutputFormat}
              selectedLibrary={selectedLibrary}
              selectedSubtype={selectedSubtype}
              currentData={currentData}
              onCopy={copyToClipboard}
              onCopyShareLink={copyShareLink}
              onGenerateCode={generateCode}
            />
          </AccordionSection>
        </div>
      </div>
    </div>
  );
};

export default Generator;
