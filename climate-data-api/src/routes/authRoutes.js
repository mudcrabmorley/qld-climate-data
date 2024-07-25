require("dotenv").config();

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Login with username and password
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("Email:", email); // Log the email
  try {
    const user = await User.findOne({ email });
    console.log("User:", user); // Log the user object
    if (!user) {
      return res.status(401).send("Invalid email or password");
    }

    console.log("Comparing:", password, user.password); // Log passwords being compared
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch); // Log the password match result
    if (!isMatch) {
      return res.status(401).send("Invalid email or password");
    }

    // Update last login time
    user.lastLogin = new Date();
    await user.save();

    let token;
    try {
      if (!process.env.JWT_SECRET_KEY) {
        console.error(
          "JWT_SECRET_KEY is not set. Please set it in your environment variables."
        );
        return res
          .status(500)
          .send("Authentication error. Please try again later.");
      }

      token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET_KEY, // Use the environment variable
        { expiresIn: "1h" }
      );
    } catch (jwtError) {
      console.error("JWT Signing Error:", jwtError.message); // Log the detailed error message
      return res.status(500).send("Error generating token");
    }

    res.send({ token });
  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
