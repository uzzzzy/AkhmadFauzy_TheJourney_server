const fs = require('fs')

exports.images = async (req, res) => {
    return res.send({ link: 'http://localhost:5000/uploads/images/' + req.file.filename })
}

exports.deleteImage = async (req, res) => {
    const query = req.body

    const uri = query.link.split('/')

    fs.unlink(`./uploads/${uri[4]}/${uri[5]}`, (err) => {
        if (err) {
            console.error(err)
        }
    })

    res.send({
        message: 'deleted',
    })
}
