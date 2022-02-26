const cloudinary = require('cloudinary').v2
const config = require(__dirname + '/../../../config/cloudinary.js')

cloudinary.config(config)

module.exports = cloudinary
