import React from 'react';
import { Sparkles, Upload, Settings, Code2 } from 'lucide-react';

const Generator: React.FC = () => {
  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="text-[#00C9FF] dark:text-[#00C9FF] text-cyan-500" size={48} />
            <h1 className="text-5xl font-bold font-['Inter','Segoe_UI',sans-serif] text-[#E5F1FF] dark:text-[#E5F1FF] text-gray-900">
              Generator
            </h1>
          </div>
          <p className="text-2xl text-[#E5F1FF]/80 dark:text-[#E5F1FF]/80 text-gray-600 max-w-3xl mx-auto mb-8">
            Transform your data into beautiful Drupal visualizations
          </p>
          
          <div className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#0074BD]/20 to-[#00C9FF]/20 dark:from-[#0074BD]/20 dark:to-[#00C9FF]/20 from-blue-600/10 to-cyan-500/10 border border-[#0074BD]/30 dark:border-[#0074BD]/30 border-blue-300 rounded-full text-[#00C9FF] dark:text-[#00C9FF] text-blue-600 text-2xl font-semibold">
            <Sparkles size={24} />
            Coming Soon
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-[#0074BD] to-[#00C9FF] dark:from-[#0074BD] dark:to-[#00C9FF] from-blue-600 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6 opacity-50">
              <Upload size={40} className="text-white" />
            </div>
            <h3 className="text-2xl font-semibold font-['Inter','Segoe_UI',sans-serif] text-[#E5F1FF] dark:text-[#E5F1FF] text-gray-900 mb-3">
              Upload Data
            </h3>
            <p className="text-[#E5F1FF]/80 dark:text-[#E5F1FF]/80 text-gray-600 text-lg">
              Import your CSV, JSON, or paste data directly
            </p>
          </div>

          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-[#0074BD] to-[#00C9FF] dark:from-[#0074BD] dark:to-[#00C9FF] from-blue-600 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6 opacity-50">
              <Settings size={40} className="text-white" />
            </div>
            <h3 className="text-2xl font-semibold font-['Inter','Segoe_UI',sans-serif] text-[#E5F1FF] dark:text-[#E5F1FF] text-gray-900 mb-3">
              Configure Chart
            </h3>
            <p className="text-[#E5F1FF]/80 dark:text-[#E5F1FF]/80 text-gray-600 text-lg">
              Choose chart type, library, and styling options
            </p>
          </div>

          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-[#0074BD] to-[#00C9FF] dark:from-[#0074BD] dark:to-[#00C9FF] from-blue-600 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6 opacity-50">
              <Code2 size={40} className="text-white" />
            </div>
            <h3 className="text-2xl font-semibold font-['Inter','Segoe_UI',sans-serif] text-[#E5F1FF] dark:text-[#E5F1FF] text-gray-900 mb-3">
              Generate Code
            </h3>
            <p className="text-[#E5F1FF]/80 dark:text-[#E5F1FF]/80 text-gray-600 text-lg">
              Get ready-to-use Drupal module or PHP block code
            </p>
          </div>
        </div>

        <div className="text-center">
          <div className="bg-[#0E1B2A]/80 dark:bg-[#0E1B2A]/80 bg-white border border-[#3E4C5E] dark:border-[#3E4C5E] border-gray-200 rounded-xl p-12 max-w-2xl mx-auto">
            <Sparkles className="text-[#00C9FF] dark:text-[#00C9FF] text-cyan-500 mx-auto mb-6" size={64} />
            <h2 className="text-3xl font-bold font-['Inter','Segoe_UI',sans-serif] text-[#E5F1FF] dark:text-[#E5F1FF] text-gray-900 mb-4">
              Generator Coming Soon
            </h2>
            <p className="text-[#E5F1FF]/80 dark:text-[#E5F1FF]/80 text-gray-600 text-lg leading-relaxed">
              We're working hard to bring you the most intuitive data visualization generator for Drupal. 
              Stay tuned for updates on our progress!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Generator;