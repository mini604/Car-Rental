const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
    try {
        console.log("Signup API hit"); // Check if the API is being called

        const { name, email, password } = req.body;
        console.log("Received Data:", req.body); // Log incoming request data

        if (!name || !email || !password) {
            return res.status(400).json({ msg: "All fields are required" });
        }

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: "User already exists" });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save user
        user = new User({ name, email, password: hashedPassword });
        await user.save();

        console.log("User registered successfully:", user);
        res.json({ msg: "User registered successfully" });
    } catch (err) {
        console.error("Signup API Error:", err); // Log the exact error
        res.status(500).json({ msg: "Server Error", error: err.message });
    }
};


exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Check if the user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }
  
      // Validate password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }
  
      // Generate JWT token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  
      // Return the token and user ID
      res.status(200).json({ token, user: { _id: user._id, name: user.name, email: user.email } });
    } catch (err) {
      res.status(500).json({ msg: "Server Error", error: err.message });
    }
  };
