const cloudinary = require('../utils/cloudinary')

exports.sendImage = async (req, res, next) => {
    console.log(req.url.split('/'))
    const path = req.url.split('/')[1]
    const result = await cloudinary.uploader.upload(req.file.path, {
        folder: `/final/${path}s`,
    })

    req.cdn = result
    return next()
}
