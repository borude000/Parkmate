import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import Footer from './components/Footer';
import Page2 from './components/page2';
import Page3 from './components/page3';
import Readytopark from './components/Readytopark';
import './App.css';


function App() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <Page2 />
      <Page3/>
      <Readytopark/>
      <Footer />
      
    </div>
  );
}

export default App;
