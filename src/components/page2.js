import React, { useEffect, useRef } from 'react';

const Page2 = () => {
  const sectionsRef = useRef([]);

  useEffect(() => {
    const sections = sectionsRef.current;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('scale-in'); // Apply the scale-in effect
        }
      });
    });

    sections.forEach(section => {
      if (section) observer.observe(section); // Check if section exists
    });

    return () => {
      sections.forEach(section => {
        if (section) observer.unobserve(section); // Check before unobserving
      });
    };
  }, []);

  return (
    <div id="page2" className="container my-5">
      <div className="row">
        <div className="col-12 text-center">
          <h1>The smarter way to park</h1>
          <p>.</p>
          <br />
        </div>

        <div className="col-12 mt-4">
          <div className="steps-container">
            <div ref={(el) => (sectionsRef.current[0] = el)} className="step step-1 section">
              <h2>1</h2>
              <p>Enter your zone number</p>
              <div className="search-bar input-group mb-5" style={{ maxWidth: '400px', margin: '2rem auto 0 auto' }}>
                
              </div>
            </div>

            <div ref={(el) => (sectionsRef.current[1] = el)} className="step step-2 section">
              <h2>2</h2>
              <p>Set your time</p>
              
            </div>

            <div ref={(el) => (sectionsRef.current[2] = el)} className="step step-3 section">
              <h2>3</h2>
              <p>Select your vehicle</p>
              <div className="vehicle-options">
                
              </div>
            </div>

            <div ref={(el) => (sectionsRef.current[3] = el)} className="step step-4 section">
              <h2>4</h2>
              <p>Pay & go</p>
              <button className="btn btn-dark">Start Parking</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page2;
