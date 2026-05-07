const multer = require("multer")
const { CloudinaryStorage } = require("multer-storage-cloudinary")
const cloudinary = require("../Config/Cloudinary")
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params:{
    folder:"Furniture_Media",
    allowed_formats:["jpg","png","jpeg","webp"]
  }
})
const upload = multer({ storage })
module.exports =upload;