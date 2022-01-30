const cloudinary = require('../utils/cloudinary')

exports.sendImage = async (req, res, next) => {
    console.log(req)
    const result = await cloudinary.uploader.upload(req.file.path, {
        folder: '/final/users',
    })

    req.cdn = result
    return next()
}
