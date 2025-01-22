import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Make sure axios is installed
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [userData, setUserData] = useState(null); // For storing user data
  const [error, setError] = useState(null); // For handling errors
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          navigate('/login'); // Redirect to login if no token found
          return;
        }

        const response = await axios.get('/api/user/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserData(response.data); // Set user data to state
      } catch (err) {
        setError('Error fetching profile data');
        console.error('Error fetching profile data:', err);
      }
    };

    fetchUserProfile(); // Call the function when the component mounts
  }, [navigate]);

  // If loading user data or error
  if (!userData && !error) {
    return <div>Loading...</div>;
  }

  // If error occurs
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="profile-section" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>User Profile</h2>
      <div className="profile-details" style={{ marginBottom: '20px' }}>
        <p><strong>Name:</strong> {userData.name}</p>
        <p><strong>Email:</strong> {userData.email}</p>
        <p><strong>Mobile:</strong> {userData.mobile}</p>
      </div>

      {/* Logout button */}
      <button
        onClick={() => {
          localStorage.removeItem('authToken'); // Clear the token from localStorage
          navigate('/login'); // Redirect to login page
        }}
        className="btn btn-danger"
      >
        Logout
      </button>
    </div>
  );
};

export default Profile;
