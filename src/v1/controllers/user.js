const { models, success, failed } = require('../functions/')

const { user: table, journey } = models

exports.getJourneys = async (req, res) => {
    try {
        const { status, title, order, limit, offset, type } = req.query

        let query = {
            distinct: true,
            attributes: {
                exclude: ['createdAt', 'updatedAt'],
            },
            include: {
                model: journey,
            },
        }

        if (limit) query = { ...query, limit: parseInt(limit) }
        if (offset) query = { ...query, offset: parseInt(offset) }
        if (order) query = { ...query, order: [order.split(',')] }

        let where = {}

        if (status) where = { ...where, status }
        if (title)
            where = {
                ...where,
                title: {
                    [Op.substring]: title,
                },
            }

        query = { ...query, where }

        if (type === 'count') {
            const count = await table.count(query)
            return success(res, { count })
        } else {
            const { count, rows } = await table.findAndCountAll(query)
            return success(res, {
                count: count,
                products: rows,
            })
        }
    } catch (error) {
        console.log(error)
        return failed(res)
    }
}
