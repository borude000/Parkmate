const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Order = require('../models/order');

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
        const bookings = await Order.find({ userId }).sort({ createdAt: -1 }) ;

        res.status(200).json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
