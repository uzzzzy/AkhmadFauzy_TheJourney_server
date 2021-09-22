const { models, success, failed } = require('../functions/')

const { journey: table } = models

exports.getJourneys = async (req, res) => {
    try {
        // Get Passed Query
        const { userId, order, limit, offset, type } = req.query

        // Init Query
        let query = {
            distinct: true,
            attributes: {
                exclude: ['userId', 'createdAt', 'updatedAt'],
            },
        }

        // DB query config
        if (limit) query = { ...query, limit: parseInt(limit) }
        if (offset) query = { ...query, offset: parseInt(offset) }
        if (order) query = { ...query, order: [order.split(',')] }

        let where = {}

        if (userId)
            where = {
                ...where,
                userId,
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

exports.getJourney = async (req, res) => {
    const { id } = req.params
    let query = {
        distinct: true,
        attributes: {
            exclude: ['createdAt', 'updatedAt'],
        },
    }

    try {
        const journey = await table.findByPk(id, query)

        return success(res, journey)
    } catch (error) {
        return failed(res)
    }
}
