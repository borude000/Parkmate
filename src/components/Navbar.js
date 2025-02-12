import React, { useState, useEffect } from 'react';
import { Link } from 'react-scroll';
import axios from 'axios';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsLoggedIn(true);
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
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
    setUser(null);
    window.location.reload();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
      <div className="container-fluid">
        {/* Logo */}
        <a className="navbar-brand d-flex align-items-center" href="/" style={{ gap: '10px' }}>
          <img src="/logo.png" alt="ParkMate Logo" style={{ height: '50px' }} />
          <span className="fw-bold text-dark fs-4">ParkMate</span>
        </a>

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
              <Link className="nav-link nav-link-hover" to="page2" smooth={true} duration={500}>
                Ready to park now
              </Link>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/Orders">Orders</a>
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
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 15px',
                  borderRadius: '25px',
                  background: '#f1f1f1',
                  transition: 'background 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#e0e0e0')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#f1f1f1')}
              >
                <img
                  src="/profile.png"
                  alt="Profile"
                  style={{ width: '35px', height: '35px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <span style={{ fontWeight: 'bold', fontSize: '14px', color: '#333' }}>
                  {isLoggedIn ? user?.name : 'Guest'}
                </span>
              </a>
              <ul
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="profileDropdown"
                style={{
                  minWidth: '220px',
                  borderRadius: '10px',
                  boxShadow: '0px 4px 8px rgba(0,0,0,0.1)',
                  border: 'none',
                  overflow: 'hidden',
                }}
              >
                {isLoggedIn ? (
                  <>
                    <li className="dropdown-item" style={{ padding: '12px 15px', fontSize: '14px' }}>
                      <strong>Name:</strong> {user?.name}
                    </li>
                    <li className="dropdown-item" style={{ padding: '12px 15px', fontSize: '14px' }}>
                      <strong>Email:</strong> {user?.email}
                    </li>
                    <li>
                      <a
                        className="dropdown-item text-danger"
                        onClick={handleLogout}
                        style={{
                          padding: '12px 15px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          transition: 'background 0.3s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#f8d7da')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        Logout
                      </a>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <a className="dropdown-item" href="/login" style={{ padding: '12px 15px' }}>
                        Login
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="/register" style={{ padding: '12px 15px' }}>
                        Sign Up
                      </a>
                    </li>
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
