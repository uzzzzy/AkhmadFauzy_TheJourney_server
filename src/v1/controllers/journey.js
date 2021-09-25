const { Op } = require('sequelize')

const { models, success, failed } = require('../functions/')

const { journey: table, user } = models

exports.getJourneys = async (req, res) => {
    try {
        // Get Passed Query
        const { userId, order, limit, offset, type, search } = req.query
        console.log(req.header('Authorization'))
        // Init Query
        let query = {
            distinct: true,
            attributes: {
                exclude: ['updatedAt'],
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
        if (search)
            where = {
                [Op.or]: [
                    { title: { [Op.like]: '%' + search + '%' } },
                    {
                        description: { [Op.like]: '%' + search + '%' },
                    },
                ],
            }

        query = { ...query, where }

        if (type === 'count') {
            const count = await table.count(query)
            return success(res, { count })
        } else {
            const { count, rows } = await table.findAndCountAll(query)
            return success(res, {
                count: count,
                journeys: rows,
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
            exclude: ['updatedAt'],
        },
        include: {
            model: user,
            attributes: ['fullName'],
        },
    }

    try {
        const journey = await table.findByPk(id, query)

        await table.update(
            {
                seen: journey.seen + 1,
            },
            {
                where: {
                    id: journey.id,
                },
            }
        )
        console.log(journey.seen)

        return success(res, journey)
    } catch (error) {
        return failed(res)
    }
}

exports.addJourney = async (req, res) => {
    try {
        const data = req.body
        data.userId = req.user.id

        const result = await table.create(data)
        return res.send({
            message: 'success',
            result,
        })
    } catch (error) {
        return failed(res)
    }
}
