import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { ThemeProvider } from './contexts/ThemeContext';
import Home from './pages/Home';
import Generator from './pages/Generator';
import About from './pages/About';

// 404 Component
const NotFound = () => {
  React.useEffect(() => {
    // Redirect to the static 404.html page
    window.location.href = '/404.html';
  }, []);
  
  return null;
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-white dark:bg-[#0E1B2A] text-gray-900 dark:text-[#E5F1FF] font-['Roboto',system-ui,sans-serif] transition-colors duration-300">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/generator" element={<Generator />} />
              <Route path="/about" element={<About />} />
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