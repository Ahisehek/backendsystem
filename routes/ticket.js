const express = require("express");
const router = express.Router();
const Ticket = require("../models/Ticket");
const upload = require("../middleware/upload");
const adminonly = require("../middleware/adminonly");

module.exports = (io) => {
  // router.post("/add", upload.single("attachment"), async (req, res) => {
  //   try {
  //     const {
  //       siteName,
  //       employeeName,
  //       contactNo,
  //       concernType,
  //       description,
  //       createdAt,
  //     } = req.body;

  //     if (!req.file) {
  //       return res.status(400).json({ error: "File upload is required." });
  //     }

  //     const newTicket = new Ticket({
  //       siteName,
  //       employeeName,
  //       contactNo,
  //       concernType,
  //       description,
  //       createdAt,
  //       attachment: req.file ? req.file.filename : null, // save file path
  //     });

  //     await newTicket.save();

  //     io.emit("ticket_added", newTicket);

  //     res
  //       .status(201)
  //       .json({ message: "Ticket created successfully", ticket: newTicket });
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ error: "Server error" });
  //   }
  // });

  router.post("/add", upload.single("attachment"), async (req, res) => {
    try {
      const {
        siteName,
        employeeName,
        contactNo,
        concernType,
        description,
        createdAt,
      } = req.body;

      if (!req.file) {
        return res.status(400).json({ error: "File upload is required." });
      }

      // ✅ Cloudinary URL safe extraction
      const fileUrl = req.file.path;

      const newTicket = new Ticket({
        siteName,
        employeeName,
        contactNo,
        concernType,
        description,
        createdAt,
        attachment: fileUrl, // ✅ FINAL
      });

      await newTicket.save();

      // 🔥 Realtime update
      io.emit("ticket_added", newTicket);

      res.status(201).json({
        message: "Ticket created successfully",
        ticket: newTicket,
      });
    } catch (error) {
      console.error("Ticket upload error:", error);
      res.status(500).json({ error: "Server error" });
    }
  });

  router.get("/all", async (req, res) => {
    try {
      const tickets = await Ticket.find(); // ✅ Fetch documents from MongoDB
      // console.log("Fetched items:", tickets);
      res.status(200).json(tickets);
    } catch (err) {
      console.error("Error fetching tickets:", err);
      res.status(500).json({ message: "Error fetching tickets" });
    }
  });

  router.patch("/status/:id", async (req, res) => {
    const { status } = req.body;

    if (!["approved", "pending", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    try {
      const updatedItem = await Ticket.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true },
      );

      if (!updatedItem) {
        return res.status(404).json({ error: "Item not found" });
      }

      res.json({ message: "Item status updated", item: updatedItem });
    } catch (err) {
      res.status(500).json({ error: "Failed to update item status" });
    }
  });

  return router;
};
