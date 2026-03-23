const express = require("express");
const router = express.Router();
const Item = require("../models/Item");
const authmiddle = require("../middleware/authmiddle");

module.exports = (io) => {
  router.post("/add", authmiddle, async (req, res) => {
    const {
      siteName,
      itemName,
      itemGroup,
      gst,
      hsnCode,
      partsNo,
      unit,
      createdAt,
    } = req.body;

    if (!itemName || !hsnCode) {
      return res
        .status(400)
        .json({ message: "Item name and HSN code are required" });
    }

    try {
      const newItem = new Item({
        siteName,
        itemName,
        itemGroup,
        gst,
        hsnCode,
        partsNo,
        unit,
        createdAt,
      });

      await newItem.save();

      // Emit the event on successful save
      io.emit("item_added", newItem);
      //io.emit("massage",added);

      // Respond to client
      res
        .status(201)
        .json({ message: "Item added successfully", item: newItem });
    } catch (err) {
      console.error("Error saving item:", err);
      res.status(500).json({ message: "Error saving item" });
    }
  });

  router.get("/all", async (req, res) => {
    try {
      const items = await Item.find();
      res.status(200).json(items);
    } catch (err) {
      console.error("Error fetching items:", err);
      res.status(500).json({ message: "Error fetching items" });
    }
  });

  // PATCH route for updating status (optional)
  router.patch("/status/:id", async (req, res) => {
    const { status } = req.body;

    if (!["approved", "pending", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    try {
      const updatedItem = await Item.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true },
      );

      if (!updatedItem) {
        return res.status(404).json({ error: "Item not found" });
      }

      res.json({ message: "Item status updated", item: updatedItem });
    } catch (err) {
      res.status(500).json({ error: "admin only" });
    }
  });

  return router;
};
