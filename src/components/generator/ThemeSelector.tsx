import React from 'react';

interface Theme {
  id: string;
  name: string;
  description: string;
  mood: string;
  fonts: string[];
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
  };
  palette: string[];
}

interface ThemeSelectorProps {
  themes: Theme[];
  selectedTheme: string;
  onThemeSelect: (theme: string) => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  themes,
  selectedTheme,
  onThemeSelect
}) => {
  return (
    <div className="mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {themes.map((theme) => {
          const isSelected = selectedTheme === theme.id;
          
          return (
            <button
              key={theme.id}
              onClick={() => onThemeSelect(theme.id)}
              className={`p-5 rounded-lg border-2 text-left transition-all duration-200 ${
                isSelected
                  ? 'border-[#0074BD] bg-[#0074BD]/10 dark:border-[#00C9FF] dark:bg-[#00C9FF]/10'
                  : 'border-[#3E4C5E] hover:border-[#0074BD]/50 dark:border-[#3E4C5E] dark:hover:border-[#00C9FF]/50'
              }`}
            >
              <h4 className="font-bold text-[#E5F1FF] dark:text-[#E5F1FF] text-gray-900 mb-2">
                {theme.name}
              </h4>
              <p className="text-sm text-[#E5F1FF]/80 dark:text-[#E5F1FF]/80 text-gray-600 mb-2">
                {theme.description}
              </p>
              <p className="text-xs text-[#E5F1FF]/60 dark:text-[#E5F1FF]/60 text-gray-500 mb-3 italic">
                {theme.mood}
              </p>
              <div className="mb-3">
                <p className="text-xs text-[#E5F1FF]/70 dark:text-[#E5F1FF]/70 text-gray-500 mb-1">
                  Fonts: {theme.fonts.join(', ')}
                </p>
              </div>
              <div className="flex gap-1 flex-wrap">
                {theme.palette.map((color, index) => (
                  <div
                    key={index}
                    className="w-5 h-5 rounded-full border border-[#3E4C5E] dark:border-[#3E4C5E] border-gray-300 shadow-sm"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ThemeSelector; 