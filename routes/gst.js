// routes/gst.js
const express = require("express");
const router = express.Router();
const Gst = require("../models/Gst");
const adminonly = require("../middleware/adminonly");

// Add a gst
router.post("/addgst", adminonly, async (req, res) => {
  console.log(req.body);
  const { name } = req.body;

  if (!name) return res.status(400).json({ message: "Gst name is required" });

  try {
    const existing = await Gst.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: "Gst already exists" });
    }

    const gst = new Gst({ name });
    await gst.save();

    res.status(201).json({ message: "Gst added successfully", gst });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get all gsts
router.get("/gstlist", async (req, res) => {
  try {
    const gsts = await Gst.find().sort({ name: 1 });
    res.json(gsts);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a gst
router.delete("/delete/:name", adminonly, async (req, res) => {
  try {
    const { name } = req.params;
    const deleted = await Gst.findOneAndDelete({ name });

    if (!deleted) {
      return res.status(404).json({ message: "Gst not found" });
    }

    res.json({ message: "Gst deleted", gst: deleted });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
