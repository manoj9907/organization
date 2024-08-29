const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/User");
const keys = require("../config/keys");

// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });
    console.log("user", user);

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const payload = { id: user.id, name: user.name, role: user.role };
    const token = jwt.sign(payload, keys.secret, { expiresIn: 3600 });

    res.json({ success: true, token: `Bearer ${token}` });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Signup Route
router.post("/signup", async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    user = new User({
      name,
      email,
      password,
      role,
    });

    await user.save();
    const payload = { id: user.id, name: user.name, role: user.role };

    const token = jwt.sign(payload, keys.secret, { expiresIn: 3600 });

    res.json({ success: true, token: `Bearer ${token}` });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
