import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, FileText, MapPin, TrendingUp } from 'lucide-react';

const SampleData: React.FC = () => {
  const navigate = useNavigate();

  const sampleFiles = [
    {
      icon: TrendingUp,
      title: 'sample-bar.json',
      description: 'Generic categorical data with values for comparison',
      type: 'JSON',
      size: '0.2 KB'
    },
    {
      icon: FileText,
      title: 'sample-pie.json',
      description: 'Proportional data segments for part-to-whole visualization',
      type: 'JSON',
      size: '0.2 KB'
    },
    {
      icon: MapPin,
      title: 'sample-map.json',
      description: 'Geographic coordinate data with lat/lng points',
      type: 'JSON',
      size: '0.4 KB'
    }
  ];

  const handlePreview = (filename: string) => {
    navigate('/generator');
  };

  return (
    <section id="sample-data" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold font-['Inter','Segoe_UI',sans-serif] text-[#E5F1FF] dark:text-[#E5F1FF] text-gray-900 mb-4">
            Sample Data
          </h2>
          <p className="text-xl text-[#E5F1FF]/80 dark:text-[#E5F1FF]/80 text-gray-600 max-w-3xl mx-auto">
            Get started quickly with our curated sample datasets
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {sampleFiles.map((file, index) => {
            const IconComponent = file.icon;
            return (
              <div
                key={index}
                className="bg-[#0E1B2A]/80 dark:bg-[#0E1B2A]/80 bg-white border border-[#3E4C5E] dark:border-[#3E4C5E] border-gray-200 rounded-xl p-6 hover:shadow-xl hover:shadow-[#0074BD]/10 dark:hover:shadow-[#0074BD]/10 hover:shadow-blue-500/10 transform hover:scale-105 transition-all duration-300 flex flex-col h-full"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#0074BD] to-[#00C9FF] dark:from-[#0074BD] dark:to-[#00C9FF] from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center mr-4">
                    <IconComponent size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold font-['Inter','Segoe_UI',sans-serif] text-[#E5F1FF] dark:text-[#E5F1FF] text-gray-900">
                      {file.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-[#E5F1FF]/60 dark:text-[#E5F1FF]/60 text-gray-500">
                      <span>{file.type}</span>
                      <span>•</span>
                      <span>{file.size}</span>
                    </div>
                  </div>
                </div>

                <p className="text-[#E5F1FF]/80 dark:text-[#E5F1FF]/80 text-gray-600 mb-4 leading-relaxed flex-grow">
                  {file.description}
                </p>

                <div className="mb-4">
                </div>

                <div className="flex justify-center mt-auto">
                  <button
                    onClick={() => handlePreview(file.title)}
                    className="flex items-center justify-center gap-2 px-6 py-2 bg-gradient-to-r from-[#0074BD] to-[#00C9FF] dark:from-[#0074BD] dark:to-[#00C9FF] from-blue-600 to-cyan-500 text-white rounded-lg hover:shadow-lg hover:shadow-[#0074BD]/25 dark:hover:shadow-[#0074BD]/25 hover:shadow-blue-500/25 transition-all duration-200"
                  >
                    <Eye size={16} />
                    Preview
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SampleData;