const multer = require("multer")
const { CloudinaryStorage } = require("multer-storage-cloudinary")
const cloudinary = require("../Config/Cloudinary")
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Furniture_Media",
    allowed_formats: ["jpg", "png", "jpeg", "webp", "mp4", "mov", "webm"],
    resource_type: "auto",
  }
})
const upload = multer({ 
  storage,
  limits: {
    fieldSize: 50 * 1024 * 1024,
    fileSize: 50 * 1024 * 1024,
  }
});
module.exports =upload;