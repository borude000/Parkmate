const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.String, ref: "User", required: true },
  location: { type: String, required: true },
  parkingArea: { type: String, required: true },
  vehicleType: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  cost: { type: Number, required: true },
  slot: { type: String, required: false }, // Add slot field to store selected slot
  paymentStatus: { type: String, enum: ["Pending", "Completed"], default: "Pending" }, // Track payment
}, { timestamps: true });

// ✅ Fix OverwriteModelError: Check if model already exists before compiling
const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

module.exports = Order;
