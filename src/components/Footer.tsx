import React from 'react';
import { Github } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 dark:bg-[#0E1B2A] border-t border-gray-800 dark:border-[#1F2937] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="text-center md:text-left">
            <div className="text-2xl font-bold font-['Inter','Segoe_UI',sans-serif] mb-2">
              <span className="text-[#0074BD] dark:text-[#0074BD]">Drupal</span>
              <span className="text-[#003D5C] dark:text-[#B3D9FF]">Data</span>
              <span className="text-[#B3D9FF] dark:text-[#4A90C2]">Dot</span>
              <span className="text-[#00C9FF] dark:text-[#00C9FF]">Dev</span>
            </div>
            <p className="text-gray-400 dark:text-[#E5F1FF]/80 text-sm">
              Free, fast, Drupal data visualization generator
            </p>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-gray-400 dark:text-[#E5F1FF]/80 text-sm mb-4">
              <span className="inline-flex items-center gap-4">
                <a
                  href="https://github.com/username/DrupalDataDotDev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-gray-400 dark:text-[#E5F1FF]/80 hover:text-[#0074BD] dark:hover:text-[#00C9FF] hover:underline transition-colors duration-200"
                >
                  <Github size={16} />
                  Open Source
                </a>
                <span className="text-gray-400 dark:text-[#E5F1FF]/80">|</span>
                <span>
                  Built by{' '}
                  <a
                    href="https://www.metaphase.tech"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#FFA500] hover:text-[#FFB733] hover:underline transition-colors duration-200 font-semibold"
                  >
                    MetaPhase
                  </a>
                </span>
              </span>
            </p>
            <p className="text-gray-400 dark:text-[#E5F1FF]/80 text-sm">
              © 2025 DrupalDataDotDev
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;