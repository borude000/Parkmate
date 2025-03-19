import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaCar, FaClock, FaMoneyBill, FaMapMarkerAlt, FaParking, FaPrint } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Orders.css';

const parkingLocations = {
  "Samarth Parking 1": { latitude: 19.128691564262418, longitude: 74.1897257922209 },
  "Samarth Parking 2": { latitude: 19.12876213483966, longitude: 74.18956833386297 },
};

const slots = ["A1", "A2", "A3", "A4", "A5", "B1", "B2", "B3", "B4", "B5"];

const Orders = () => {
  const userId = localStorage.getItem('userId');
  const [orderDetails, setOrderDetails] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [slotStatus, setSlotStatus] = useState({}); // Track slot status (red/green)
  const [slotEndTimes, setSlotEndTimes] = useState({}); // Track booking end times for slots
  const [isSlotSelected, setIsSlotSelected] = useState(false); // Track if a slot is selected

  // Fetch booked slots from the backend
  useEffect(() => {
    fetch(`http://localhost:5000/api/slots/booked`)
      .then((res) => res.json())
      .then((data) => {
        setBookedSlots(data.bookedSlots);
      })
      .catch((err) => console.error('Error fetching booked slots:', err));
  }, []);

  // Fetch latest order details for the user
  useEffect(() => {
    if (userId) {
      fetch(`http://localhost:5000/api/bookings/latest/${userId}`)
        .then((res) => res.json())
        .then((data) => {
          setOrderDetails(data);
          if (data?.slot) {
            setSelectedSlot(data.slot);
            setIsSlotSelected(true); // A slot is already selected
            const endTime = calculateEndTime(data.time);
            setSlotEndTimes((prev) => ({ ...prev, [data.slot]: endTime }));
            setSlotStatus((prev) => ({ ...prev, [data.slot]: 'red' })); // Set slot to red initially
          }
        })
        .catch((err) => console.error('Error fetching latest order:', err));
    }
  }, [userId]);

  // Fetch order history for the user
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

  // Function to calculate booking end time
  const calculateEndTime = (bookingTime) => {
    const now = new Date();
    const bookingEndTime = new Date(`${orderDetails.date}T${bookingTime}`);
    bookingEndTime.setHours(bookingEndTime.getHours() + 1); // Assuming 1-hour booking duration
    return bookingEndTime;
  };

  // Monitor slot status based on end time
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const updatedSlotStatus = { ...slotStatus };

      for (const slot in slotEndTimes) {
        if (now > slotEndTimes[slot]) {
          updatedSlotStatus[slot] = 'green'; // Slot is free
        } else {
          updatedSlotStatus[slot] = 'red'; // Slot is occupied
        }
      }

      setSlotStatus(updatedSlotStatus);
    }, 1000); // Check every second

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [slotEndTimes]);

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

  const handlePrint = () => {
    window.print();
  };

  const handleSlotSelect = async (slot) => {
    if (!isSlotSelected && !bookedSlots.includes(slot)) {
      setSelectedSlot(slot);
      setIsSlotSelected(true); // Prevent further slot selection
      const endTime = calculateEndTime(orderDetails.time);
      
      // Mark the slot as red initially
      setSlotEndTimes((prev) => ({ ...prev, [slot]: endTime }));
      setSlotStatus((prev) => ({ ...prev, [slot]: 'red' }));
  
      try {
        const response = await fetch(`http://localhost:5000/api/slot-bookings/assign-slot`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, orderId: orderDetails._id, slot }), // Save slot to order
        });
  
        if (!response.ok) {
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
  
        const data = await response.json();
        console.log("Slot assigned:", data);
        setBookedSlots((prev) => [...prev, slot]); // Update booked slots
  
        // Update order details with the selected slot
        setOrderDetails((prev) => ({
          ...prev,
          slot: slot,
        }));
      } catch (err) {
        console.error("Error assigning slot:", err);
      }
    }
  };
  

  return (
    <div className="container orders-container mt-5">
      <h2 className="text-center">Your Order Summary</h2>

      {orderDetails ? (
        <div className="card order-card shadow mt-4" id="printableArea">
          <div className="card-body">
            <h5 className="card-title text-success">✅ Active Booking</h5>
            <p><strong>Order ID:</strong> #{orderDetails._id}</p>
            <p><FaMapMarkerAlt className="icon" /> <strong>Location:</strong> {orderDetails.location}</p>
            <p><FaParking className="icon" /> <strong>Parking Area:</strong> {orderDetails.parkingArea}</p>
            <p><FaCar className="icon" /> <strong>Vehicle Type:</strong> {orderDetails.vehicleType}</p>
            <p><FaCalendarAlt className="icon" /> <strong>Date:</strong> {orderDetails.date}</p>
            <p><FaClock className="icon" /> <strong>Time:</strong> {orderDetails.time}</p>
            <p><FaMoneyBill className="icon" /> <strong>Amount Paid:</strong> Rs. {orderDetails.cost}</p>

            {selectedSlot && (
              <p><strong>Selected Slot:</strong> {selectedSlot}</p>
            )}

<div className="slot-container">
  {slots.map((slot) => (
    <button
      key={slot}
      className={`slot-btn ${
        bookedSlots.includes(slot)
          ? 'booked'
          : selectedSlot === slot
          ? slotStatus[slot] || 'red'
          : ''
      }`}
      onClick={() => handleSlotSelect(slot)}
      disabled={bookedSlots.includes(slot) || isSlotSelected} // Disable if booked
    >
      {slot}
    </button>
  ))}
</div>


            {parkingLocations[orderDetails.parkingArea] && (
              <button className="btn btn-success mt-3 me-2" onClick={handleNavigate}>
                Navigate to {orderDetails.parkingArea}
              </button>
            )}

            <button className="btn btn-light mt-3" onClick={handlePrint}>
              <FaPrint /> Print
            </button>
          </div>
        </div>
      ) : (
        <p className="text-center mt-4 text-muted">No active booking found.</p>
      )}

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