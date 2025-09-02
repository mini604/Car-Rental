
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect Database
connectDB();

// Routes
app.use("/api/auth", require("./routes/authRoutes"));

const carRoutes = require("./routes/carRoutes"); 
app.use("/api/cars", carRoutes);

app.use("/api/bookings", require("./routes/bookingRoutes"));

app.use("/api/payments", require("./routes/paymentRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
