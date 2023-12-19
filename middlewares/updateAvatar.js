const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const { _id } = req.user;
    const folder = "avatars";
    const filename = `${_id}_${file.originalname}`;
    const withoutFileExtension = filename.split(".")[0];
    return {
      folder: folder,
      allowed_formats: ["jpg", "png"],
      public_id: withoutFileExtension,
    };
  },
});

const updateAvatar = multer({ storage });

module.exports = updateAvatar;
