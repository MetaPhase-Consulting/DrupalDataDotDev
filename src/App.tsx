import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ChartTypes from './components/ChartTypes';
import SampleData from './components/SampleData';
import Generate from './components/Generate';
import About from './components/About';
import Footer from './components/Footer';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-[#0E1B2A] text-gray-900 dark:text-[#E5F1FF] font-['Roboto',system-ui,sans-serif] transition-colors duration-300">
        <Header />
        <main>
          <Hero />
          <ChartTypes />
          <SampleData />
          <Generate />
          <About />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;