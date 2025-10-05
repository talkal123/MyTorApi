// cloudinaryConfig.js
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY_CLOUDINARY,
  api_secret: process.env.API_KEY_CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: { folder: "userPhotos" },
});

const upload = multer({ storage });

module.exports = { upload }; // חייב להיות בשם upload
