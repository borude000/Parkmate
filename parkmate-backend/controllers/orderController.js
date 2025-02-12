import Order from "../models/Order.js";  // ✅ Use ES Module import

export const saveBooking = async (req, res) => {
  try {
    console.log("🔹 Received Booking Data:", req.body); // ✅ Debugging log

    const { userId, location, parkingArea, vehicleType, date, time, cost } = req.body;

    if (!userId || !location || !parkingArea || !vehicleType || !date || !time || !cost) {
      console.error("❌ Missing Required Fields:", req.body);
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const newOrder = new Order({ 
      userId, 
      location, 
      parkingArea, 
      vehicleType, 
      date, 
      time, 
      cost, 
      paymentStatus: "Completed" 
    });

    console.log("✅ Booking Saved Successfully:", newOrder);
    await newOrder.save();

    res.status(201).json({ success: true, message: "Booking saved successfully", order: newOrder });

  } catch (error) {
    console.error("🔥 Error Saving Booking:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
