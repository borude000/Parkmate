import React from 'react';

const HeroSection = () => {
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
          <select className="form-select" aria-label="Select Location">
            <option selected>Select a location</option>
            <option value="1">Location 1</option>
            <option value="2">Location 2</option>
            <option value="3">Location 3</option>
            <option value="4">Location 4</option>
          </select>
        </div>
        <div className="mt-4">
          <a href="#" className="btn btn-success">Get the mobile app</a>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
