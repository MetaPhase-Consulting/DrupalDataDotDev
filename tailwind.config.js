/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'drupal-navy': '#0E1B2A',
        'drupal-blue': '#0074BD',
        'drupal-cyan': '#00C9FF',
        'drupal-light': '#E5F1FF',
        'drupal-muted': '#1F2937',
        'drupal-muted-2': '#3E4C5E',
      },
      fontFamily: {
        'inter': ['Inter', 'Segoe UI', 'sans-serif'],
        'roboto': ['Roboto', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};