const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Order = require('../models/order');

// Example function to get the next available slot
async function getNextAvailableSlot(location, parkingArea) {
    // Retrieve all the bookings for the location and parking area, sorted by date/time
    const latestBooking = await Order.find({ location, parkingArea }).sort({ createdAt: -1 }).limit(1);

    if (!latestBooking || latestBooking.length === 0) {
        return 'slot1'; // If no bookings yet, assign the first slot
    }

    // Extract the latest assigned slot and determine the next one
    const lastSlot = latestBooking[0].selectedSlot; // Example: 'slot3'
    const slotNumber = parseInt(lastSlot.replace('slot', '')); // Extract the numeric part
    return `slot${slotNumber + 1}`; // Increment the slot number
}

// ✅ Create a new booking (with automatic slot assignment)
router.post('/book', async (req, res) => {
    const { userId, location, parkingArea, vehicleType, date, time, cost } = req.body;

    try {
        // Get the next available slot for the given location and parking area
        const nextSlot = await getNextAvailableSlot(location, parkingArea);

        // Create the new order with the next available slot
        const newOrder = new Order({
            userId,
            location,
            parkingArea,
            vehicleType,
            date,
            time,
            cost,
            selectedSlot: nextSlot, // Assign the next available slot
        });

        // Save the order
        await newOrder.save();

        // Respond with the order details
        res.status(200).json({
            message: 'Booking confirmed',
            order: newOrder,
        });
    } catch (error) {
        console.error('Error processing the booking:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// ✅ Get the latest booking for a user
router.get('/latest/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const latestBooking = await Order.findOne({ userId }).sort({ createdAt: -1 });

        if (!latestBooking) {
            return res.status(404).json({ message: 'No booking found for this user' });
        }

        res.status(200).json(latestBooking);
        console.log('Latest booking:', latestBooking); // Debug log
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// ✅ Get order history for a user
router.get('/history/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        console.log('Received userId:', userId); // Debug log
        const bookings = await Order.find({ userId }).sort({ createdAt: -1 });

        res.status(200).json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
