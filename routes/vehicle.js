// const express = require("express");
// const router = express.Router();
// const Vehicle = require("../models/Vehicle");
// const upload = require("../middleware/upload");
// const adminonly = require("../middleware/adminonly");

// module.exports = (io) => {
//   // const uploadFields = upload.fields([
//   //   { name: "vehiclePic", maxCount: 1 },
//   //   { name: "vehicleRcPic", maxCount: 1 },
//   //   { name: "licencePic", maxCount: 1 },
//   // ]);

//   // router.post("/add", uploadFields, async (req, res) => {
//   //   try {
//   //     const {
//   //       openingDate,
//   //       make,
//   //       model,
//   //       subContractorName,
//   //       registrationNo,
//   //       siteName,
//   //       machineCategory,
//   //       createdAt,
//   //     } = req.body;

//   //     const assetPics = {
//   //       vehiclePic: req.files?.vehiclePic?.[0]?.filename || null,
//   //       vehicleRcPic: req.files?.vehicleRcPic?.[0]?.filename || null,
//   //       licencePic: req.files?.licencePic?.[0]?.filename || null,
//   //     };

//   //     // Create new vehicle
//   //     const newVehicle = new Vehicle({
//   //       openingDate,
//   //       make,
//   //       model,
//   //       subContractorName,
//   //       registrationNo,
//   //       siteName,
//   //       machineCategory,
//   //       createdAt,
//   //       assetPics,
//   //     });

//   //     await newVehicle.save();

//   //     io.emit("vehicle_added", newVehicle);

//   //     res
//   //       .status(201)
//   //       .json({ message: "Vehicle added successfully", vehicle: newVehicle });
//   //   } catch (error) {
//   //     console.error("Error adding vehicle:", error);
//   //     res.status(500).json({ message: "Server Error" });
//   //   }
//   // });

//   router.post("/add", async (req, res) => {
//     try {
//       const {
//         openingDate,
//         make,
//         model,
//         subContractorName,
//         registrationNo,
//         siteName,
//         machineCategory,
//         createdAt,
//       } = req.body;

//       const assetPics = {
//         // 🔥 IMPORTANT CHANGE (filename ❌ → path ✅)
//         vehiclePic: req.files?.vehiclePic?.[0]?.path || null,
//         vehicleRcPic: req.files?.vehicleRcPic?.[0]?.path || null,
//         licencePic: req.files?.licencePic?.[0]?.path || null,
//       };

//       const newVehicle = new Vehicle({
//         openingDate,
//         make,
//         model,
//         subContractorName,
//         registrationNo,
//         siteName,
//         machineCategory,
//         createdAt,
//         assetPics,
//       });

//       await newVehicle.save();

//       // 🔥 socket same rahega
//       io.emit("vehicle_added", newVehicle);

//       res.status(201).json({
//         message: "Vehicle added successfully",
//         vehicle: newVehicle,
//       });
//     } catch (error) {
//       console.error("Error adding vehicle:", error);
//       res.status(500).json({ message: "Server Error" });
//     }
//   });
//   router.get("/all", async (req, res) => {
//     try {
//       const vehicles = await Vehicle.find(); // ✅ Fetch documents from MongoDB
//       //console.log("Fetched vehicles:", vehicles);
//       res.status(200).json(vehicles);
//     } catch (err) {
//       console.error("Error fetching vehicles:", err);
//       res.status(500).json({ message: "Error fetching vehicles" });
//     }
//   });

//   router.patch("/status/:id", async (req, res) => {
//     const { status } = req.body;

//     if (!["approved", "pending", "rejected"].includes(status)) {
//       return res.status(400).json({ error: "Invalid status value" });
//     }

//     try {
//       const updatedItem = await Vehicle.findByIdAndUpdate(
//         req.params.id,
//         { status },
//         { new: true },
//       );

//       if (!updatedItem) {
//         return res.status(404).json({ error: "Item not found" });
//       }

//       res.json({ message: "Item status updated", item: updatedItem });
//     } catch (err) {
//       res.status(500).json({ error: "Failed to update item status" });
//     }
//   });

//   return router;
// };

const express = require("express");
const router = express.Router();
const Vehicle = require("../models/Vehicle");
const { upload, uploadToImageKit } = require("../middleware/upload");

module.exports = (io) => {
  // ✅ Multiple file fields
  const uploadFields = upload.fields([
    { name: "vehiclePic", maxCount: 1 },
    { name: "vehicleRcPic", maxCount: 1 },
    { name: "licencePic", maxCount: 1 },
  ]);

  // ✅ ADD VEHICLE
  router.post("/add", uploadFields, async (req, res) => {
    try {
      const {
        openingDate,
        make,
        model,
        subContractorName,
        registrationNo,
        siteName,
        machineCategory,
        createdAt,
      } = req.body;

      // 🔥 Helper function (single file upload)
      const handleUpload = async (fileArray) => {
        if (!fileArray || !fileArray[0]) return null;

        // fake req create (reuse your upload function)
        const fakeReq = {
          file: fileArray[0],
          originalUrl: req.originalUrl,
        };

        const result = await uploadToImageKit(fakeReq);
        return result?.url;
      };

      // 🔥 Upload all files
      const assetPics = {
        vehiclePic: await handleUpload(req.files?.vehiclePic),
        vehicleRcPic: await handleUpload(req.files?.vehicleRcPic),
        licencePic: await handleUpload(req.files?.licencePic),
      };

      const newVehicle = new Vehicle({
        openingDate,
        make,
        model,
        subContractorName,
        registrationNo,
        siteName,
        machineCategory,
        createdAt,
        assetPics,
      });

      await newVehicle.save();

      // 🔥 Realtime
      io.emit("vehicle_added", newVehicle);

      res.status(201).json({
        message: "Vehicle added successfully",
        vehicle: newVehicle,
      });
    } catch (error) {
      console.error("Error adding vehicle:", error);
      res.status(500).json({ message: "Server Error" });
    }
  });

  // ✅ GET ALL
  router.get("/all", async (req, res) => {
    try {
      const vehicles = await Vehicle.find().sort({ createdAt: -1 });
      res.status(200).json(vehicles);
    } catch (err) {
      console.error("Error fetching vehicles:", err);
      res.status(500).json({ message: "Error fetching vehicles" });
    }
  });

  // ✅ UPDATE STATUS
  router.patch("/status/:id", async (req, res) => {
    const { status } = req.body;

    if (!["approved", "pending", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    try {
      const updatedItem = await Vehicle.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true },
      );

      if (!updatedItem) {
        return res.status(404).json({ error: "Item not found" });
      }

      io.emit("vehicle_updated", updatedItem);

      res.json({ message: "Item status updated", item: updatedItem });
    } catch (err) {
      res.status(500).json({ error: "Failed to update item status" });
    }
  });

  return router;
};
