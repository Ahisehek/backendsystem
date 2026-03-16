// routes/bank.js
const express = require("express");
const router = express.Router();
const Bank = require("../models/Bank");
const adminonly = require("../middleware/adminonly");

// Add a bank
router.post("/add", async (req, res) => {
  const { name } = req.body;

  if (!name) return res.status(400).json({ message: "Bank name is required" });

  try {
    const existing = await Bank.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: "Bank already exists" });
    }

    const bank = new Bank({ name });
    await bank.save();

    res.status(201).json({ message: "Bank added successfully", bank });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get all banks
router.get("/list", async (req, res) => {
  try {
    const banks = await Bank.find().sort({ name: 1 });
    res.json(banks);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a bank
router.delete("/delete/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const deleted = await Bank.findOneAndDelete({ name });

    if (!deleted) {
      return res.status(404).json({ message: "Bank not found" });
    }

    res.json({ message: "Bank deleted", bank: deleted });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
