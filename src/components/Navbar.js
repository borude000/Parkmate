import React, { useState, useEffect } from 'react';
import { Link } from 'react-scroll';
import axios from 'axios';

const Navbar = () => {
  const [user, setUser] = useState(null); // To store user profile data
  const [isLoggedIn, setIsLoggedIn] = useState(false); // To track if user is logged in

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsLoggedIn(true);
      // Fetch user profile data using the token
      axios
        .get('http://localhost:5000/api/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setUser(response.data);
        })
        .catch((error) => {
          console.error('Error fetching profile data', error);
        });
    }
  }, [isLoggedIn]); // Re-fetch when the user logs in

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
      <div className="container-fluid">
        {/* Logo */}
        <a className="navbar-brand" href="/">
          <img src="/logo.png" alt="ParkMate Logo" style={{ height: '50px' }} />
        </a>
        <a className="fw-bold text-dark fs-4" href="/">ParkMate</a>
        
        {/* Toggler for Mobile Menu */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible Navbar Menu */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto fw-bold">
            <li className="nav-item">
              <a className="nav-link" href="/">Home</a>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link nav-link-hover"
                to="page2"
                smooth={true}
                duration={500}
              >
                Ready to park now
              </Link>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Solutions for parking providers</a>
            </li>
            {/* Profile Dropdown */}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle d-flex align-items-center"
                href="#"
                id="profileDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  src="/profile.png" // Replace with the path to your profile icon
                  alt="Profile"
                  style={{ width: '30px', height: '30px', borderRadius: '50%' }}
                />
              </a>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
                {isLoggedIn ? (
                  <>
                    <li><span className="dropdown-item">Name= {user?.name}</span></li>
                    <li><span className="dropdown-item">Email= {user?.email}</span></li>
                    <li><span className="dropdown-item">{user?.mobile}</span></li>
                    <li><a className="dropdown-item text-danger" onClick={handleLogout}>Logout</a></li>
                  </>
                ) : (
                  <>
                    <li><a className="dropdown-item" href="/login">Login</a></li>
                    <li><a className="dropdown-item" href="/register">Sign Up</a></li>
                  </>
                )}
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
