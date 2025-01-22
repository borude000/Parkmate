import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const ParkingServicePage = () => {
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [showParkingArea, setShowParkingArea] = useState(false);
  const [date, setDate] = useState('');
  const [time, setTime] = useState({ start: '', end: '' });
  const [step, setStep] = useState(1); // Track the current step
  const [cost, setCost] = useState(null);

  const locations = {
    'Location 1': ['Area 1', 'Area 2'],
    'Location 2': ['Area 3', 'Area 4']
  };

  const calculateCost = () => {
    if (!time.start || !time.end) return;
  
    const startTime = new Date(`${date}T${time.start}`);
    const endTime = new Date(`${date}T${time.end}`);
    const durationInHours = (endTime - startTime) / (1000 * 60 * 60);
  
    let calculatedCost = 0;
  
    if (selectedVehicle === 'car') {
      if (durationInHours < 1) {
        calculatedCost = 20; // Minimum cost for cars
      } else if (durationInHours >= 1 && durationInHours < 2) {
        calculatedCost = 30; // Cost for 1-2 hours
      } else if (durationInHours >= 2 && durationInHours < 3) {
        calculatedCost = 50; // Cost for 2-3 hours
      } else {
        calculatedCost = 70; // Cost for more than 3 hours
      }
    } else if (selectedVehicle === 'motorcycle') {
      if (durationInHours < 1) {
        calculatedCost = 10; // Minimum cost for motorcycles
      } else if (durationInHours >= 1 && durationInHours < 2) {
        calculatedCost = 20; // Cost for 1-2 hours
      } else if (durationInHours >= 2 && durationInHours < 3) {
        calculatedCost = 30; // Cost for 2-3 hours
      } else {
        calculatedCost = 30; // Cost for more than 3 hours (same as 2-3 hours for motorcycles)
      }
    }
  
    setCost(calculatedCost); // Set the calculated cost
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
    calculateCost(); // Recalculate cost whenever the date changes
  };

  const handleTimeChange = (e) => {
    const { name, value } = e.target;
    setTime((prev) => {
      const newTime = { ...prev, [name]: value };
      calculateCost(); // Recalculate cost whenever time changes
      return newTime;
    });
  };

  const handleSubmit = () => {
    if (selectedLocation && selectedArea && selectedVehicle && date && time.start && time.end) {
      window.location.href = 'https://razorpay.me/@parkmet'; // Replace with your actual Razorpay payment link
    } else {
      alert('Please complete all steps before proceeding to payment.');
    }
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
      `}</style>

      {/* Progress Bar */}
      <div className="progress-bar-container">
        <div className="progress-bar"></div>
      </div>

      <h2>WE HAVE A SPOT FOR YOU.</h2>

      {cost !== null && <div className="cost-display">Cost: Rs. {cost}</div>}

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
              <input
                type="date"
                className="form-control"
                onChange={handleDateChange}
                value={date}
              />
              <div className="d-flex justify-content-between">
                <input
                  type="time"
                  className="form-control me-2"
                  placeholder="Start Time"
                  onChange={handleTimeChange}
                  value={time.start}
                  name="start"
                />
                <input
                  type="time"
                  className="form-control"
                  placeholder="End Time"
                  onChange={handleTimeChange}
                  value={time.end}
                  name="end"
                />
              </div>
            </div>
          </div>
        )}
        {date && time.start && time.end && (
          <div className="col">
            <div className="parking-step">
              <div className="parking-circle">
                <img src="payment.png" alt="Payment Icon" />
              </div>
              <p>Payment</p>
              <button className="btn btn-success" onClick={handleSubmit}>
                Proceed to Payment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParkingServicePage;
