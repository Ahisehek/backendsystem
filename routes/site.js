const express = require("express");
const router = express.Router();
const Site = require("../models/Site");
const adminonly = require("../middleware/adminonly");


// Get all sites
router.get("/allsite", async (req, res) => {
  try {
    const sites = await Site.find();
    res.json(sites);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new site
// In your POST /add route
router.post("/addsite", async (req, res) => {
  const { fullName, sortName } = req.body;

  if (!fullName || !sortName) {
    return res.status(400).json({ message: "Full Name and Sort Name are required" });
  }

  try {
    const existing = await Site.findOne({ fullName, sortName });
    if (existing) {
      return res.status(409).json({ message: "Site already exists" });
    }

    const newSite = new Site({ fullName, sortName });
    const saved = await newSite.save();
    console.log("Saved site:", saved);
    res.status(201).json(saved);
  } catch (err) {
    console.error("Error in POST /add:", err);
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});



// Delete site by ID
router.delete("/:id", async (req, res) => {
  try {
    const site = await Site.findByIdAndDelete(req.params.id);
    if (!site) return res.status(404).json({ message: "Site not found" });
    res.json({ message: "Deleted", site });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
