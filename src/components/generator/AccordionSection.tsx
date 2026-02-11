import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface AccordionSectionProps {
  id: string;
  title: string;
  isActive: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const AccordionSection: React.FC<AccordionSectionProps> = ({
  id,
  title,
  isActive,
  onToggle,
  children
}) => {
  return (
    <div className="border border-[#3E4C5E] dark:border-[#3E4C5E] border-gray-200 rounded-lg mb-4">
      <button
        onClick={onToggle}
        aria-controls={`${id}-panel`}
        aria-expanded={isActive}
        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-[#1F2937]/20 dark:hover:bg-[#1F2937]/20 hover:bg-gray-50 transition-colors duration-200"
      >
        <h2 className="text-xl font-semibold font-['Inter','Segoe_UI',sans-serif] text-gray-900 dark:text-[#E5F1FF]">
          {title}
        </h2>
        {isActive ? (
          <ChevronDown className="text-[#00C9FF] dark:text-[#00C9FF] text-blue-600" size={20} />
        ) : (
          <ChevronRight className="text-[#E5F1FF]/60 dark:text-[#E5F1FF]/60 text-gray-400" size={20} />
        )}
      </button>
      {isActive && (
        <div id={`${id}-panel`} className="px-6 pt-6 pb-6 border-t border-[#3E4C5E] dark:border-[#3E4C5E] border-gray-200">
          {children}
        </div>
      )}
    </div>
  );
};

export default AccordionSection; 
