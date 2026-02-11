import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-[#0E1B2A] border-t border-gray-200 dark:border-[#1F2937] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="text-center md:text-left">
            <div className="text-2xl font-bold font-['Inter','Segoe_UI',sans-serif] mb-2">
              <span className="text-[#005a94] dark:text-[#66C2FF]">Drupal</span>
              <span className="text-[#003D5C] dark:text-[#CFE8FF]">Data</span>
              <span className="text-[#0F4F74] dark:text-[#8CCCF2]">Dot</span>
              <span className="text-[#00507F] dark:text-[#00C9FF]">Dev</span>
            </div>
            <p className="text-gray-600 dark:text-[#E5F1FF]/80 text-sm">
              Free, fast, Drupal data visualization generator
            </p>
          </div>

          <div className="text-center md:text-right">
            <p className="text-gray-600 dark:text-[#E5F1FF]/80 text-sm mb-4">
              <span className="inline-flex items-center gap-4">
                <a
                  href="https://github.com/MetaPhase-Consulting/DrupalDataDotDev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-gray-600 dark:text-[#E5F1FF]/80 hover:text-[#0074BD] dark:hover:text-[#00C9FF] hover:underline transition-colors duration-200"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-label="GitHub" role="img">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                  Open Source
                </a>
                <span className="text-gray-600 dark:text-[#E5F1FF]/80">|</span>
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
            <p className="text-gray-600 dark:text-[#E5F1FF]/80 text-sm">© {currentYear} DrupalDataDotDev</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
