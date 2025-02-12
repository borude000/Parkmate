import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaCar, FaClock, FaMoneyBill, FaMapMarkerAlt, FaParking } from 'react-icons/fa'; // ✅ Import icons
import 'bootstrap/dist/css/bootstrap.min.css';
import './Orders.css'; // ✅ Import custom styles

const parkingLocations = {
  "Samarth Parking 1": { latitude: 19.128691564262418, longitude: 74.1897257922209 }, // Replace with actual coordinates
  "Samarth Parking 2": { latitude: 19.12876213483966, longitude: 74.18956833386297 }, // Replace with actual coordinates
};

const Orders = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  const [orderDetails, setOrderDetails] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null); // ✅ Track expanded order

  // Fetch latest order
  useEffect(() => {
    if (userId) {
      fetch(`http://localhost:5000/api/bookings/latest/${userId}`)
        .then((res) => res.json())
        .then((data) => {
          setOrderDetails(data);
        })
        .catch((err) => console.error('Error fetching latest order:', err));
    }
  }, [userId]);

  // Fetch order history
  useEffect(() => {
    if (userId) {
      fetch(`http://localhost:5000/api/bookings/history/${userId}`)
        .then((res) => res.json())
        .then((data) => {
          setOrderHistory(data);
        })
        .catch((err) => console.error('Error fetching order history:', err));
    }
  }, [userId]);

  // Toggle order details when clicked
  const toggleOrderDetails = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const handleNavigate = () => {
    if (orderDetails?.parkingArea && parkingLocations[orderDetails.parkingArea]) {
      const { latitude, longitude } = parkingLocations[orderDetails.parkingArea];
      window.open(`https://www.google.com/maps?q=${latitude},${longitude}`, "_blank");
    } else {
      alert("Navigation not available for this location.");
    }
  };
  

  return (
    <div className="container orders-container mt-5">
      <h2 className="text-center">Your Order Summary</h2>

      {/* Active Order */}
      {orderDetails ? (
        <div className="card order-card shadow mt-4">
          <div className="card-body">
            <h5 className="card-title text-success">✅ Active Booking</h5>
            <p><strong>Order ID:</strong> #{orderDetails._id}</p>
            <p><FaMapMarkerAlt className="icon" /> <strong>Location:</strong> {orderDetails.location}</p>
            <p><FaParking className="icon" /> <strong>Parking Area:</strong> {orderDetails.parkingArea}</p>
            <p><FaCar className="icon" /> <strong>Vehicle Type:</strong> {orderDetails.vehicleType}</p>
            <p><FaCalendarAlt className="icon" /> <strong>Date:</strong> {orderDetails.date}</p>
            <p><FaClock className="icon" /> <strong>Time:</strong> {orderDetails.time}</p>
            <p><FaMoneyBill className="icon" /> <strong>Amount Paid:</strong> Rs. {orderDetails.cost}</p>
             {/* Navigate Button (only if the parking area has coordinates) */}
      {parkingLocations[orderDetails.parkingArea] && (
        <button className="btn btn-success mt-3" onClick={handleNavigate}>
          Navigate to {orderDetails.parkingArea}
        </button>
      )}
          </div>
        </div>
      ) : (
        <p className="text-center mt-4 text-muted">No active booking found.</p>
      )}

      {/* Order History */}
      <div className="order-history mt-5">
        <h3 className="text-center">📜 Order History</h3>
        {orderHistory.length > 0 ? (
          <ul className="list-group">
            {orderHistory.map((order) => (
              <li 
                key={order._id} 
                className="list-group-item order-history-item" 
                onClick={() => toggleOrderDetails(order._id)}
              >
                <p className="mb-1"><strong>🗓 Date:</strong> {order.date}</p>
                <p className="mb-0 text-muted">Click to {expandedOrderId === order._id ? "hide" : "view"} details ⬇️</p>

                {expandedOrderId === order._id && (
                  <div className="expanded-order mt-2">
                    <p><strong>Order ID:</strong> #{order._id}</p>
                    <p><FaMapMarkerAlt className="icon" /> <strong>Location:</strong> {order.location}</p>
                    <p><FaParking className="icon" /> <strong>Parking Area:</strong> {order.parkingArea}</p>
                    <p><FaCar className="icon" /> <strong>Vehicle Type:</strong> {order.vehicleType}</p>
                    <p><FaClock className="icon" /> <strong>Time:</strong> {order.time}</p>
                    <p><FaMoneyBill className="icon" /> <strong>Amount Paid:</strong> Rs. {order.cost}</p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-muted">No previous bookings found.</p>
        )}
      </div>
    </div>
  );
};

export default Orders;
