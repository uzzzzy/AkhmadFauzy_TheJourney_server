const { models, failed, success } = require('../functions')

const { comment: table } = models

exports.addComment = async (req, res) => {
    try {
        const userId = req.user.id
        const journeyId = req.params.id
        const comment = req.body.comment

        await table.create({
            userId,
            journeyId,
            comment,
        })

        success(res, {})
    } catch (error) {
        failed(res)
    }
}
