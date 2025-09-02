const Booking = require("../models/Booking");
const Car = require("../models/Car");

exports.createBooking = async (req, res) => {
    try {
      const { user, car } = req.body;
  
      const carExists = await Car.findById(car);
      if (!carExists) {
        return res.status(404).json({ msg: "Car not found" });
      }
  
      if (!carExists.isAvailable) {
        return res.status(400).json({ msg: "Car is not available" });
      }
  
      const newBooking = new Booking({ user, car, status: "Booked" });
      await newBooking.save();
  
      // Update car availability
      await Car.findByIdAndUpdate(car, { isAvailable: false });
  
      // Populate the car and user details in the response
      const populatedBooking = await Booking.findById(newBooking._id)
        .populate("car", "name model price")
        .populate("user", "name email")
        .exec();
  
      res.status(201).json({ msg: "Booking successful", booking: populatedBooking });
    } catch (err) {
      res.status(500).json({ msg: "Server Error", error: err.message });
    }
  };
  
  exports.getAllBookings = async (req, res) => {
    try {
      const bookings = await Booking.find()
        .populate("car", "name model price isAvailable")
        .populate("user", "name email")
        .lean();
        
      res.status(200).json(bookings.map(booking => ({
        ...booking,
        status: booking.paymentStatus === 'completed' ? 'Confirmed' : 'Booked'
      })));
    } catch (err) {
      res.status(500).json({ msg: "Server Error", error: err.message });
    }
  };

exports.getBookingsByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const bookings = await Booking.find({ user: userId })
      .populate("car", "name model price")
      .populate("user", "name email")
      .exec();

    if (!bookings.length) {
      return res.status(404).json({ msg: "No bookings found for this user" });
    }

    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("car", "name model price")
      .populate("user", "name email")
      .exec();

    if (!booking) {
      return res.status(404).json({ msg: "Booking not found" });
    }

    res.status(200).json(booking);
  } catch (err) {
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ msg: "Booking not found" });
    }

    await Car.findByIdAndUpdate(booking.car, { isAvailable: true });
    await Booking.findByIdAndDelete(bookingId);

    res.status(200).json({ msg: "Booking canceled successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id)
      .populate("car", "_id")
      .lean();
    
    if (!booking) {
      return res.status(404).json({ msg: "Booking not found" });
    }

    await Car.findByIdAndUpdate(booking.car._id, { isAvailable: true });

    res.status(200).json({ 
      msg: "Booking canceled successfully",
      car: { _id: booking.car._id } // Return minimal car data
    });
  } catch (err) {
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};