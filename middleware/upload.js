// const multer = require("multer");
// const { CloudinaryStorage } = require("multer-storage-cloudinary");
// const cloudinary = require("../config/cloudinary");

// //🔥 storage define
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: "uploads",
//     resource_type: "auto",
//   },
// });

// // 🔥 multer instance
// const upload = multer({ storage });
// module.exports = upload;

const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    let folder = "uploads/default";

    if (req.originalUrl.includes("/vendor")) {
      folder = "uploads/vendorPics";
    } else if (req.originalUrl.includes("/vehicle")) {
      folder = "uploads/vehiclePics";
    } else if (req.originalUrl.includes("/ticket")) {
      folder = "uploads/ticketPics";
    }

    const originalName = file.originalname.replace(/\s+/g, "-");

    // ✅ FIX: detect PDF properly
    const isPDF = file.mimetype === "application/pdf";

    return {
      folder,
      resource_type: isPDF ? "raw" : "image", // ✅ now safe
      type: "upload",
      public_id: Date.now().toString(),
      filename_override: originalName,
    };
  },
});

const upload = multer({ storage });

module.exports = upload;
