import React from 'react';
import Hero from '../components/Hero';
import ChartTypes from '../components/ChartTypes';
import SampleData from '../components/SampleData';
import About from '../components/About';

const Home: React.FC = () => {
  return (
    <>
      <Hero />
      <ChartTypes />
      <SampleData />
      <About />
    </>
  );
};

export default Home;