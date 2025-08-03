import React from 'react';
import { Upload, Settings, Code2, Sparkles } from 'lucide-react';

const Generate: React.FC = () => {
  const steps = [
    {
      icon: Upload,
      title: 'Upload Data',
      description: 'Import your CSV, JSON, or paste data directly'
    },
    {
      icon: Settings,
      title: 'Configure Chart',
      description: 'Choose chart type, library, and styling options'
    },
    {
      icon: Code2,
      title: 'Generate Code',
      description: 'Get ready-to-use Drupal module or PHP block code'
    }
  ];

  return (
    <section id="generate" className="py-20 bg-[#1F2937]/20 dark:bg-[#1F2937]/20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="text-[#00C9FF] dark:text-[#00C9FF] text-cyan-500" size={32} />
            <h2 className="text-4xl font-bold font-['Inter','Segoe_UI',sans-serif] text-[#E5F1FF] dark:text-[#E5F1FF] text-gray-900">
              Generator
            </h2>
          </div>
          <p className="text-xl text-[#E5F1FF]/80 dark:text-[#E5F1FF]/80 text-gray-600 max-w-3xl mx-auto mb-8">
            Transform your data into beautiful Drupal visualizations in three simple steps
          </p>
          
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#0074BD]/20 to-[#00C9FF]/20 dark:from-[#0074BD]/20 dark:to-[#00C9FF]/20 from-blue-600/10 to-cyan-500/10 border border-[#0074BD]/30 dark:border-[#0074BD]/30 border-blue-300 rounded-full text-[#00C9FF] dark:text-[#00C9FF] text-blue-600 text-lg font-semibold">
            <Sparkles size={20} />
            Coming Soon
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-[#0074BD] to-[#00C9FF] dark:from-[#0074BD] dark:to-[#00C9FF] from-blue-600 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <IconComponent size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold font-['Inter','Segoe_UI',sans-serif] text-[#E5F1FF] dark:text-[#E5F1FF] text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-[#E5F1FF]/80 dark:text-[#E5F1FF]/80 text-gray-600">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Generate;