const express = require("express");
const router = express.Router();
const Unit = require("../models/Unit");
const adminonly = require("../middleware/adminonly");

// Get all units
router.get("/allunit", async (req, res) => {
  try {
    const units = await Unit.find();
    res.json(units);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new unit
// In your POST /add route
router.post("/addunit", async (req, res) => {
  const { fullName, sortName } = req.body;

  if (!fullName || !sortName) {
    return res.status(400).json({ message: "Full Name and Sort Name are required" });
  }

  try {
    const existing = await Unit.findOne({ fullName, sortName });
    if (existing) {
      return res.status(409).json({ message: "Unit already exists" });
    }

    const newUnit = new Unit({ fullName, sortName });
    const saved = await newUnit.save();
    console.log("Saved unit:", saved);
    res.status(201).json(saved);
  } catch (err) {
    console.error("Error in POST /add:", err);
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});



// Delete unit by ID
router.delete("/:id", async (req, res) => {
  try {
    const unit = await Unit.findByIdAndDelete(req.params.id);
    if (!unit) return res.status(404).json({ message: "Unit not found" });
    res.json({ message: "Deleted", unit });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
