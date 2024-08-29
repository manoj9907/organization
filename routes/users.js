const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");

// Create User
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    console.log("dd");

    if (req.user.role !== "admin")
      return res.status(403).json({ msg: "Access denied" });

    const { name, email, password, role, organization } = req.body;
    try {
      const newUser = new User({ name, email, password, role, organization });
      await newUser.save();
      res.json(newUser);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// Get All Users (Admin only)
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    if (req.user.role !== "admin")
      return res.status(403).json({ msg: "Access denied" });

    try {
      const users = await User.find().populate("organization");
      res.json(users);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// Get Own User Data
router.get(
  "/me",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id).populate("organization");
      res.json(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
