import React from 'react';
import Hero from '../components/Hero';
import ChartTypes from '../components/ChartTypes';
import SampleData from '../components/SampleData';
import Generate from '../components/Generate';
import About from '../components/About';

const Home: React.FC = () => {
  return (
    <>
      <Hero />
      <ChartTypes />
      <SampleData />
      <Generate />
      <About />
    </>
  );
};

export default Home;