const fs = require('fs')
const { models, handleImage, failed, success } = require('../functions')

const { image: table } = models

exports.getImages = async (req, res) => {
    let result = []

    await table
        .findAll({
            order: [['createdAt', 'desc']],
            where: {
                userId: req.user.id,
            },
        })
        .then((res) => {
            res.forEach((item) =>
                result.push({
                    url: handleImage(item.imageName, 'images'),
                })
            )
        })

    res.send(result)
}

exports.addImage = async (req, res) => {
    await table.create({
        imageName: req.cdn.url.split('/').pop(),
        userId: req.user.id,
    })

    return res.send({
        link: handleImage(req.cdn.url.split('/').pop(), 'images'),
    })
}

exports.deleteImage = async (req, res) => {
    try {
        const uri = req.body.src.split('/')

        await table
            .destroy({
                where: {
                    userId: req.user.id,
                    imageName: uri[5],
                },
            })
            .then(
                (res) =>
                    res === 1 &&
                    fs.unlink(`./uploads/${uri[4]}/${uri[5]}`, (err) => {
                        if (err) {
                            console.error(err)
                        }
                    })
            )

        return success(res, { message: 'deleted' })
    } catch (error) {
        return failed(res)
    }
}
