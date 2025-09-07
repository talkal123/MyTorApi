const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: "dwzs8l6ta",
  api_key: "584758399419148",
  api_secret: "ZwtTWwm3SHH5bY3o6Y12NVWbGXs",
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "userPhotos",
    // allowed_formats: "auto",
  },
});

const upload = multer({ storage });

module.exports = { upload, cloudinary };
