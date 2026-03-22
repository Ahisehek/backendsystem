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

    const isPDF = file.mimetype === "application/pdf";

    return {
      folder,
      resource_type: "auto",
      public_id: `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`,
    };
  },
});

const upload = multer({
  storage,

  // ✅ file size limit (5MB)
  limits: { fileSize: 5 * 1024 * 1024 },

  // ✅ file type validation
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype.startsWith("image/") ||
      file.mimetype === "application/pdf"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only images and PDFs allowed"), false);
    }
  },
});

module.exports = upload;
