const express = require("express");
const passport = require("passport");
const router = express.Router();
const Organization = require("../models/Organization");

// Create Organization (Admin only)
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    if (req.user.role !== "admin")
      return res.status(403).json({ msg: "Access denied" });

    const { name, address } = req.body;
    try {
      const newOrg = new Organization({ name, address });
      await newOrg.save();
      res.json(newOrg);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// Get All Organizations (Admin only)
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    if (req.user.role !== "admin")
      return res.status(403).json({ msg: "Access denied" });

    try {
      const organizations = await Organization.find();
      res.json(organizations);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// Update Organization (Admin only)
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    if (req.user.role !== "admin")
      return res.status(403).json({ msg: "Access denied" });

    try {
      const org = await Organization.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.json(org);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// Delete Organization (Admin only)
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    if (req.user.role !== "admin")
      return res.status(403).json({ msg: "Access denied" });

    try {
      await Organization.findByIdAndDelete(req.params.id);
      res.json({ msg: "Organization removed" });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
