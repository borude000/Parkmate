import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook for navigation
import Register from './Register'; // Import your Register component

const HeroSection = () => {
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
  const navigate = useNavigate(); // Initialize useNavigate hook

  useEffect(() => {
    // Check localStorage to see if the modal was previously shown
    const isModalShown = localStorage.getItem('isModalShown');
    const token = localStorage.getItem('authToken'); // Assuming you store the token in localStorage
    
    if (!isModalShown) {
      setShowModal(true); // Show modal if it hasn't been shown before
    }

    // Set the login state based on whether the user is logged in
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // Function to close the modal
  const handleCloseModal = () => {
    setShowModal(false);
    // Set a flag in localStorage to prevent showing the modal again
    localStorage.setItem('isModalShown', 'true');
  };

  // Function to handle "Start Parking" button click
  const handleStartParking = () => {
    if (isLoggedIn) {
      navigate('/Parking'); // Navigate to the parking page if logged in
    } else {
      navigate('/login'); // Navigate to the login page if not logged in
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
        <div className="search-bar input-group mb-5" style={{ maxWidth: '400px', margin: '2rem auto 0 auto' }}>
        </div>

        {/* Conditionally render login and register buttons based on login status */}
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

      {/* Modal Popup for Registration */}
      {showModal && (
        <div className="modal" style={{
          position: 'fixed',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.7)', // Darker overlay
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: '3',
          marginTop: '50px'
        }}>
          <div className="modal-content" style={{
            backgroundColor: 'white',
            padding: '1rem', // Reduced padding
            borderRadius: '9px',
            maxHeight: '600px',
            maxWidth: '400px', // Smaller width
            width: '90%', // Responsive width
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' // Optional shadow for effect
          }}>
            <span onClick={handleCloseModal} style={{
              position: 'absolute',
              top: '10px',
              right: '20px',
              cursor: 'pointer',
              fontSize: '24px',
              color: '#000'
            }}>&times;</span>
            
            {/* Render the Register component inside the modal */}
            <Register />
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroSection;
