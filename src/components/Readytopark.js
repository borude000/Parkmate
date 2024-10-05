import React, { useEffect } from "react";
import "./App.css";

function App() {
  useEffect(() => {
    const images = document.querySelectorAll('.animate-image');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('slide-in');
        }
      });
    });

    images.forEach(image => {
      observer.observe(image);
    });

    return () => {
      images.forEach(image => {
        observer.unobserve(image);
      });
    };
  }, []);

  return (
    <div id="Readytopark" className="container mt-5">  {/* Add id here */}
      <div className="row">
        <div className="col-md-8">
          <h1>Parking by city</h1>
          <p>
            ParkMate is making parking easier in over locations across Citys.
          </p>
          <div className="search-bar input-group mb-5" style={{ maxWidth: '400px', margin: '2rem auto 0 auto' }}>
            <select className="form-select" aria-label="Select Location">
              <option selected>Select a location</option>
              <option value="1">Pune</option>
              <option value="2">Ahmednagar</option>
              <option value="3">Other</option>
              <option value="4">coming Soon..</option>
            </select>
          </div>
        </div>
        <div className="col-md-4">
          <h4>Popular Citys</h4>
          <div className="d-flex flex-column">
            <div className="mb-3 animate-image">
              <h5>Pune</h5>
              <img
                src="Pune.jpg"
                alt="Pune"
                className="img-fluid rounded"
              />
            </div>
            <div className="animate-image">
              <h5>Ahmednagar</h5>
              <img
                src="Ahmednagar.jpg"
                alt="Ahmednagar"
                className="img-fluid rounded"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
