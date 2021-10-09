const { Op, fn, col } = require('sequelize')

const { models, success, failed, handleImage } = require('../functions/')

const { journey: table, user, bookmark, comment } = models

const jwt = require('jsonwebtoken')

exports.getJourneys = async (req, res) => {
    try {
        // Get Passed Query
        const { userId, createdAt, order, limit, offset, search } = req.query
        let user
        if (req.header('Authorization')) user = jwt.verify(req.header('Authorization').split(' ')[1], process.env.TOKEN_KEY)

        // Init Query
        let query = {
            distinct: true,
            attributes: {
                exclude: ['updatedAt'],
            },
        }
        if (user)
            query = {
                ...query,
                include: {
                    model: bookmark,
                    attributes: ['userId'],
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
        if (createdAt) {
            where = {
                ...where,
                createdAt: {
                    [Op.gt]: new Date(createdAt),
                },
            }
        }
        if (search)
            where = {
                ...where,
                [Op.or]: [
                    { title: { [Op.like]: '%' + search + '%' } },
                    {
                        description: { [Op.like]: '%' + search + '%' },
                    },
                ],
            }

        query = { ...query, where }

        const { count, rows } = await table.findAndCountAll(query)
        return success(res, {
            count: count,
            journeys: rows,
        })
    } catch (error) {
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
        include: [
            {
                model: user,
                attributes: ['id', 'fullName'],
            },
            {
                model: bookmark,
                attributes: ['userId'],
            },
            {
                model: comment,
                attributes: ['comment'],
                include: {
                    model: user,
                    attributes: ['id', 'fullName', 'image'],
                },
            },
        ],
    }

    try {
        let journey = await table.findByPk(id, query)

        journey.comments.forEach((item, i) => {
            journey.comments[i].user.image = item.user.image ? handleImage(item.user.image, 'users') : 'http://localhost:5000/uploads/blankportrait.svg'
        })

        await table.update(
            {
                seen: journey.seen + 1,
            },
            {
                groupBy: 'id',
                where: {
                    id: journey.id,
                },
            }
        )

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
