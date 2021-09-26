const { models, success, failed } = require('../functions/')

const { bookmark: table } = models

exports.addBookmark = async (req, res) => {
    try {
        await table.create({
            userId: req.user.id,
            journeyId: req.body.id,
        })

        return success(res, { message: 'success' })
    } catch (error) {
        return failed(res)
    }
}

exports.deleteBookmark = async (req, res) => {
    try {
        await table.destroy({
            where: {
                userId: req.user.id,
                journeyId: req.params.id,
            },
        })

        return success(res, { message: 'success' })
    } catch (error) {
        console.log(error)
        return failed(res)
    }
}
