import React from 'react';
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import { ThemeProvider } from './contexts/ThemeContext';
import Home from './pages/Home';
import Generator from './pages/Generator';
import About from './pages/About';
import License from './pages/License';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6 py-12">
      <div className="max-w-lg text-center">
        <h1 className="text-4xl font-bold text-[#E5F1FF] dark:text-[#E5F1FF] text-gray-900 mb-4">Page not found</h1>
        <p className="text-[#E5F1FF]/80 dark:text-[#E5F1FF]/80 text-gray-600 mb-6">
          The page you requested does not exist. You can return home or open the generator.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            to="/"
            className="px-4 py-2 rounded-md bg-[#0074BD] text-white hover:bg-[#005a94] transition-colors"
          >
            Go Home
          </Link>
          <Link
            to="/generator"
            className="px-4 py-2 rounded-md border border-[#3E4C5E] text-[#E5F1FF] dark:text-[#E5F1FF] text-gray-800 hover:bg-gray-100 dark:hover:bg-[#1F2937] transition-colors"
          >
            Open Generator
          </Link>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen bg-white dark:bg-[#0E1B2A] text-gray-900 dark:text-[#E5F1FF] font-['Roboto',system-ui,sans-serif] transition-colors duration-300">
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-3 focus:py-2 focus:rounded focus:bg-[#0074BD] focus:text-white"
          >
            Skip to main content
          </a>
          <Header />
          <main id="main-content" tabIndex={-1}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/generator" element={<Generator />} />
              <Route path="/about" element={<About />} />
              <Route path="/license" element={<License />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
