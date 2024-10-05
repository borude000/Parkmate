import React from 'react';
import { Link } from 'react-scroll';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
      <div className="container-fluid">
        {/* Logo */}
        <a className="navbar-brand" href="#">
          <img src="/logo.png" alt="ParkMate Logo" style={{ height: '50px' }} />
        </a>
        <a className="fw-bold text-dark fs-4" href="#">ParkMate</a>
        
        {/* Toggler for Mobile Menu */}
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible Navbar Menu */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto fw-bold">
            <li className="nav-item">
              <Link 
                className="nav-link nav-link-hover" 
                to="Readytopark" 
                smooth={true} 
                duration={500}
              >
                Ready to park now
              </Link>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Reserve parking for later</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">ParkMate for Business</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Solutions for parking providers</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
