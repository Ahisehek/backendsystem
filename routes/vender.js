const express = require("express");
const router = express.Router();
const Vender = require("../models/Vender");
const upload = require("../middleware/upload");
const adminonly = require("../middleware/adminonly");

// Fields to be uploaded as files

const uploadFields = upload.fields([
  { name: "gstCertificate", maxCount: 1 },
  { name: "panCard", maxCount: 1 },
  { name: "cancelledCheque", maxCount: 1 },
  { name: "msme", maxCount: 1 },
]);

module.exports = (io) => {
  // router.post('/add', uploadFields, async (req, res) => {
  //   try {
  //     const {
  //       siteName,
  //       accountName,
  //       fullAddress,
  //       city,
  //       contactPersonName,
  //       contactPersonNo,
  //       emailId,
  //       bankName,
  //       bankAccountNo,
  //       ifscCode,
  //       panNo,
  //       gstNo,
  //       msmeNo,
  //       accountGroup,
  //       gstState,
  //       tds,
  //       //verifyIfsc,
  //       //verifyGst,
  //       //itrDeclaration,
  //       msmeType,

  //       //majorActivity,
  //       createdAt,

  //     } = req.body;

  //     const attachments = {
  //       gstCertificate: req.files?.gstCertificate?.[0]?.filename || null,
  //       panCard: req.files?.panCard?.[0]?.filename || null,
  //       cancelledCheque: req.files?.cancelledCheque?.[0]?.filename || null,
  //       msme: req.files?.msme?.[0]?.filename || null,
  //     };

  //     const vender = new Vender({
  //       siteName,
  //       accountName,
  //       fullAddress,
  //       city,
  //       contactPersonName,
  //       contactPersonNo,
  //       emailId,
  //       bankName,
  //       bankAccountNo,
  //       ifscCode,
  //       panNo,
  //       gstNo,
  //       msmeNo,
  //       accountGroup,
  //       gstState,
  //       tds,

  //       msmeType,

  //      createdAt,
  //       attachments,
  //     });

  //     await vender.save();
  //      io.emit("vendor_added", vender);

  //     res.status(201).json({ message: 'Vendor added successfully', vender });
  //   } catch (err) {
  //     console.error('Error adding vendor:', err);
  //     res.status(500).json({ message: 'Server Error' });
  //   }
  // });

  router.post("/add", uploadFields, async (req, res) => {
    try {
      const {
        siteName,
        accountName,
        fullAddress,
        city,
        contactPersonName,
        contactPersonNo,
        emailId,
        bankName,
        bankAccountNo,
        ifscCode,
        panNo,
        gstNo,
        msmeNo,
        accountGroup,
        gstState,
        tds,
        msmeType,
        createdAt,
      } = req.body;

      const attachments = {
        // 🔥 IMPORTANT CHANGE (filename ❌ → path ✅)
        gstCertificate: req.files?.gstCertificate?.[0]?.path || null,
        panCard: req.files?.panCard?.[0]?.path || null,
        cancelledCheque: req.files?.cancelledCheque?.[0]?.path || null,
        msme: req.files?.msme?.[0]?.path || null,
      };

      const vender = new Vender({
        siteName,
        accountName,
        fullAddress,
        city,
        contactPersonName,
        contactPersonNo,
        emailId,
        bankName,
        bankAccountNo,
        ifscCode,
        panNo,
        gstNo,
        msmeNo,
        accountGroup,
        gstState,
        tds,
        msmeType,
        createdAt,
        attachments,
      });

      await vender.save();

      // 🔥 socket emit
      io.emit("vendor_added", vender);

      res.status(201).json({
        message: "Vendor added successfully",
        vender,
      });
    } catch (err) {
      console.error("Error adding vendor:", err);
      res.status(500).json({ message: "Server Error" });
    }
  });

  router.get("/all", async (req, res) => {
    try {
      const venders = await Vender.find(); // ✅ Fetch documents from MongoDB
      //console.log("Fetched items:", venders);
      res.status(200).json(venders);
    } catch (err) {
      console.error("Error fetching items:", err);
      res.status(500).json({ message: "Error fetching items" });
    }
  });

  router.patch("/status/:id", async (req, res) => {
    const { status } = req.body;

    if (!["approved", "pending", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    try {
      const updatedItem = await Vender.findByIdAndUpdate(
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
