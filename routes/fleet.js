// routes/fleet.js
const express = require("express");
const router = express.Router();
const Fleet = require("../models/Fleet");
const adminonly = require("../middleware/adminonly");
const authmiddle = require("../middleware/authmiddle");

// Add a fleet
router.post("/addfleet", authmiddle, adminonly, async (req, res) => {
  const { name } = req.body;

  if (!name) return res.status(400).json({ message: "Fleet name is required" });
  name = name.toUpperCase();
  try {
    const existing = await Fleet.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: "Fleet already exists" });
    }

    const fleet = new Fleet({ name });
    await fleet.save();

    res.status(201).json({ message: "Fleet added successfully", fleet });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get all fleets
router.get("/fleetlist", async (req, res) => {
  try {
    const fleets = await Fleet.find().sort({ name: 1 });
    res.json(fleets);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a fleet
router.delete("/delete/:name", authmiddle, adminonly, async (req, res) => {
  try {
    const { name } = req.params;
    const deleted = await Fleet.findOneAndDelete({ name });

    if (!deleted) {
      return res.status(404).json({ message: "Fleet not found" });
    }

    res.json({ message: "Fleet deleted", fleet: deleted });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
