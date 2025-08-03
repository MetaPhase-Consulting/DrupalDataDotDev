import React from 'react';
import { BarChart3, PieChart, Radar, Map, Network, LineChart } from 'lucide-react';

const ChartTypes: React.FC = () => {
  const chartTypes = [
    {
      icon: BarChart3,
      title: 'Bar Charts',
      description: 'Perfect for comparing categories and showing data distributions with vertical or horizontal bars.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: LineChart,
      title: 'Line Charts',
      description: 'Ideal for displaying trends over time and continuous data relationships.',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: PieChart,
      title: 'Pie Charts',
      description: 'Great for showing proportions and percentages of a whole dataset.',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Radar,
      title: 'Radar Charts',
      description: 'Excellent for multi-dimensional data comparison and performance metrics.',
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: Map,
      title: 'Maps',
      description: 'Interactive geographical visualizations for location-based data analysis.',
      color: 'from-teal-500 to-teal-600'
    },
    {
      icon: Network,
      title: 'Network Graphs',
      description: 'Visualize relationships and connections between different data points.',
      color: 'from-red-500 to-red-600'
    }
  ];

  return (
    <section id="chart-types" className="py-20 bg-[#1F2937]/20 dark:bg-[#1F2937]/20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold font-['Inter','Segoe_UI',sans-serif] text-[#E5F1FF] dark:text-[#E5F1FF] text-gray-900 mb-4">
            Chart Types
          </h2>
          <p className="text-xl text-[#E5F1FF]/80 dark:text-[#E5F1FF]/80 text-gray-600 max-w-3xl mx-auto">
            Choose from a variety of visualization types to best represent your data
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {chartTypes.map((chart, index) => {
            const IconComponent = chart.icon;
            return (
              <div
                key={index}
                className="group bg-[#0E1B2A]/80 dark:bg-[#0E1B2A]/80 bg-white border border-[#3E4C5E] dark:border-[#3E4C5E] border-gray-200 rounded-xl p-6 hover:shadow-xl hover:shadow-[#0074BD]/10 dark:hover:shadow-[#0074BD]/10 hover:shadow-blue-500/10 transform hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${chart.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent size={32} className="text-white" />
                </div>
                
                <h3 className="text-xl font-semibold font-['Inter','Segoe_UI',sans-serif] text-[#E5F1FF] dark:text-[#E5F1FF] text-gray-900 mb-3">
                  {chart.title}
                </h3>
                
                <p className="text-[#E5F1FF]/80 dark:text-[#E5F1FF]/80 text-gray-600 leading-relaxed">
                  {chart.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ChartTypes;