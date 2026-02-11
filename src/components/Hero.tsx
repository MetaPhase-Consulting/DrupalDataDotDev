import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Code, Database, Zap } from 'lucide-react';

const Hero: React.FC = () => {
  const navigate = useNavigate();

  const goToGenerator = () => {
    navigate('/generator');
  };

  return (
    <section id="home" className="py-20 min-h-screen flex items-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0074BD]/10 to-[#00C9FF]/5 dark:from-[#0074BD]/10 dark:to-[#00C9FF]/5 from-blue-600/5 to-cyan-500/5"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold font-['Inter','Segoe_UI',sans-serif] mb-6">
            <span className="text-[#005a94] dark:text-[#66C2FF]">Drupal</span>
            <span className="text-[#003D5C] dark:text-[#CFE8FF]">Data</span>
            <span className="text-[#0F4F74] dark:text-[#8CCCF2]">Dot</span>
            <span className="text-[#00507F] dark:text-[#00C9FF]">Dev</span>
          </h1>
          
          <p className="text-xl text-gray-700 dark:text-[#E5F1FF] mb-8 max-w-3xl mx-auto">
            Free, fast, Drupal data visualization generator
          </p>
          
          <p className="text-lg text-gray-700 dark:text-[#E5F1FF] mb-8 max-w-3xl mx-auto">
            Generate embeddable chart code for Drupal from JSON, CSV, or manual input.
            Supports all major, modern open source visualization libraries.
          </p>

          <button
            onClick={goToGenerator}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#0074BD] to-[#00C9FF] dark:from-[#0074BD] dark:to-[#00C9FF] from-blue-600 to-cyan-500 text-white text-xl font-semibold rounded-lg hover:shadow-lg hover:shadow-[#0074BD]/25 dark:hover:shadow-[#0074BD]/25 hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300 mb-8"
          >
            Start Generating
            <ArrowRight size={20} />
          </button>

          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#1F2937]/50 dark:bg-[#1F2937]/50 bg-gray-100 rounded-full">
              <Code size={16} className="text-[#00C9FF] dark:text-[#00C9FF] text-cyan-500" />
              <span className="text-sm text-gray-700 dark:text-[#E5F1FF]">Open Source</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-[#1F2937]/50 dark:bg-[#1F2937]/50 bg-gray-100 rounded-full">
              <Database size={16} className="text-[#00C9FF] dark:text-[#00C9FF] text-cyan-500" />
              <span className="text-sm text-gray-700 dark:text-[#E5F1FF]">No Login Required</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-[#1F2937]/50 dark:bg-[#1F2937]/50 bg-gray-100 rounded-full">
              <Zap size={16} className="text-[#00C9FF] dark:text-[#00C9FF] text-cyan-500" />
              <span className="text-sm text-gray-700 dark:text-[#E5F1FF]">Lightning Fast</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
