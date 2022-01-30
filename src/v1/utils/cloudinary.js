const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: 'yzua-cdn',
    api_key: '986771626779539',
    api_secret: 'lhWl3SCHr2aFnKLHe-Qs3x4PLLM',
})

module.exports = cloudinary
