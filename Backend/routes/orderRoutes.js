import express from "express";  // ✅ Use import instead of require
import { saveBooking } from "../controllers/orderController.js";  // ✅ Ensure file exists

const router = express.Router();  // ✅ Define router BEFORE using it

router.post("/", saveBooking);  // ✅ Use router AFTER defining it

export default router;  // ✅ Use ES module export
