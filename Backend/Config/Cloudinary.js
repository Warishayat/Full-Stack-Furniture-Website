const cloudinary = require("cloudinary").v2
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API,
  api_secret: process.env.CLOUDINARY_SECRET,
  timeout: 600000 // 10 minutes timeout for bulk/large image uploads
})
module.exports = cloudinary;