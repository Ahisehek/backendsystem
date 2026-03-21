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

const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// 🔥 storage define
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads", // folder name in cloudinary
    resource_type: "auto", // pdf + image dono support
  },
});

// 🔥 multer instance
const upload = multer({ storage });

module.exports = upload;
