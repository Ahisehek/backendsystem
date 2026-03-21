// const multer = require("multer");
// const fs = require("fs");
// const path = require("path");

// // Configure storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     let folder;

//     // Customize folder based on route
//     if (req.originalUrl.includes("/vender")) {
//       folder = "uploads/vendorPics";
//     } else if (req.originalUrl.includes("/vehicle")) {
//       folder = "uploads/vehiclePics";
//     } else if (req.originalUrl.includes("/ticket")) {
//       folder = "uploads/ticketPics";
//     } else {
//       folder = "uploads/default"; // ✅ Fixed here
//     }

//     // Create the folder if it doesn't exist
//     if (!fs.existsSync(folder)) {
//       fs.mkdirSync(folder, { recursive: true });
//     }

//     cb(null, folder);
//   },

//   filename: (req, file, cb) => {
//     // Sanitize filename
//     const cleanOriginalName = file.originalname.replace(/\s+/g, "-");
//     const uniqueName = `${Date.now()}-${cleanOriginalName}`;
//     cb(null, uniqueName);
//   },
// });

// const upload = multer({ storage });

// module.exports = upload;

import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "erp_uploads", // sab ek folder me
      resource_type: "auto", // image + pdf
      public_id: Date.now() + "-" + file.originalname,
    };
  },
});

const upload = multer({ storage });

export default upload;
