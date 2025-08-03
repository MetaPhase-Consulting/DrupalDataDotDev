import React from 'react';
import Hero from '../components/Hero';
import ChartTypes from '../components/ChartTypes';
import SampleData from '../components/SampleData';
import About from '../components/About';

const Home: React.FC = () => {
  return (
    <div className="pt-16 min-h-screen">
      <Hero />
      <ChartTypes />
      <SampleData />
      <About />
    </div>
  );
};

export default Home;