import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Moon, Sun, Sparkles, BookOpen } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();

  const navItems = [
    { id: 'generator', label: 'Generator', path: '/generator', icon: Sparkles },
    { id: 'about', label: 'About', path: '/about', icon: BookOpen },
  ];

  const handleNavigation = (item: { id: string; path: string }) => {
    if (item.id === 'generator') {
      navigate('/generator');
    } else if (item.id === 'about') {
      navigate('/about');
    }
    setIsOpen(false);
  };

  const getActiveState = (itemId: string) => {
    if (itemId === 'generator') {
      return location.pathname === '/generator';
    } else if (itemId === 'about') {
      return location.pathname === '/about';
    }
    return false;
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-[#0E1B2A]/95 backdrop-blur-sm border-b border-[#1F2937] dark:bg-[#0E1B2A]/95 bg-white/95 dark:border-[#1F2937] border-gray-200 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Left side */}
          <div className="flex items-center">
            <button
              onClick={() => navigate('/')}
              className="text-xl font-bold font-['Inter','Segoe_UI',sans-serif] hover:opacity-80 transition-opacity duration-200"
            >
              <span className="text-[#0074BD] dark:text-[#0074BD]">Drupal</span>
              <span className="text-[#003D5C] dark:text-[#B3D9FF]">Data</span>
              <span className="text-[#B3D9FF] dark:text-[#4A90C2]">Dot</span>
              <span className="text-[#00C9FF] dark:text-[#00C9FF]">Dev</span>
            </button>
          </div>

          {/* Navigation and Controls - Right side */}
          <div className="flex items-center space-x-4">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item)}
                  className={`px-3 py-2 rounded-md text-lg font-medium transition-colors duration-200 ${
                    getActiveState(item.id)
                      ? 'text-[#0074BD] bg-blue-100 dark:text-[#00C9FF] dark:bg-[#1F2937]'
                      : 'text-gray-700 hover:text-[#0074BD] dark:text-[#E5F1FF] dark:hover:text-[#00C9FF]'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <item.icon size={18} />
                    {item.label}
                  </span>
                </button>
              ))}
            </nav>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-gray-700 hover:text-[#0074BD] hover:bg-gray-100 dark:text-[#E5F1FF] dark:hover:text-[#00C9FF] dark:hover:bg-[#1F2937] transition-colors duration-200"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-[#0074BD] hover:bg-gray-100 dark:text-[#E5F1FF] dark:hover:text-[#00C9FF] dark:hover:bg-[#1F2937] transition-colors duration-200"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-[#1F2937] dark:border-[#1F2937] border-gray-200">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item)}
                  className={`block w-full text-left px-3 py-2 rounded-md text-lg font-medium transition-colors duration-200 ${
                    getActiveState(item.id)
                      ? 'text-[#0074BD] bg-blue-100 dark:text-[#00C9FF] dark:bg-[#1F2937]'
                      : 'text-gray-700 hover:text-[#0074BD] hover:bg-gray-100 dark:text-[#E5F1FF] dark:hover:text-[#00C9FF] dark:hover:bg-[#1F2937]'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <item.icon size={18} />
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;