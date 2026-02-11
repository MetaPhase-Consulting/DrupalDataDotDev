import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, Copy, Database, Check, Upload, Table2, Code2, Plus, Trash2 } from 'lucide-react';
import type { ManualInputRow } from '../../types/data';

export type InputMode = 'json' | 'csv' | 'manual';

interface DataInputProps {
  inputMode: InputMode;
  jsonData: string;
  sampleData: unknown;
  selectedType: string;
  csvRowCount: number;
  manualRows: ManualInputRow[];
  errorMessage?: string | null;
  statusMessage?: string | null;
  onInputModeChange: (mode: InputMode) => void;
  onJsonInput: (value: string) => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onManualRowsChange: (rows: ManualInputRow[]) => void;
  onInsertSampleData: () => void;
}

const DataInput: React.FC<DataInputProps> = ({
  inputMode,
  jsonData,
  sampleData,
  selectedType,
  csvRowCount,
  manualRows,
  errorMessage,
  statusMessage,
  onInputModeChange,
  onJsonInput,
  onFileUpload,
  onManualRowsChange,
  onInsertSampleData,
}) => {
  const [jsonDataCopied, setJsonDataCopied] = useState(false);

  const copyJsonData = async () => {
    try {
      await navigator.clipboard.writeText(jsonData);
      setJsonDataCopied(true);
      setTimeout(() => setJsonDataCopied(false), 2000);
    } catch {
      // Keep local-only UI action silent; global status is handled in page-level controls.
    }
  };

  const clearData = () => {
    if (inputMode === 'json') {
      onJsonInput('');
      return;
    }

    if (inputMode === 'manual') {
      onManualRowsChange(getDefaultManualRows(selectedType));
      return;
    }
  };

  const updateManualRow = (index: number, key: keyof ManualInputRow, value: string) => {
    const nextRows = [...manualRows];
    nextRows[index] = {
      ...nextRows[index],
      [key]: value,
    };
    onManualRowsChange(nextRows);
  };

  const addManualRow = () => {
    const base: ManualInputRow = selectedType === 'map'
      ? { id: crypto.randomUUID(), label: '', lat: '', lng: '', value: '' }
      : { id: crypto.randomUUID(), label: '', value: '', secondaryValue: '' };

    onManualRowsChange([...manualRows, base]);
  };

  const removeManualRow = (index: number) => {
    if (manualRows.length <= 1) {
      return;
    }
    onManualRowsChange(manualRows.filter((_, rowIndex) => rowIndex !== index));
  };

  const hasSampleData = Boolean(sampleData) && (Array.isArray(sampleData) ? sampleData.length > 0 : true);

  return (
    <div className="mt-4 space-y-4">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Data input mode">
        <button
          onClick={() => onInputModeChange('json')}
          role="tab"
          aria-selected={inputMode === 'json'}
          aria-controls="data-input-json-panel"
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            inputMode === 'json'
              ? 'bg-[#0074BD] text-white'
              : 'bg-[#1F2937]/20 dark:bg-[#1F2937]/20 bg-gray-100 text-gray-700 dark:text-[#E5F1FF]'
          }`}
        >
          <Code2 size={14} /> JSON
        </button>
        <button
          onClick={() => onInputModeChange('csv')}
          role="tab"
          aria-selected={inputMode === 'csv'}
          aria-controls="data-input-csv-panel"
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            inputMode === 'csv'
              ? 'bg-[#0074BD] text-white'
              : 'bg-[#1F2937]/20 dark:bg-[#1F2937]/20 bg-gray-100 text-gray-700 dark:text-[#E5F1FF]'
          }`}
        >
          <Upload size={14} /> CSV Upload
        </button>
        <button
          onClick={() => onInputModeChange('manual')}
          role="tab"
          aria-selected={inputMode === 'manual'}
          aria-controls="data-input-manual-panel"
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            inputMode === 'manual'
              ? 'bg-[#0074BD] text-white'
              : 'bg-[#1F2937]/20 dark:bg-[#1F2937]/20 bg-gray-100 text-gray-700 dark:text-[#E5F1FF]'
          }`}
        >
          <Table2 size={14} /> Manual Table
        </button>
      </div>

      {errorMessage ? (
        <div role="alert" className="flex items-start gap-2 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-700/50 dark:bg-red-900/20 dark:text-red-200">
          <AlertCircle size={16} className="mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      ) : null}

      {!errorMessage && statusMessage ? (
        <div role="status" aria-live="polite" className="flex items-start gap-2 rounded-md border border-green-300 bg-green-50 px-3 py-2 text-sm text-green-700 dark:border-green-700/50 dark:bg-green-900/20 dark:text-green-200">
          <CheckCircle2 size={16} className="mt-0.5" />
          <span>{statusMessage}</span>
        </div>
      ) : null}

      {inputMode === 'json' ? (
        <div id="data-input-json-panel" role="tabpanel" className="bg-[#1e1e1e] rounded-lg border border-[#3e3e3e] overflow-hidden">
          <div className="bg-[#2d2d30] border-b border-[#3e3e3e] px-4 py-2 flex items-center justify-between">
            <span className="text-[#cccccc] text-sm font-medium">Input Data (JSON)</span>
            <div className="flex items-center gap-2">
              <button
                onClick={onInsertSampleData}
                disabled={!hasSampleData}
                className="flex items-center gap-2 px-3 py-1.5 bg-[#4a5568] hover:bg-[#5a6578] disabled:opacity-50 text-white text-sm rounded transition-colors duration-200"
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
              onChange={(event) => onJsonInput(event.target.value)}
              aria-label="JSON data input"
              placeholder="Enter your JSON data here..."
              maxLength={120000}
              rows={12}
              className="w-full pl-16 pr-4 py-2 bg-[#1e1e1e] text-[#d4d4d4] font-mono text-sm leading-5 resize-y border-none outline-none"
              style={{ fontFamily: "'JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', monospace", tabSize: 2 }}
              spellCheck="false"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
            />
          </div>
        </div>
      ) : null}

      {inputMode === 'csv' ? (
        <div id="data-input-csv-panel" role="tabpanel" className="rounded-lg border border-[#3E4C5E] dark:border-[#3E4C5E] border-gray-200 p-4 space-y-3">
          <label htmlFor="csv-input-file" className="block text-sm font-medium text-[#E5F1FF] dark:text-[#E5F1FF] text-gray-700">
            Upload a CSV file (max 10MB)
          </label>
          <input
            id="csv-input-file"
            type="file"
            accept=".csv,text/csv"
            onChange={onFileUpload}
            className="block w-full text-sm text-gray-700 dark:text-[#E5F1FF]/80 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-[#0074BD] file:text-white hover:file:bg-[#005a94]"
          />
          <p className="text-sm text-[#E5F1FF]/70 dark:text-[#E5F1FF]/70 text-gray-600">
            Parsed rows available: <strong>{csvRowCount}</strong>
          </p>
          <p className="text-xs text-[#E5F1FF]/60 dark:text-[#E5F1FF]/60 text-gray-500">
            Expected columns for charts: `label`/`category` + numeric values. For maps: `lat`, `lng`, optional `value`, `label`.
          </p>
        </div>
      ) : null}

      {inputMode === 'manual' ? (
        <div id="data-input-manual-panel" role="tabpanel" className="rounded-lg border border-[#3E4C5E] dark:border-[#3E4C5E] border-gray-200 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-[#E5F1FF] dark:text-[#E5F1FF] text-gray-900">
              {selectedType === 'map' ? 'Manual map rows' : 'Manual chart rows'}
            </h4>
            <div className="flex items-center gap-2">
              <button
                onClick={addManualRow}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-[#0074BD] text-white text-sm hover:bg-[#005a94]"
              >
                <Plus size={14} /> Add Row
              </button>
              <button
                onClick={clearData}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-gray-200 text-gray-800 text-sm hover:bg-gray-300 dark:bg-[#374151] dark:text-[#E5F1FF] dark:hover:bg-[#4B5563]"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                {selectedType === 'map' ? (
                  <tr className="text-left text-gray-600 dark:text-[#E5F1FF]/70 border-b border-gray-200 dark:border-[#3E4C5E]">
                    <th className="py-2 pr-2">Label</th>
                    <th className="py-2 pr-2">Latitude</th>
                    <th className="py-2 pr-2">Longitude</th>
                    <th className="py-2 pr-2">Value</th>
                    <th className="py-2 w-12"> </th>
                  </tr>
                ) : (
                  <tr className="text-left text-gray-600 dark:text-[#E5F1FF]/70 border-b border-gray-200 dark:border-[#3E4C5E]">
                    <th className="py-2 pr-2">Label</th>
                    <th className="py-2 pr-2">Value</th>
                    <th className="py-2 pr-2">Secondary Value</th>
                    <th className="py-2 w-12"> </th>
                  </tr>
                )}
              </thead>
              <tbody>
                {manualRows.map((row, index) => (
                  <tr key={row.id} className="border-b border-gray-100 dark:border-[#1F2937]">
                    <td className="py-2 pr-2">
                      <input
                        value={row.label}
                        onChange={(event) => updateManualRow(index, 'label', event.target.value)}
                        className="w-full rounded-md border border-gray-300 px-2 py-1 dark:border-[#3E4C5E] dark:bg-[#0E1B2A] dark:text-[#E5F1FF]"
                        placeholder="Label"
                      />
                    </td>
                    {selectedType === 'map' ? (
                      <>
                        <td className="py-2 pr-2">
                          <input
                            value={row.lat ?? ''}
                            onChange={(event) => updateManualRow(index, 'lat', event.target.value)}
                            className="w-full rounded-md border border-gray-300 px-2 py-1 dark:border-[#3E4C5E] dark:bg-[#0E1B2A] dark:text-[#E5F1FF]"
                            placeholder="40.7128"
                          />
                        </td>
                        <td className="py-2 pr-2">
                          <input
                            value={row.lng ?? ''}
                            onChange={(event) => updateManualRow(index, 'lng', event.target.value)}
                            className="w-full rounded-md border border-gray-300 px-2 py-1 dark:border-[#3E4C5E] dark:bg-[#0E1B2A] dark:text-[#E5F1FF]"
                            placeholder="-74.0060"
                          />
                        </td>
                        <td className="py-2 pr-2">
                          <input
                            value={row.value}
                            onChange={(event) => updateManualRow(index, 'value', event.target.value)}
                            className="w-full rounded-md border border-gray-300 px-2 py-1 dark:border-[#3E4C5E] dark:bg-[#0E1B2A] dark:text-[#E5F1FF]"
                            placeholder="Value"
                          />
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-2 pr-2">
                          <input
                            value={row.value}
                            onChange={(event) => updateManualRow(index, 'value', event.target.value)}
                            className="w-full rounded-md border border-gray-300 px-2 py-1 dark:border-[#3E4C5E] dark:bg-[#0E1B2A] dark:text-[#E5F1FF]"
                            placeholder="100"
                          />
                        </td>
                        <td className="py-2 pr-2">
                          <input
                            value={row.secondaryValue ?? ''}
                            onChange={(event) => updateManualRow(index, 'secondaryValue', event.target.value)}
                            className="w-full rounded-md border border-gray-300 px-2 py-1 dark:border-[#3E4C5E] dark:bg-[#0E1B2A] dark:text-[#E5F1FF]"
                            placeholder="Optional"
                          />
                        </td>
                      </>
                    )}
                    <td className="py-2 text-right">
                      <button
                        onClick={() => removeManualRow(index)}
                        aria-label={`Remove row ${index + 1}`}
                        className="inline-flex items-center justify-center rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-red-600 dark:text-[#E5F1FF]/70 dark:hover:bg-[#1F2937]"
                        title="Remove row"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-1">
              {selectedType === 'map' ? 'Map data format' : 'Chart data format'}
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              {selectedType === 'map'
                ? 'Use GeoJSON, CSV with lat/lng columns, or manual rows with numeric latitude/longitude.'
                : 'Use Chart.js JSON format or tabular data with labels plus numeric columns. The app normalizes CSV/manual rows automatically.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

function getDefaultManualRows(selectedType: string): ManualInputRow[] {
  if (selectedType === 'map') {
    return [{ id: crypto.randomUUID(), label: '', lat: '', lng: '', value: '' }];
  }

  return [{ id: crypto.randomUUID(), label: '', value: '', secondaryValue: '' }];
}

export default DataInput;
