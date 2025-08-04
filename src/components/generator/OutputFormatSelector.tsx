import React from 'react';

interface OutputFormat {
  id: string;
  name: string;
  description: string;
}

interface OutputFormatSelectorProps {
  outputFormats: OutputFormat[];
  selectedFormat: string;
  onFormatSelect: (format: string) => void;
}

const OutputFormatSelector: React.FC<OutputFormatSelectorProps> = ({
  outputFormats,
  selectedFormat,
  onFormatSelect
}) => {
  return (
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
            checked={selectedFormat === format.id}
            onChange={(e) => onFormatSelect(e.target.value)}
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
  );
};

export default OutputFormatSelector; 