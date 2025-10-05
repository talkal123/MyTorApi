const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// קונפיג של Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY_CLOUDINARY,
  api_secret: process.env.API_KEY_CLOUDINARY_SECRET,
});

// MulterStorage מקבל instance מקומי בלבד
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: { folder: "userPhotos" }
});

// multer עם storage
const upload = multer({ storage });

module.exports = { upload }; // מייצא רק upload
