const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  slotId: { type: String, required: true, unique: true }, // Unique slot ID (e.g., "A1", "A2")
  isBooked: { type: Boolean, default: false }, // Whether the slot is booked
  bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'SlotBooking' }, // Reference to the booking
});

module.exports = mongoose.model('Slot', slotSchema);