const Car = require("../models/Car");

// Add a car
exports.addCar = async (req, res) => {
  try {
    const { name, model, price, isAvailable, image } = req.body; // Ensure field names match the model
    const car = new Car({ name, model, price, isAvailable, image });
    await car.save();
    res.status(201).json(car);
  } catch (err) {
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};

// Get all cars
exports.getAllCars = async (req, res) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (err) {
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};

// Get a single car by ID
exports.getCarById = async (req, res) => {
  try {
    const carId = req.params.id;
    const car = await Car.findById(carId);

    if (!car) {
      return res.status(404).json({ msg: "Car not found" });
    }

    res.status(200).json(car);
  } catch (err) {
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};

// Delete a car
exports.deleteCar = async (req, res) => {
  try {
    await Car.findByIdAndDelete(req.params.id);
    res.json({ msg: "Car deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};