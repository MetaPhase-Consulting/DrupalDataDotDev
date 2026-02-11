import React from 'react';
import { BarChart3, TrendingUp, PieChart, Zap, ScatterChart, Map } from 'lucide-react';

interface VisualizationType {
  type: string;
  label: string;
  description: string;
  subtypes: Array<{
    id: string;
    label: string;
  }>;
}

interface VisualizationTypeSelectorProps {
  visualizationTypes: VisualizationType[];
  selectedType: string;
  onTypeSelect: (type: string) => void;
}

type IconComponent = React.ComponentType<{ size?: number; className?: string }>;

const VisualizationTypeSelector: React.FC<VisualizationTypeSelectorProps> = ({
  visualizationTypes,
  selectedType,
  onTypeSelect
}) => {
  const iconMap: Record<string, IconComponent> = {
    bar: BarChart3,
    line: TrendingUp,
    pie: PieChart,
    radar: Zap,
    scatter: ScatterChart,
    map: Map
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {visualizationTypes.map((type) => {
        const Icon = iconMap[type.type] || BarChart3;
        
        return (
          <button
            key={type.type}
            onClick={() => onTypeSelect(type.type)}
            className={`p-4 rounded-lg border-2 transition-all duration-200 ${
              selectedType === type.type
                ? 'border-[#0074BD] bg-[#0074BD]/10 dark:bg-[#0074BD]/20'
                : 'border-[#3E4C5E] dark:border-[#3E4C5E] hover:border-[#0074BD] dark:hover:border-[#0074BD]'
            }`}
          >
            <div className="flex items-center gap-3">
              <Icon className="text-[#0074BD] dark:text-[#0074BD]" size={24} />
              <div className="text-left">
                <h3 className="font-semibold text-[#E5F1FF] dark:text-[#E5F1FF]">
                  {type.label}
                </h3>
                <p className="text-sm text-[#E5F1FF]/70 dark:text-[#E5F1FF]/70">
                  {type.description}
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default VisualizationTypeSelector; 
