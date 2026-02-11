import React, { useState } from 'react';
import { Copy, Check, FileText, Archive, Link2, AlertCircle } from 'lucide-react';
import JSZip from 'jszip';
import { convertRawDataToChartJs, isValidChartJsData, isValidGeoJSON } from '../../utils/dataTransform';
import type { VisualizationData } from '../../types/data';

interface CodeOutputProps {
  generatedCode: string;
  copied: boolean;
  shareCopied: boolean;
  selectedType: string;
  selectedOutputFormat: string;
  selectedLibrary: string;
  selectedSubtype: string;
  currentData: VisualizationData;
  onCopy: () => void;
  onCopyShareLink: () => void;
  onGenerateCode: () => string;
}

const CodeOutput: React.FC<CodeOutputProps> = ({
  generatedCode,
  copied,
  shareCopied,
  selectedType,
  selectedOutputFormat,
  selectedLibrary,
  selectedSubtype,
  currentData,
  onCopy,
  onCopyShareLink,
  onGenerateCode,
}) => {
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const getFileExtension = () => {
    switch (selectedOutputFormat) {
      case 'javascript-embed':
        return 'snippet.html';
      case 'static-html':
        return 'html';
      case 'drupal-block':
      case 'drupal-controller':
        return 'php';
      default:
        return 'txt';
    }
  };

  const getMimeType = () => {
    switch (selectedOutputFormat) {
      case 'javascript-embed':
      case 'static-html':
        return 'text/html';
      default:
        return 'text/plain';
    }
  };

  const getFileName = () => {
    const timestamp = Date.now();
    const baseName = `drupal-${selectedType}-${selectedSubtype || 'chart'}-${selectedLibrary}`;
    return `${baseName}-${timestamp}`;
  };

  const isMapDataValid = (data: VisualizationData): boolean => {
    if (isValidGeoJSON(data)) {
      return true;
    }

    if (!Array.isArray(data)) {
      return false;
    }

    return data.some((entry) => {
      if (!entry || typeof entry !== 'object') {
        return false;
      }

      const candidate = entry as Record<string, unknown>;
      const lat = Number(candidate.lat ?? candidate.latitude);
      const lng = Number(candidate.lng ?? candidate.lon ?? candidate.longitude);
      return Number.isFinite(lat) && Number.isFinite(lng);
    });
  };

  const isChartDataValid = (data: VisualizationData): boolean => {
    if (isValidChartJsData(data)) {
      return true;
    }

    if (data && typeof data === 'object' && !Array.isArray(data) && 'data' in data) {
      const payload = (data as { data?: unknown }).data;
      return isValidChartJsData(payload);
    }

    if (Array.isArray(data)) {
      try {
        convertRawDataToChartJs(data as Array<Record<string, unknown>>);
        return true;
      } catch {
        return false;
      }
    }

    return false;
  };

  const validateDownloadRequest = () => {
    if (!selectedLibrary) {
      return 'Select a visualization library before downloading.';
    }

    if (!generatedCode.trim()) {
      return 'No generated code is available yet.';
    }

    if (selectedType === 'map') {
      return isMapDataValid(currentData)
        ? null
        : 'Map downloads require GeoJSON or rows with valid latitude/longitude values.';
    }

    return isChartDataValid(currentData)
      ? null
      : 'Chart downloads require Chart.js-style data or tabular rows with labels and numeric values.';
  };

  const downloadSingleFile = () => {
    const validationError = validateDownloadRequest();
    if (validationError) {
      setDownloadError(validationError);
      return;
    }

    setDownloadError(null);
    const fileName = `${getFileName()}.${getFileExtension()}`;
    const currentCode = onGenerateCode();
    const blob = new Blob([currentCode], { type: getMimeType() });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadZipFile = async () => {
    const validationError = validateDownloadRequest();
    if (validationError) {
      setDownloadError(validationError);
      return;
    }

    setDownloadError(null);
    const zip = new JSZip();
    const baseName = getFileName();
    const currentCode = onGenerateCode();

    if (selectedOutputFormat === 'drupal-block' || selectedOutputFormat === 'drupal-controller') {
      addDrupalScaffold(zip, {
        moduleName: `drupal_${selectedType}_${selectedLibrary}`.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase(),
        generatedCode: currentCode,
        selectedType,
        selectedSubtype,
        selectedLibrary,
        selectedOutputFormat,
      });
    } else {
      const mainFileName = `${baseName}.${getFileExtension()}`;
      zip.file(mainFileName, currentCode);
      zip.file(
        'README.md',
        `# ${selectedType} visualization\n\n- Library: ${selectedLibrary}\n- Output: ${selectedOutputFormat}\n\nGenerated by https://www.drupaldata.dev\n`,
      );
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${baseName}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-4 space-y-6">
      <div className="bg-[#1e1e1e] rounded-lg border border-[#3e3e3e] overflow-hidden">
        <div className="bg-[#2d2d30] border-b border-[#3e3e3e] px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-3 h-3 bg-[#ff5f57] rounded-full" />
              <div className="w-3 h-3 bg-[#ffbd2e] rounded-full" />
              <div className="w-3 h-3 bg-[#28ca42] rounded-full" />
            </div>
            <span className="text-[#cccccc] text-sm font-mono ml-4">
              {getFileName()}.{getFileExtension()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onCopyShareLink}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#32516b] hover:bg-[#406582] text-white text-sm rounded transition-colors duration-200"
            >
              {shareCopied ? <Check size={14} /> : <Link2 size={14} />}
              {shareCopied ? 'Link Copied' : 'Copy Share Link'}
            </button>

            <button
              onClick={onCopy}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#0e639c] hover:bg-[#1177bb] text-white text-sm rounded transition-colors duration-200"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Copy to Clipboard'}
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-[#1e1e1e] border-r border-[#3e3e3e] flex flex-col text-[#858585] text-xs font-mono pt-2">
            {generatedCode.split('\n').map((_, index) => (
              <div key={index} className="px-2 text-right leading-5">
                {index + 1}
              </div>
            ))}
          </div>
          <textarea
            value={generatedCode}
            readOnly
            placeholder="Generated code will appear here..."
            className="w-full pl-16 pr-4 py-2 bg-[#1e1e1e] text-[#d4d4d4] font-mono text-sm leading-5 resize-none border-none outline-none min-h-[400px]"
            style={{ fontFamily: "'JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', monospace", tabSize: 2 }}
          />
        </div>
      </div>

      <div className="bg-[#1F2937]/20 dark:bg-[#1F2937]/20 bg-gray-50 rounded-lg p-6 border border-[#3E4C5E] dark:border-[#3E4C5E] border-gray-200">
        <h4 className="text-lg font-semibold text-[#E5F1FF] dark:text-[#E5F1FF] text-gray-900 mb-4">
          Download Options
        </h4>

        {downloadError ? (
          <div className="mb-4 flex items-start gap-2 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-700/50 dark:bg-red-900/20 dark:text-red-200">
            <AlertCircle size={16} className="mt-0.5" />
            <span>{downloadError}</span>
          </div>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={downloadSingleFile}
            className="flex items-center justify-center gap-3 px-6 py-4 bg-[#0074BD] dark:bg-[#0074BD] hover:bg-[#005a94] dark:hover:bg-[#005a94] text-white rounded-lg transition-colors duration-200 font-medium"
          >
            <FileText size={20} />
            <span>Download File</span>
          </button>

          <button
            onClick={() => {
              void downloadZipFile();
            }}
            className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-[#0074BD] to-[#00C9FF] hover:from-[#005a94] hover:to-[#00b8e6] text-white rounded-lg transition-all duration-200 font-medium"
          >
            <Archive size={20} />
            <span>Download ZIP Package</span>
          </button>
        </div>

        <div className="mt-4 text-sm text-[#E5F1FF]/70 dark:text-[#E5F1FF]/70 text-gray-600">
          <p><strong>Single File:</strong> Downloads a single generated artifact.</p>
          <p><strong>ZIP Package:</strong> Includes code + docs, and full Drupal scaffolding for Drupal outputs.</p>
        </div>
      </div>
    </div>
  );
};

interface DrupalScaffoldConfig {
  moduleName: string;
  generatedCode: string;
  selectedType: string;
  selectedSubtype: string;
  selectedLibrary: string;
  selectedOutputFormat: string;
}

function addDrupalScaffold(zip: JSZip, config: DrupalScaffoldConfig) {
  const {
    moduleName,
    generatedCode,
    selectedType,
    selectedSubtype,
    selectedLibrary,
    selectedOutputFormat,
  } = config;

  const className = generatedCode.match(/class\s+([A-Za-z0-9_]+)/)?.[1]
    ?? `${capitalize(selectedType)}${capitalize(selectedLibrary)}${selectedOutputFormat === 'drupal-block' ? 'Block' : 'Controller'}`;

  const containerId = `${moduleName}-${selectedType === 'map' ? 'map' : 'chart'}`;
  const packagePath = selectedOutputFormat === 'drupal-block'
    ? `src/Plugin/Block/${className}.php`
    : `src/Controller/${className}.php`;

  zip.file(packagePath, generatedCode);
  zip.file(`${moduleName}.info.yml`, generateInfoYml(moduleName, selectedType, selectedLibrary));
  zip.file(`${moduleName}.libraries.yml`, generateLibrariesYml(moduleName, selectedLibrary));
  zip.file(`${moduleName}.module`, generateModuleFile(moduleName));

  if (selectedOutputFormat === 'drupal-controller') {
    zip.file(`${moduleName}.routing.yml`, generateRoutingYml(moduleName, selectedType, className));
  }

  zip.file(`js/${moduleName}.js`, generateBehaviorJs(moduleName, containerId));
  zip.file(`css/${moduleName}.css`, generateCss(moduleName));
  zip.file(`templates/${moduleName}-container.html.twig`, generateTwigTemplate(containerId));
  zip.file(
    'README.md',
    generateDrupalReadme({ moduleName, selectedType, selectedSubtype, selectedLibrary, selectedOutputFormat, className }),
  );
}

function generateInfoYml(moduleName: string, selectedType: string, selectedLibrary: string): string {
  return `name: '${capitalize(selectedType)} Visualization (${selectedLibrary})'
type: module
description: 'Generated ${selectedType} visualization module using ${selectedLibrary}.'
core_version_requirement: ^9 || ^10 || ^11
package: 'Charts'
dependencies:
  - drupal:system
`;
}

function generateLibrariesYml(moduleName: string, library: string): string {
  const remoteMap: Record<string, string> = {
    chartjs: 'https://cdn.jsdelivr.net/npm/chart.js',
    d3: 'https://d3js.org/d3.v7.min.js',
    highcharts: 'https://code.highcharts.com/highcharts.js',
    echarts: 'https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js',
    openlayers: 'https://cdn.jsdelivr.net/npm/ol@7.4.0/dist/ol.js',
    leaflet: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  };

  const remote = remoteMap[library];

  return `${moduleName}.assets:
  version: 1.x
  css:
    theme:
      css/${moduleName}.css: {}
  js:
    ${remote}: { type: external, minified: true }
    js/${moduleName}.js: {}
  dependencies:
    - core/drupal
    - core/drupalSettings
    - core/once
`;
}

function generateRoutingYml(moduleName: string, selectedType: string, className: string): string {
  const isMap = selectedType === 'map';
  const pageMethod = isMap ? 'mapPage' : 'chartPage';

  return `${moduleName}.page:
  path: '/${moduleName}'
  defaults:
    _controller: 'Drupal\\${moduleName}\\Controller\\${className}::${pageMethod}'
    _title: '${capitalize(selectedType)} Visualization'
  requirements:
    _permission: 'access content'
`;
}

function generateModuleFile(moduleName: string): string {
  return `<?php

/**
 * @file
 * Hooks for the ${moduleName} module.
 */
`;
}

function generateBehaviorJs(moduleName: string, containerId: string): string {
  return `(function (Drupal, once) {
  'use strict';

  Drupal.behaviors.${moduleName}Behavior = {
    attach: function (context) {
      once('${moduleName}', '#${containerId}', context).forEach(function () {
        // Placeholder behavior for generated visualizations.
        // Extend this file with library-specific bootstrapping if needed.
      });
    }
  };
})(Drupal, once);
`;
}

function generateCss(moduleName: string): string {
  return `#${moduleName}-chart,
#${moduleName}-map {
  width: 100%;
  min-height: 360px;
}
`;
}

function generateTwigTemplate(containerId: string): string {
  return `<div id="${containerId}" class="generated-visualization-container"></div>
`;
}

interface DrupalReadmeConfig {
  moduleName: string;
  selectedType: string;
  selectedSubtype: string;
  selectedLibrary: string;
  selectedOutputFormat: string;
  className: string;
}

function generateDrupalReadme(config: DrupalReadmeConfig): string {
  const {
    moduleName,
    selectedType,
    selectedSubtype,
    selectedLibrary,
    selectedOutputFormat,
    className,
  } = config;

  return `# ${moduleName}

Generated by DrupalDataDotDev.

## Configuration
- Type: ${selectedType}
- Subtype: ${selectedSubtype || 'default'}
- Library: ${selectedLibrary}
- Output: ${selectedOutputFormat}

## Included files
- ${moduleName}.info.yml
- ${moduleName}.libraries.yml
- ${selectedOutputFormat === 'drupal-controller' ? `${moduleName}.routing.yml` : '(no routing file for block output)'}
- src/* (${className})
- templates/${moduleName}-container.html.twig
- js/${moduleName}.js
- css/${moduleName}.css

## Install
1. Copy this folder into your Drupal codebase under /modules/custom/${moduleName}
2. Enable the module: drush en ${moduleName}
3. For controller output, visit /${moduleName}; for block output, place the generated block in Layout Builder or Block Layout.
`;
}

function capitalize(value: string): string {
  if (!value) {
    return value;
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default CodeOutput;
