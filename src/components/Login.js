import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap is included
import './Login.css'; // Your custom styling

const Login = () => {
  // State to store email and password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(''); // State for success message
  const navigate = useNavigate(); // Initialize the navigate hook

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form reload on submit

    try {
        // Axios POST request to your backend API
        const response = await axios.post('https://parkmate-backend-1qby.onrender.com/api/auth/login', {
            email,
            password,
        });

        // If login is successful, handle the response
        console.log('Login successful:', response.data);

        // Save the token and userId to localStorage
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('userId', response.data.user._id);  // ✅ Store userId

        // Set success message
        setSuccess('Login successful! Redirecting...');

        // Delay for 2 seconds, then navigate and refresh the page
        setTimeout(() => {
            navigate('/');
            window.location.reload(); // Reload to fetch updated profile data
        }, 2000);

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
          <img src="/logo.png" alt="ParkMate" />
        </div>
        <h3 className="text-center">Welcome back</h3>
        <p className="text-center">Please enter your details to sign in.</p>
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
          </div>
          <button type="submit" className="btn btn-success btn-block login-submit">Sign in</button>
        </form>

        {/* Bootstrap Alert for Success */}
        {success && (
          <div className="alert alert-success text-center mt-3" role="alert">
            {success}
          </div>
        )}

        {/* Bootstrap Alert for Error */}
        {error && (
          <div className="alert alert-danger text-center mt-3" role="alert">
            {error}
          </div>
        )}

        <p className="text-center mt-3">
          Don’t have an account yet? <a href="/register">Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
