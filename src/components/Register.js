import React, { useState } from 'react';
import axios from 'axios';
import './Login.css'; // Your custom styling

const Register = () => {
  // State to store name, email, password, and mobile
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form reload on submit

    try {
      // Axios POST request to your backend API
      const response = await axios.post('https://parkmate-backend-1qby.onrender.com/api/auth/register', {
        name,
        email,
        password,
        mobile
      });

      // If registration is successful, handle the response
      console.log('Registration successful:', response.data);
      setSuccess('Registration successful! You can now log in.');
      setError('');
    } catch (err) {
      // Handle registration error
      console.error('Error during registration:', err.response ? err.response.data : err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      setSuccess('');
    }
  };

  return (
    <div className="login-container d-flex justify-content-center align-items-center">
      <div className="login-box">
        <div className="login-logo">
          {/* You can add your ParkMate logo here */}
          <img src="/logo.png" alt="ParkMate" />
        </div>
        <h3 className="text-center">Welcome</h3>
        <p className="text-center">Please enter your details to register.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Enter your name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
          <div className="form-group">
            <input
              type="number"
              className="form-control"
              placeholder="Enter your mobile..."
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
            />
          </div>
          <div className="form-group d-flex justify-content-between">
            <div>
              <input type="checkbox" id="rememberMe" />
              <label htmlFor="rememberMe"> Remember me</label>
            </div>
          </div>
          <button type="submit" className="btn btn-success btn-block login-submit">Register</button>
          {error && <p className="text-danger text-center">{error}</p>}
          {success && <p className="text-success text-center">{success}</p>}
        </form>
        <p className="text-center mt-3">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
