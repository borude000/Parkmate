const mongoose = require('mongoose');

const slotBookingSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // ID of the user who booked the slot
  slotId: { type: String, required: true }, // ID of the booked slot
  startTime: { type: Date, default: Date.now }, // Start time of booking
  endTime: { type: Date, required: true } // End time of booking
});

module.exports = mongoose.model('SlotBooking', slotBookingSchema);
