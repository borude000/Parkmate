import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const ParkingServicePage = () => {
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [showParkingArea, setShowParkingArea] = useState(false);
  const [date, setDate] = useState('');
  const [time, setTime] = useState({ start: '', end: '' });
  const [step, setStep] = useState(1);
  const [cost, setCost] = useState(null);
  const [availableSlots, setAvailableSlots] = useState(["A1", "A2", "A3", "B1", "B2"]); // Example slots
  const [selectedSlot, setSelectedSlot] = useState(""); // Track selected slot
  const [remainingTime, setRemainingTime] = useState(null); // Track remaining time for the selected slot
  const [bookingStartTime, setBookingStartTime] = useState(null); // Track booking start time
  const [bookingEndTime, setBookingEndTime] = useState(null); // Track booking end time
  const [slotStatus, setSlotStatus] = useState({
    A1: { status: "free", remainingTime: null },
    A2: { status: "free", remainingTime: null },
    A3: { status: "free", remainingTime: null },
    B1: { status: "free", remainingTime: null },
    B2: { status: "free", remainingTime: null },
  }); // Track the status and countdown for each slot
  const navigate = useNavigate();


  const locations = {
    'Samarth Parking ': ['Samarth Parking 1', 'Samarth Parking 2'],
    'Location 2': ['Area 3', 'Area 4']
  };

  // Dynamically load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => console.log('Razorpay script loaded');
    document.body.appendChild(script);

    // Cleanup the script on component unmount
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    calculateCost(); // Recalculate cost whenever time or date changes
  }, [date, time, selectedVehicle]);

  useEffect(() => {
    if (bookingStartTime && bookingEndTime && selectedSlot) {
      // Mark the selected slot as occupied
      setSlotStatus((prevStatus) => ({
        ...prevStatus,
        [selectedSlot]: { ...prevStatus[selectedSlot], status: "occupied" },
      }));

      const interval = setInterval(() => {
        const now = new Date();

        if (now < bookingStartTime) {
          setSlotStatus((prevStatus) => ({
            ...prevStatus,
            [selectedSlot]: { ...prevStatus[selectedSlot], remainingTime: "Advance Booking" },
          }));
        } else if (now >= bookingStartTime && now <= bookingEndTime) {
          const diff = bookingEndTime - now;
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          setSlotStatus((prevStatus) => ({
            ...prevStatus,
            [selectedSlot]: {
              ...prevStatus[selectedSlot],
              remainingTime: `${hours} hours ${minutes} minutes ${seconds} seconds`,
            },
          }));
        } else {
          clearInterval(interval);

          // Free the slot when the countdown ends
          setSlotStatus((prevStatus) => ({
            ...prevStatus,
            [selectedSlot]: { status: "free", remainingTime: null },
          }));
          setSelectedSlot(""); // Clear the selected slot
          setBookingStartTime(null);
          setBookingEndTime(null);
          localStorage.removeItem("activeBooking"); // Clear booking details
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [bookingStartTime, bookingEndTime, selectedSlot]);

  useEffect(() => {
    const activeBooking = JSON.parse(localStorage.getItem("activeBooking"));
    if (activeBooking) {
      const { slot, startTime, endTime } = activeBooking;

      setSelectedSlot(slot);
      setBookingStartTime(new Date(startTime));
      setBookingEndTime(new Date(endTime));
    }
  }, []);

  console.log("Remaining Time:", remainingTime); // Debugging log

  const calculateCost = () => {
    if (!time.start || !time.end || !date) {
      setCost(null);
      return;
    }

    const startTime = new Date(`${date}T${time.start}`);
    const endTime = new Date(`${date}T${time.end}`);

    if (endTime <= startTime) {
      setCost('Invalid time selection');
      return;
    }

    const durationInHours = (endTime - startTime) / (1000 * 60 * 60);
    let calculatedCost = 0;

    if (selectedVehicle === 'car') {
      if (durationInHours <= 1) {
        calculatedCost = 20; // Minimum cost for cars
      } else if (durationInHours <= 2) {
        calculatedCost = 30; // Cost for 1-2 hours
      } else if (durationInHours <= 3) {
        calculatedCost = 50; // Cost for 2-3 hours
      } else {
        calculatedCost = 70; // Cost for more than 3 hours
      }
    } else if (selectedVehicle === 'motorcycle') {
      if (durationInHours <= 1) {
        calculatedCost = 10; // Minimum cost for motorcycles
      } else if (durationInHours <= 2) {
        calculatedCost = 20; // Cost for 1-2 hours
      } else if (durationInHours <= 3) {
        calculatedCost = 30; // Cost for 2-3 hours
      } else {
        calculatedCost = 30; // Cost for more than 3 hours (same as 2-3 hours for motorcycles)
      }
    }

    setCost(`Rs. ${calculatedCost}`); // Set the calculated cost
  };

  const handleLocationChange = (event) => {
    setSelectedLocation(event.target.value);
    setSelectedArea('');
    setSelectedVehicle('');
    setShowParkingArea(true);
    setStep(2); // Move to step 2
  };

  const handleAreaChange = (event) => {
    setSelectedArea(event.target.value);
    setStep(3); // Move to step 3
  };

  const handleVehicleChange = (event) => {
    setSelectedVehicle(event.target.value);
    setStep(4); // Move to step 4
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleTimeChange = (e) => {
    const { name, value } = e.target;
    setTime((prev) => ({ ...prev, [name]: value }));
  };

  const suggestedTimeSlots = [
    { start: "09:00", end: "17:00" },
    { start: "10:00", end: "13:00" },
  ];

  const handleSuggestedTimeSelect = (start, end) => {
    setTime({ start, end });
  };

  // Function to handle slot selection
  const handleSlotSelect = (slot) => {
    if (slotStatus[slot].status === "free") {
      setSelectedSlot(slot);
      console.log("Selected Slot:", slot); // Debugging log
    }
  };

  const handleSubmit = () => {
    if (selectedLocation && selectedArea && selectedVehicle && date && time.start && time.end && typeof cost === 'string') {
      const numericalCost = parseInt(cost.replace('Rs. ', ''), 10);
  
      if (isNaN(numericalCost) || numericalCost <= 0) {
        alert('Invalid cost. Please check your selections.');
        return;
      }
  
      const user = JSON.parse(localStorage.getItem("userData")); // Fetch user details from localStorage

const razorpayKey = "rzp_test_gLSezl1mumwdVs"; // Replace with your Razorpay test key

const options = {
  key: razorpayKey,
  amount: numericalCost * 100,
  currency: 'INR',
  name: 'ParkMate',
  description: 'Parking Service Payment',
  handler: function (response) {
    // Call function to save booking in the backend
    saveBookingToBackend(response.razorpay_payment_id);
  },
  prefill: {
    name: user?.name || "Guest",  // Fetch user's name dynamically
    email: user?.email || "guest@example.com",  // Fetch user's email dynamically
    contact: user?.mobile || "0000000000",  // Fetch user mobile dynamically (if available)
  },
  notes: {
    address: "Customer's address",
  },
  theme: {
    color: "#28a745",
  },
};

const razorpay = new window.Razorpay(options);
razorpay.open();

    } else {
      alert('Please complete all steps correctly before proceeding to payment.');
    }
  };
  
  const saveBookingToBackend = async (paymentId) => {
    try {
      const bookingData = {
        userId: localStorage.getItem("userId"),
        location: selectedLocation,
        parkingArea: selectedArea,
        vehicleType: selectedVehicle,
        date: date,
        time: `${time.start} - ${time.end}`,
        cost: parseInt(cost.replace("Rs. ", ""), 10),
        slot: selectedSlot,
        paymentId: paymentId,
      };
  
      console.log("📢 Sending Booking Data:", bookingData);
  
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });
  
      const result = await response.json();
      console.log("📢 API Response:", result);
  
      if (response.ok) {
        // Calculate and set booking times
        const [startHour, startMinute] = time.start.split(":").map(Number);
        const [endHour, endMinute] = time.end.split(":").map(Number);
  
        const start = new Date(date);
        start.setHours(startHour, startMinute, 0);
  
        const end = new Date(date);
        end.setHours(endHour, endMinute, 0);
  
        // Save booking details to localStorage
        localStorage.setItem(
          "activeBooking",
          JSON.stringify({
            slot: selectedSlot,
            startTime: start.toISOString(),
            endTime: end.toISOString(),
          })
        );
  
        setBookingStartTime(start);
        setBookingEndTime(end);
  
        Swal.fire({
          title: "Payment & Booking Successful!",
          text: "Your parking has been booked successfully.",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          navigate("/Orders");
        });
      } else {
        console.error("❌ API Error:", result);
        Swal.fire("Error!", result.message || "Failed to save booking details!", "error");
      }
    } catch (error) {
      console.error("🔥 Fetch Error:", error);
      Swal.fire("Error!", "Failed to save booking details!", "error");
    }
  };
  

 
  const getDateOptions = () => {
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    return [today]; // Return only today's date in an array
  };
  

  return (
    <div className="container text-center mt-5">
      <style>{`
        .progress-bar-container {
          width: 100%;
          height: 10px;
          background-color: #f1f1f1;
          border-radius: 5px;
          margin-bottom: 20px;
          overflow: hidden;
        }

        .progress-bar {
          height: 100%;
          background-color: #28a745; /* Green */
          width: ${step * 20}%;
          transition: width 0.4s ease;
        }

        .parking-step .parking-circle {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background-color: #f8f9fa;
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 0 auto 10px;
          font-size: 20px;
          color: #28a745; /* Green */
          border: 2px solid #28a745;
        }

        .parking-step p {
          font-size: 16px;
          margin: 0;
        }

        .form-control {
          margin: 10px auto;
          max-width: 300px;
        }

        button {
          margin-top: 20px;
          background-color: #28a745;
          border-color: #28a745;
          color: white;
        }

        button:hover {
          background-color: #218838;
          border-color: #1e7e34;
        }

        .parking-step .parking-circle img {
          width: 30px;
          height: 30px;
        }

        .cost-display {
          margin-top: 20px;
          font-size: 18px;
          color: #28a745;
          font-weight: bold;
        }

        .cost-display.error {
          color: red;
        }

        .slot-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(80px, 1fr)); /* Responsive grid */
          gap: 15px;
          margin-top: 20px;
          justify-content: center;
        }

        .slot-btn {
          width: 170px;
          height: 80px;
          font-size: 12px;
          font-weight: bold;
          border-radius: 10px;
          border: 2px solid #28a745;
          cursor: pointer;
          background-color: #f8f9fa;
          color: #28a745;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          text-align: center;
        }

        .slot-btn:hover {
          background-color: #d4f8d4;
          transform: scale(1.05);
        }

        .slot-btn.selected {
          background-color: #ffec99;
          border-color: #ffc107;
          color: #212529;
        }

        .slot-btn.booked {
          background-color: #ff6961;
          border-color: #dc3545;
          color: white;
          cursor: not-allowed;
          opacity: 0.7;
        }

        .slot-btn .timer-text {
          font-size: 9px;
          color: #6c757d;
          margin-top: 5px;
          line-height: 1.2;
          word-wrap: break-word;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* Media Query for Mobile View */
        @media (max-width: 768px) {
          .slot-container {
            grid-template-columns: 1fr; /* Make slots stack vertically */
          }

          .slot-btn {
            width: 100%; /* Full width for mobile */
            height: auto; /* Adjust height automatically */
            font-size: 14px; /* Slightly larger font size for better readability */
          }

          .parking-step {
            margin-bottom: 20px; /* Add spacing between steps */
          }

          .form-control {
            width: 100%; /* Full width for inputs */
          }

          .progress-bar-container {
            height: 8px; /* Slightly smaller progress bar for mobile */
          }
        }
      `}</style>

      {/* Progress Bar */}
      <div className="progress-bar-container">
        <div className="progress-bar"></div>
      </div>

      <h2>WE HAVE A SPOT FOR YOU.</h2>

      {cost && <div className={`cost-display ${cost === 'Invalid time selection' ? 'error' : ''}`}>{cost}</div>}

      <div className="row mt-4">
        <div className="col">
          <div className="parking-step">
            <div className="parking-circle">
              <img src="location.png" alt="Location Icon" />
            </div>
            <p>Select The Location</p>
            <select
              className="form-control"
              onChange={handleLocationChange}
              value={selectedLocation}
            >
              <option value="">Select Location</option>
              {Object.keys(locations).map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>
        </div>
        {showParkingArea && (
          <div className="col">
            <div className="parking-step">
              <div className="parking-circle">
                <img src="area.png" alt="Parking Area Icon" />
              </div>
              <p>Parking Area</p>
              <select
                className="form-control"
                onChange={handleAreaChange}
                value={selectedArea}
              >
                <option value="">Select Area</option>
                {locations[selectedLocation]?.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
        {selectedArea && (
          <div className="col">
            <div className="parking-step">
              <div className="parking-circle">
                <img src="vehicle.png" alt="Vehicle Icon" />
              </div>
              <p>Select Vehicle Type</p>
              <select
                className="form-control"
                onChange={handleVehicleChange}
                value={selectedVehicle}
              >
                <option value="">Select Vehicle Type</option>
                <option value="car">Car</option>
                <option value="motorcycle">Motorcycle</option>
              </select>
            </div>
          </div>
        )}

        
        {selectedVehicle && (
          <div className="col">
            <div className="parking-step">
              <div className="parking-circle">
                <img src="date and time.png" alt="Date and Time Icon" />
              </div>
              <p>Select Date And Time</p>
              <select
                className="form-control"
                onChange={handleDateChange}
                value={date}
              >
                <option value="">Select Date</option>
                {getDateOptions().map((optionDate) => (
                  <option key={optionDate} value={optionDate}>
                    {optionDate}
                  </option>
                ))}
              </select>
              <div className="d-flex justify-content-between">
  <input
    type="time"
    className="form-control"
    name="start"
    value={time.start}
    onChange={handleTimeChange}
  />
  <input
    type="time"
    className="form-control"
    name="end"
    value={time.end}
    onChange={handleTimeChange}
  />
</div>

{/* Suggested Time Slots */}
<div className="mt-2">
  <p className="mb-1">Suggested Timings:</p>
  <div className="d-flex flex-wrap">
    {suggestedTimeSlots.map((slot, index) => (
      <button
        key={index}
        className="btn btn-outline-success m-1"
        onClick={() => handleSuggestedTimeSelect(slot.start, slot.end)}
      >
        {slot.start} - {slot.end}
      </button>
    ))}
  </div>
</div>

              
            </div>
          </div>
        )}
      </div>

      {/* Slot Selection */}
      {time.start && time.end && (
        <div className="slot-container">
          <h4>Select a Slot</h4>
          {availableSlots.map((slot) => (
            <button
              key={slot}
              className={`slot-btn ${
                selectedSlot === slot ? "selected" : slotStatus[slot].status === "occupied" ? "booked" : ""
              }`}
              onClick={() => handleSlotSelect(slot)}
              disabled={slotStatus[slot].status === "occupied"} // Disable only occupied slots
            >
              <span>{slot}</span>
              {slotStatus[slot].remainingTime && (
                <span className="timer-text">
                  ⏳ {slotStatus[slot].remainingTime}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Proceed to Payment */}
      {selectedSlot && cost && (
        <button onClick={handleSubmit} className="btn btn-success mt-4">
          Proceed to Payment
        </button>
      )}
    </div>
  );
};

export default ParkingServicePage;
