import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import Footer from './components/Footer';
import Page2 from './components/page2';
import Page3 from './components/page3';
import ReadytoPark from './components/Readytopark';
import Login from './components/Login';  
import Register from './components/Register';  
import Profile from './components/Profile'; 
import './App.css'; 
import Parking from './components/Parking';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={
          <>
            <HeroSection />
            <Page2 />
            <Page3 />
            <ReadytoPark />
            
            
          </>
        } />
        <Route path="/login" element={<Login />} />  
        <Route path="/register" element={<Register />} />  
        <Route path="/profile" element={<Profile />} />
        <Route path="/Parking" element={<Parking />} />
      </Routes>
      <Footer />
    </Router>
    
    
    
  );
}

export default App;
