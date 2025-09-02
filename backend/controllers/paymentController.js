const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Booking = require("../models/Booking");
const Car = require("../models/Car");

exports.createPaymentIntent = async (req, res) => {
    try {
      const { bookingId, amount } = req.body;
  
      // Validate booking exists
      const booking = await Booking.findById(bookingId).populate("car");
      if (!booking) {
        return res.status(404).json({ msg: "Booking not found" });
      }
  
      // Create payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        metadata: { bookingId: booking._id.toString() }
      });
  
      // Update booking with payment intent ID
      booking.paymentIntentId = paymentIntent.id;
      await booking.save();
  
      res.status(200).json({ 
        clientSecret: paymentIntent.client_secret,
        amount: paymentIntent.amount / 100
      });
  
    } catch (err) {
      res.status(500).json({ msg: "Server Error", error: err.message });
    }
  };
  
exports.confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    // Verify payment with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({ 
        msg: "Payment not completed",
        status: paymentIntent.status 
      });
    }

    // Update booking status
    const booking = await Booking.findOneAndUpdate(
      { paymentIntentId },
      { 
        paymentStatus: "paid",
        status: "confirmed" 
      },
      { new: true }
    ).populate("car");

    if (!booking) {
      return res.status(404).json({ msg: "Booking not found" });
    }

    res.status(200).json({ 
      msg: "Payment confirmed",
      booking 
    });

  } catch (err) {
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};