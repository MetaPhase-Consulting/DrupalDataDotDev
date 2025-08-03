import React from 'react';
import { Github, Heart, Users, Zap } from 'lucide-react';

const About: React.FC = () => {
  const features = [
    {
      icon: Heart,
      title: 'Open Source',
      description: 'Free forever, community-driven development'
    },
    {
      icon: Users,
      title: 'Developer Focused',
      description: 'Built by developers, for developers'
    },
    {
      icon: Zap,
      title: 'No Dependencies',
      description: 'No AI, no accounts, no subscriptions needed'
    }
  ];

  return (
    <section id="about" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold font-['Inter','Segoe_UI',sans-serif] text-[#E5F1FF] dark:text-[#E5F1FF] text-gray-900 mb-4">
            About the Project
          </h2>
          <p className="text-xl text-[#E5F1FF]/80 dark:text-[#E5F1FF]/80 text-gray-600 max-w-3xl mx-auto">
            Empowering Drupal developers with simple, powerful data visualization tools
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="grid grid-cols-1 gap-6">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#0074BD] to-[#00C9FF] dark:from-[#0074BD] dark:to-[#00C9FF] from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <IconComponent size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold font-['Inter','Segoe_UI',sans-serif] text-[#E5F1FF] dark:text-[#E5F1FF] text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-[#E5F1FF]/80 dark:text-[#E5F1FF]/80 text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-[#0E1B2A]/80 dark:bg-[#0E1B2A]/80 bg-white border border-[#3E4C5E] dark:border-[#3E4C5E] border-gray-200 rounded-xl p-8">
            <h3 className="text-2xl font-bold font-['Inter','Segoe_UI',sans-serif] text-[#E5F1FF] dark:text-[#E5F1FF] text-gray-900 mb-6">
              Our Mission
            </h3>
            <p className="text-[#E5F1FF]/80 dark:text-[#E5F1FF]/80 text-gray-600 mb-6 leading-relaxed">
              DrupalDataDotDev was created to fill a gap in the Drupal ecosystem. We believe that creating beautiful, 
              interactive data visualizations shouldn't require expensive tools, complex AI services, or vendor lock-in.
            </p>
            <p className="text-[#E5F1FF]/80 dark:text-[#E5F1FF]/80 text-gray-600 mb-8 leading-relaxed">
              Our tool generates clean, production-ready code that you can customize, extend, and deploy without 
              dependencies on external services. It's built by the community, for the community.
            </p>
            
            <a
              href="https://github.com/username/DrupalDataDotDev"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#0074BD] to-[#00C9FF] dark:from-[#0074BD] dark:to-[#00C9FF] from-blue-600 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-[#0074BD]/25 dark:hover:shadow-[#0074BD]/25 hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300"
            >
              <Github size={20} />
              View on GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;