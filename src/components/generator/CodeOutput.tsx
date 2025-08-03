import React from 'react';
import { Copy, Download, Check } from 'lucide-react';

interface CodeOutputProps {
  generatedCode: string;
  copied: boolean;
  selectedType: string;
  selectedOutputFormat: string;
  onCopy: () => void;
  onDownload: () => void;
}

const CodeOutput: React.FC<CodeOutputProps> = ({
  generatedCode,
  copied,
  selectedType,
  selectedOutputFormat,
  onCopy,
  onDownload
}) => {
  return (
    <div className="mt-4 space-y-6">
      {/* Code Output */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-[#E5F1FF] dark:text-[#E5F1FF] text-gray-900">
            Generated Code
          </h4>
        </div>
        
        <textarea
          value={generatedCode}
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
            onClick={onCopy}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-[#0074BD] dark:bg-[#00C9FF] text-white rounded-lg hover:opacity-90 transition-opacity duration-200"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied!' : 'Copy Code'}
          </button>
          
          <button 
            onClick={onDownload}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-[#1F2937] dark:bg-[#1F2937] bg-gray-600 text-white rounded-lg hover:opacity-90 transition-opacity duration-200"
          >
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
  );
};

export default CodeOutput; 