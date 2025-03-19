import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import Register from './Register'; 

const HeroSection = () => {
  const [showModal, setShowModal] = useState(false); 
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const navigate = useNavigate(); 

  useEffect(() => {
    const isModalShown = localStorage.getItem('isModalShown');
    const token = localStorage.getItem('authToken'); 
    
    if (!isModalShown) {
      setShowModal(true);
    }

    if (token) {
      setIsLoggedIn(true);
    }

    // ✅ Load chatbot script dynamically
    const script = document.createElement('script');
    script.src = "https://www.chatbase.co/embed.min.js";
    script.id = "qk-47xMdjyvKfLk2znPIg";
    script.domain = "www.chatbase.co";
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script); // Cleanup when component unmounts
    };
  }, []);

  const handleCloseModal = () => {
    setShowModal(false);
    localStorage.setItem('isModalShown', 'true');
  };

  const handleStartParking = () => {
    if (isLoggedIn) {
      navigate('/Parking');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="hero-section" style={{
      backgroundImage: 'url(/peopleimages.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      color: 'white',
      position: 'relative'
    }}>
      <div className="hero-overlay" style={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1
      }}></div>
      <div className="hero-content" style={{ zIndex: 2, maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '48px', fontWeight: 'bold' }}>Park. Pay. Go.</h1>
        <p style={{ fontSize: '18px', margin: '1rem 0' }}>When you're on the go, the free ParkMate app makes it easy to find and pay for parking without running back to feed the meter.</p>
        <p style={{ fontSize: '18px', margin: '1rem 0' }}>And for added convenience, you can reserve spots ahead of time.</p>

        <div className="mt-4">
          <button className="btn btn-success download-btn" onClick={handleStartParking}>
            Start Parking
          </button>
        </div>
        
        <div className="mt-4 download-app-container">
          <a href="/parkmate-app.apk" download>
            <button className="btn btn-success download-btn">
              Get the Mobile App
            </button>
          </a>
        </div>
      </div>

      {showModal && (
        <div className="modal" style={{
          position: 'fixed',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: '3',
          marginTop: '50px'
        }}>
          <div className="modal-content" style={{
            backgroundColor: 'white',
            padding: '1rem',
            borderRadius: '9px',
            maxHeight: '600px',
            maxWidth: '400px',
            width: '90%',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
          }}>
            <span onClick={handleCloseModal} style={{
              position: 'absolute',
              top: '10px',
              right: '20px',
              cursor: 'pointer',
              fontSize: '24px',
              color: '#000'
            }}>&times;</span>
            
            <Register />
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroSection;
