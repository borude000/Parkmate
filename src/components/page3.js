import React from 'react';
 // Optional: if you want to add additional CSS

const VideoBanner = () => {
  return (
    <div className="container mt-4">
      <div className="video-container position-relative">
        {/* Video element */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="video-bg"
        >
          <source src="/video1.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Overlaying text */}
        <div className="position-absolute top-50 start-50 translate-middle text-light fw-bold text-center">
          <h2>Easily pay for parking from your phone</h2>
          <p>No change? Quickly pay for on-street parking right from your mobile device.</p>
          <p>.</p>
          
        </div>
      </div>
    </div>
  );
};

export default VideoBanner;
