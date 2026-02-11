import React from 'react';

interface VisualizationType {
  type: string;
  label: string;
  description: string;
  subtypes: { id: string; label: string }[];
  options: Record<string, unknown>;
}

interface VisualizationOptionsProps {
  selectedType: string;
  selectedSubtype: string;
  selectedOptions: Record<string, unknown>;
  visualizationTypes: VisualizationType[];
  onSubtypeSelect: (subtype: string) => void;
  onOptionChange: (optionKey: string, value: unknown) => void;
}

interface RangeOption {
  min: number;
  max: number;
  step?: number;
}

const isRangeOption = (value: unknown): value is RangeOption => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }

  return 'min' in value && 'max' in value;
};

const VisualizationOptions: React.FC<VisualizationOptionsProps> = ({
  selectedType,
  selectedSubtype,
  selectedOptions,
  visualizationTypes,
  onSubtypeSelect,
  onOptionChange
}) => {
  const currentVisualization = visualizationTypes.find(v => v.type === selectedType);

  if (!selectedType || !currentVisualization) {
    return (
      <div className="mt-4 p-6 bg-[#1F2937]/20 dark:bg-[#1F2937]/20 bg-gray-50 rounded-lg border-2 border-dashed border-[#3E4C5E] dark:border-[#3E4C5E] border-gray-300 text-center">
        <p className="text-[#E5F1FF]/60 dark:text-[#E5F1FF]/60 text-gray-500">
          Select a visualization type to show available options
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-6">
      {/* Subtypes */}
      <div>
        <h4 className="text-lg font-semibold text-[#E5F1FF] dark:text-[#E5F1FF] text-gray-900 mb-3">
          Visualization Subtypes
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {currentVisualization.subtypes.map((subtype) => {
            const isSelected = selectedSubtype === subtype.id;
            
            return (
              <button
                key={subtype.id}
                onClick={() => onSubtypeSelect(subtype.id)}
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
          {Object.entries(currentVisualization.options || {}).map(([optionKey, optionValue]) => (
            <div key={optionKey} className="space-y-2">
              <label className="block text-sm font-medium text-[#E5F1FF] dark:text-[#E5F1FF] text-gray-700 capitalize">
                {optionKey.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              
              {Array.isArray(optionValue) ? (
                <select
                  value={selectedOptions[optionKey] || ''}
                  onChange={(e) => onOptionChange(optionKey, e.target.value)}
                  className="w-full p-2 bg-[#0E1B2A] dark:bg-[#0E1B2A] bg-white border border-[#3E4C5E] dark:border-[#3E4C5E] border-gray-300 rounded-lg text-[#E5F1FF] dark:text-[#E5F1FF] text-gray-900 text-sm focus:border-[#0074BD] dark:focus:border-[#00C9FF] focus:outline-none"
                >
                  <option value="">Select {optionKey}...</option>
                  {(optionValue as unknown[]).map((value) => (
                    <option key={String(value)} value={String(value)}>
                      {String(value)}
                    </option>
                  ))}
                </select>
              ) : isRangeOption(optionValue) ? (
                <div className="space-y-1">
                  <input
                    type="range"
                    min={optionValue.min}
                    max={optionValue.max}
                    step={optionValue.step || 1}
                    value={selectedOptions[optionKey] || optionValue.min}
                    onChange={(e) => onOptionChange(optionKey, Number(e.target.value))}
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
    </div>
  );
};

export default VisualizationOptions; 
