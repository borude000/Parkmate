import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Login.css'; // Your custom styling

const Login = () => {
  // State to store email and password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize the navigate hook

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form reload on submit

    try {
      // Axios POST request to your backend API
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      // If login is successful, handle the response
      console.log('Login successful:', response.data);

      // Display a success alert
      alert('Login successful!'); // Popup alert after successful login

      // Save the token to localStorage
      localStorage.setItem('authToken', response.data.token);
      
      navigate('/')

      // Trigger page refresh to fetch updated profile info
      window.location.reload(); // Reload the page to update the profile data
      

      // Optionally, navigate to home page (if you don't rely on the page refresh)
      // navigate('/'); // Change '/' to your desired route if you prefer navigation over refresh
    } catch (err) {
      // Handle login error
      console.error('Error during login:', err.response ? err.response.data : err);
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="login-container d-flex justify-content-center align-items-center">
      <div className="login-box">
        <div className="login-logo">
          {/* Add your ParkMate logo here */}
          <img src="/logo.png" alt="ParkMate" />
        </div>
        <h3 className="text-center">Welcome back</h3>
        <p className="text-center">Please enter your details to sign in.</p>
        <div className="login-options d-flex justify-content-center">
          <button className="login-btn google-btn">
            <img src="/google.png" alt="Google logo" className="btn-icon" /> Google
          </button>
        </div>
        <p className="text-center">OR</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-control"
              placeholder="Enter your password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group d-flex justify-content-between">
            <div>
              <input type="checkbox" id="rememberMe" />
              <label htmlFor="rememberMe"> Remember me</label>
            </div>
            <a href="#" className="forgot-password">Forgot password?</a>
          </div>
          <button type="submit" className="btn btn-success btn-block login-submit">Sign in</button>
          {/* Display error message if login fails */}
          {error && <p className="text-danger text-center">{error}</p>}
        </form>
        <p className="text-center mt-3">
          Don’t have an account yet? <a href="/register">Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
