const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    car: { type: mongoose.Schema.Types.ObjectId, ref: "Car", required: true },
    status: { type: String, enum: ["Booked", "Rented", "Returned"], default: "Booked" },
    bookingDate: { type: Date, default: Date.now },
    paymentStatus: { type: String, enum: ["Pending", "Completed", "Failed"], default: "Pending" }, // Payment tracking
    paymentIntentId: { type: String }, // Store Stripe Payment Intent ID
});

module.exports = mongoose.model("Booking", BookingSchema);
