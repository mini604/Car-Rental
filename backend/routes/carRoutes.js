const express = require("express");
const router = express.Router();
const { addCar, getAllCars, deleteCar, getCarById } = require("../controllers/carController");

// Debugging logs (remove in production)
console.log("addCar:", addCar);  // Should not be undefined
console.log("getAllCars:", getAllCars);  // Should not be undefined
console.log("deleteCar:", deleteCar);  // Should not be undefined

// Define Routes
router.post("/add", addCar);
router.get("/all", getAllCars);
router.get("/:id", getCarById); // Add this route
router.delete("/:id", deleteCar);

module.exports = router;