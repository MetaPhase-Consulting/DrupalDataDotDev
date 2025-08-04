import React from 'react';
import { Heart, Users, Zap, Shield, Code, AlertTriangle, BookOpen } from 'lucide-react';

const About: React.FC = () => {
  const features = [
    {
      icon: Heart,
      title: 'Open Source',
      description: 'Free forever, community-driven development with full source code access'
    },
    {
      icon: Users,
      title: 'Developer Focused',
      description: 'Built by developers, for developers with clean, maintainable code output'
    },
    {
      icon: Zap,
      title: 'No Dependencies',
      description: 'No AI, no accounts, no subscriptions - just pure functionality'
    },
    {
      icon: Code,
      title: 'Production Ready',
      description: 'Generate clean, optimized code ready for immediate deployment'
    }
  ];

  const terms = [
    {
      icon: Shield,
      title: 'Open Source License',
      description: 'This project is provided under an open source license. You are free to use, modify, and distribute the code.'
    },
    {
      icon: AlertTriangle,
      title: 'No Warranty',
      description: 'This software is provided "as is" without warranty of any kind, express or implied. Use at your own risk.'
    },
    {
      icon: Users,
      title: 'User Responsibility',
      description: 'Users are responsible for ensuring compliance with all applicable licenses of visualization libraries they choose to use.'
    }
  ];

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="text-[#00C9FF] dark:text-[#00C9FF] text-cyan-500" size={40} />
            <h1 className="text-4xl font-bold font-['Inter','Segoe_UI',sans-serif] text-[#E5F1FF] dark:text-[#E5F1FF] text-gray-900">
              About
            </h1>
          </div>
          <p className="text-xl text-[#E5F1FF]/80 dark:text-[#E5F1FF]/80 text-gray-600 max-w-3xl mx-auto">
            Learn about our mission and the technology behind DrupalDataDotDev
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold font-['Inter','Segoe_UI',sans-serif] text-[#E5F1FF] dark:text-[#E5F1FF] text-gray-900 mb-6">
              Our Mission
            </h2>
            <p className="text-[#E5F1FF]/80 dark:text-[#E5F1FF]/80 text-gray-600 mb-6 leading-relaxed text-lg">
              DrupalDataDotDev was created to fill a gap in the Drupal ecosystem. We believe that creating beautiful, 
              interactive data visualizations shouldn't require expensive tools, complex AI services, or vendor lock-in.
            </p>
            <p className="text-[#E5F1FF]/80 dark:text-[#E5F1FF]/80 text-gray-600 mb-8 leading-relaxed text-lg">
              Our tool generates clean, production-ready code that you can customize, extend, and deploy without 
              dependencies on external services. It's built by the community, for the community.
            </p>
          </div>

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

        {/* Project Details */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold font-['Inter','Segoe_UI',sans-serif] text-[#E5F1FF] dark:text-[#E5F1FF] text-gray-900 mb-8 text-center">
            Project Details
          </h2>
          
          <div className="bg-[#0E1B2A]/80 dark:bg-[#0E1B2A]/80 bg-white border border-[#3E4C5E] dark:border-[#3E4C5E] border-gray-200 rounded-xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold font-['Inter','Segoe_UI',sans-serif] text-[#E5F1FF] dark:text-[#E5F1FF] text-gray-900 mb-4">
                  What We Support
                </h3>
                <ul className="space-y-2 text-[#E5F1FF]/80 dark:text-[#E5F1FF]/80 text-gray-600">
                  <li>• All major, modern open source visualization libraries</li>
                  <li>• CSV, JSON, and GeoJSON data formats</li>
                  <li>• Interactive charts, maps, and graphs</li>
                  <li>• Responsive design patterns</li>
                  <li>• Drupal 9+ compatibility</li>
                  <li>• Custom module generation</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold font-['Inter','Segoe_UI',sans-serif] text-[#E5F1FF] dark:text-[#E5F1FF] text-gray-900 mb-4">
                  How It Works
                </h3>
                <ul className="space-y-2 text-[#E5F1FF]/80 dark:text-[#E5F1FF]/80 text-gray-600">
                  <li>• Upload or paste your data</li>
                  <li>• Choose visualization type and library</li>
                  <li>• Customize styling and options</li>
                  <li>• Generate ready-to-use Drupal code</li>
                  <li>• Deploy directly to your site</li>
                  <li>• No external dependencies required</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Terms Section */}
        <div>
          <h2 className="text-3xl font-bold font-['Inter','Segoe_UI',sans-serif] text-[#E5F1FF] dark:text-[#E5F1FF] text-gray-900 mb-8 text-center">
            Terms & Conditions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {terms.map((term, index) => {
              const IconComponent = term.icon;
              return (
                <div key={index} className="bg-[#0E1B2A]/80 dark:bg-[#0E1B2A]/80 bg-white border border-[#3E4C5E] dark:border-[#3E4C5E] border-gray-200 rounded-xl p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#0074BD] to-[#00C9FF] dark:from-[#0074BD] dark:to-[#00C9FF] from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <IconComponent size={32} className="text-white" />
                  </div>
                  <h3 className="text-xl font-semibold font-['Inter','Segoe_UI',sans-serif] text-[#E5F1FF] dark:text-[#E5F1FF] text-gray-900 mb-3">
                    {term.title}
                  </h3>
                  <p className="text-[#E5F1FF]/80 dark:text-[#E5F1FF]/80 text-gray-600 leading-relaxed">
                    {term.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="bg-[#0E1B2A]/80 dark:bg-[#0E1B2A]/80 bg-white border border-[#3E4C5E] dark:border-[#3E4C5E] border-gray-200 rounded-xl p-8">
            <h3 className="text-2xl font-bold font-['Inter','Segoe_UI',sans-serif] text-[#E5F1FF] dark:text-[#E5F1FF] text-gray-900 mb-4 text-center">
              Important Notice
            </h3>
            <p className="text-[#E5F1FF]/80 dark:text-[#E5F1FF]/80 text-gray-600 leading-relaxed text-center max-w-4xl mx-auto">
              By using DrupalDataDotDev, you acknowledge that this is open source software provided free of charge. 
              While we strive for quality and reliability, users assume full responsibility for testing, validation, 
              and compliance with all applicable software licenses. We recommend reviewing the licenses of any 
              visualization libraries you choose to implement in your projects.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;