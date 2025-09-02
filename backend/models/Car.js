const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
  name: { type: String, required: true },
  model: { type: String, required: true },
  price: { type: Number, required: true },
  isAvailable: { type: Boolean, default: true }, // Ensure this field exists
  image: { type: String, required: true },
});

module.exports = mongoose.model("Car", carSchema);