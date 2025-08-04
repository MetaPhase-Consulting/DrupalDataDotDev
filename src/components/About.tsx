import React from 'react';
import { useNavigate } from 'react-router-dom';

const About: React.FC = () => {
  const navigate = useNavigate();


  return (
    <section id="about" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold font-['Inter','Segoe_UI',sans-serif] text-[#E5F1FF] dark:text-[#E5F1FF] text-gray-900 mb-6">
            Our Mission
          </h2>
          <p className="text-xl text-[#E5F1FF]/80 dark:text-[#E5F1FF]/80 text-gray-600 mb-6 leading-relaxed max-w-4xl mx-auto">
            DrupalDataDotDev was created to fill a gap in the Drupal ecosystem. We believe that creating beautiful, 
            interactive data visualizations shouldn't require expensive tools, complex AI services, or vendor lock-in.
          </p>
          <p className="text-xl text-[#E5F1FF]/80 dark:text-[#E5F1FF]/80 text-gray-600 mb-8 leading-relaxed max-w-4xl mx-auto">
            Our tool generates clean, production-ready code that you can customize, extend, and deploy without 
            dependencies on external services. It's built by the community, for the community.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate('/about')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-transparent border-2 border-[#0074BD] dark:border-[#00C9FF] text-[#0074BD] dark:text-[#00C9FF] font-semibold rounded-lg hover:bg-[#0074BD] hover:text-white dark:hover:bg-[#00C9FF] dark:hover:text-[#0E1B2A] transform hover:scale-105 transition-all duration-300"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;