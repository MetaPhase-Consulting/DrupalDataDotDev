import React from 'react';
import { BarChart3, LineChart, PieChart, Radar, ScatterChart as Scatter, Map } from 'lucide-react';

interface VisualizationType {
  type: string;
  label: string;
  description: string;
  subtypes: { id: string; label: string }[];
  options: Record<string, any>;
}

interface VisualizationTypeSelectorProps {
  visualizationTypes: VisualizationType[];
  selectedType: string;
  onTypeSelect: (type: string) => void;
}

const VisualizationTypeSelector: React.FC<VisualizationTypeSelectorProps> = ({
  visualizationTypes,
  selectedType,
  onTypeSelect
}) => {
  const getIconForVisualizationType = (type: string) => {
    const iconMap: Record<string, any> = {
      bar: BarChart3,
      line: LineChart,
      pie: PieChart,
      radar: Radar,
      scatter: Scatter,
      map: Map,
      statistical: BarChart3,
      timeline: BarChart3,
      hierarchical: PieChart
    };
    return iconMap[type] || BarChart3;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {visualizationTypes.map((visualization) => {
        const IconComponent = getIconForVisualizationType(visualization.type);
        const isSelected = selectedType === visualization.type;
        
        return (
          <button
            key={visualization.type}
            onClick={() => {
              // Only allow selection of different types, prevent deselection
              if (selectedType !== visualization.type) {
                onTypeSelect(visualization.type);
              }
            }}
            className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
              isSelected
                ? 'border-[#0074BD] bg-[#0074BD]/10 dark:border-[#00C9FF] dark:bg-[#00C9FF]/10'
                : 'border-[#3E4C5E] hover:border-[#0074BD]/50 dark:border-[#3E4C5E] dark:hover:border-[#00C9FF]/50'
            } ${isSelected ? 'cursor-default' : 'cursor-pointer'}`}
          >
            <div className="flex items-center gap-3 mb-2">
              <IconComponent 
                size={24} 
                className={isSelected ? 'text-[#0074BD] dark:text-[#00C9FF]' : 'text-[#E5F1FF]/80 dark:text-[#E5F1FF]/80'} 
              />
              <h4 className="font-semibold text-[#E5F1FF] dark:text-[#E5F1FF] text-gray-900">
                {visualization.label}
              </h4>
            </div>
            <p className="text-sm text-[#E5F1FF]/70 dark:text-[#E5F1FF]/70 text-gray-600">
              {visualization.description}
            </p>
          </button>
        );
      })}
    </div>
  );
};

export default VisualizationTypeSelector; 