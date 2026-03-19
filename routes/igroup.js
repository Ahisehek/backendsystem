// routes/igroup.js
const express = require("express");
const router = express.Router();
const Igroup = require("../models/Igroup");
const adminonly = require("../middleware/adminonly");

// Add a igroup
router.post("/add", adminonly, async (req, res) => {
  const { name } = req.body;

  if (!name)
    return res.status(400).json({ message: "Igroup name is required" });

  try {
    const existing = await Igroup.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: "Igroup already exists" });
    }

    const igroup = new Igroup({ name });
    await igroup.save();

    res.status(201).json({ message: "Igroup added successfully", igroup });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get all igroups
router.get("/list", async (req, res) => {
  try {
    const igroups = await Igroup.find().sort({ name: 1 });
    res.json(igroups);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a igroup
router.delete("/delete/:name", adminonly, async (req, res) => {
  try {
    const { name } = req.params;
    const deleted = await Igroup.findOneAndDelete({ name });

    if (!deleted) {
      return res.status(404).json({ message: "Igroup not found" });
    }

    res.json({ message: "Igroup deleted", igroup: deleted });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
