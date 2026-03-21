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
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: async (req, file) => {
//     const isPDF = file.mimetype === "application/pdf";

//     return {
//       folder: "uploads",
//       resource_type: isPDF ? "raw" : "image",
//     };
//   },
// });
const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    let resource_type = "image"; // default

    const pdfTypes = ["application/pdf"];
    if (pdfTypes.includes(file.mimetype.toLowerCase())) {
      resource_type = "raw"; // PDF -> raw
    }

    return {
      folder: "uploads", // folder in Cloudinary
      resource_type, // image or raw
      format: file.originalname.split(".").pop().toLowerCase(), // correct format
    };
  },
});

// 🔥 multer instance
const upload = multer({ storage });

module.exports = upload;
