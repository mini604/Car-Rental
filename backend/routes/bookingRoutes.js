const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController"); // Ensure correct path

// ✅ Book a car
router.post("/book", bookingController.createBooking);

// ✅ Get all bookings
router.get("/", bookingController.getAllBookings);

// ✅ Get a single booking by booking ID
router.get("/booking/:id", bookingController.getBookingById);

// ✅ Get all bookings by user ID
router.get("/user/:userId", bookingController.getBookingsByUser); // ✅ Fixed route conflict

// ✅ Cancel (delete) a booking
router.delete("/:id", bookingController.cancelBooking);

module.exports = router;
