const mongoose = require('mongoose');

const slotBookingSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // ID of the user who booked the slot
  slotId: { type: String, required: true }, // ID of the booked slot
  startTime: { type: Date, default: Date.now }, // Start time of booking
  endTime: { type: Date, required: true } // End time of booking
});

module.exports = mongoose.model('SlotBooking', slotBookingSchema);
router.post('/assign-slot', async (req, res) => {
  const { userId, slot, duration } = req.body; // Duration in minutes

  try {
    const existingSlot = await Slot.findOne({ slotId: slot });
    if (existingSlot && existingSlot.isBooked) {
      return res.status(400).json({ error: 'Slot is already booked' });
    }

    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + duration * 60000); // Convert minutes to milliseconds

    // Create a new booking with endTime
    const newBooking = new SlotBooking({ userId, slotId: slot, startTime, endTime });
    await newBooking.save();

    // Mark slot as booked
    await Slot.findOneAndUpdate(
      { slotId: slot },
      { isBooked: true, bookedBy: newBooking._id }
    );

    res.json({ success: true, message: 'Slot assigned successfully', endTime });
  } catch (err) {
    console.error('Error in slot assignment:', err);
    res.status(500).json({ error: 'Failed to assign slot' });
  }
});
