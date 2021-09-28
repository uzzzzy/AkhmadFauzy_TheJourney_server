const { models, success, failed } = require('../functions/')

const { bookmark: table, journey, bookmark } = models

exports.getBookmarks = async (req, res) => {
    const { count, rows: bookmarks } = await table.findAndCountAll({
        attributes: ['id'],
        where: {
            userId: req.user.id,
        },
        distinct: true,
        include: {
            model: journey,
            attributes: {
                exclude: ['userId', 'updatedAt'],
            },
            include: [
                {
                    model: bookmark,
                    attributes: ['userId'],
                },
            ],
        },
    })

    return success(res, { count, bookmarks })
}

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
