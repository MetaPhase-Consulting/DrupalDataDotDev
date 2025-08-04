import React from 'react';
import { BookOpen, Shield } from 'lucide-react';

const License: React.FC = () => {
  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="text-[#00C9FF] dark:text-[#00C9FF] text-cyan-500" size={40} />
            <h1 className="text-4xl font-bold font-['Inter','Segoe_UI',sans-serif] text-[#E5F1FF] dark:text-[#E5F1FF] text-gray-900">
              License
            </h1>
          </div>
          <p className="text-xl text-[#E5F1FF]/80 dark:text-[#E5F1FF]/80 text-gray-600 max-w-3xl mx-auto">
            DrupalDataDotDev is released under the MIT License
          </p>
        </div>

        {/* License Content */}
        <div className="bg-[#0E1B2A]/80 dark:bg-[#0E1B2A]/80 bg-white border border-[#3E4C5E] dark:border-[#3E4C5E] border-gray-200 rounded-xl p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold font-['Inter','Segoe_UI',sans-serif] text-[#E5F1FF] dark:text-[#E5F1FF] text-gray-900 mb-4">
              MIT License
            </h2>
            <p className="text-[#E5F1FF]/80 dark:text-[#E5F1FF]/80 text-gray-600 mb-6">
              Copyright (c) 2025 MetaPhase Consulting LLC
            </p>
          </div>

          <div className="space-y-6 text-[#E5F1FF]/80 dark:text-[#E5F1FF]/80 text-gray-600 leading-relaxed">
            <p>
              Permission is hereby granted, free of charge, to any person obtaining a copy
              of this software and associated documentation files (the "Software"), to deal
              in the Software without restriction, including without limitation the rights
              to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
              copies of the Software, and to permit persons to whom the Software is
              furnished to do so, subject to the following conditions:
            </p>

            <p>
              The above copyright notice and this permission notice shall be included in all
              copies or substantial portions of the Software.
            </p>

            <p>
              THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
              IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
              FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
              AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
              LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
              OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
              SOFTWARE.
            </p>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-12 text-center">
          <div className="bg-[#0E1B2A]/50 dark:bg-[#0E1B2A]/50 bg-gray-50 border border-[#3E4C5E] dark:border-[#3E4C5E] border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <BookOpen className="text-[#00C9FF] dark:text-[#00C9FF] text-cyan-500" size={24} />
              <h3 className="text-xl font-semibold font-['Inter','Segoe_UI',sans-serif] text-[#E5F1FF] dark:text-[#E5F1FF] text-gray-900">
                What This Means
              </h3>
            </div>
            <p className="text-[#E5F1FF]/80 dark:text-[#E5F1FF]/80 text-gray-600 max-w-2xl mx-auto">
              The MIT License is one of the most permissive open source licenses available. 
              It allows you to use, modify, and distribute DrupalDataDotDev freely, even for 
              commercial purposes, with very few restrictions. The only requirement is that 
              you include the original copyright notice and license text in any copies you distribute.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default License; 