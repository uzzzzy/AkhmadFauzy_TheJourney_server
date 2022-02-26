const fs = require('fs')
const { Op, fn, col } = require('sequelize')

const { models, handleImage, success, failed } = require('../functions/')

const { user: table, journey, bookmark } = models

exports.getUser = async (req, res) => {
    try {
        const { id } = req.params

        const query = {
            attributes: {
                exclude: ['password', 'createdAt', 'updatedAt'],
            },
            include: [
                {
                    model: bookmark,
                    attributes: ['journeyId'],
                },
                {
                    model: journey,
                    attributes: {
                        exclude: ['updatedAt'],
                    },
                    include: {
                        model: bookmark,
                        attributes: ['userId'],
                    },
                },
            ],
            order: [[{ model: journey }, 'createdAt', 'DESC']],
        }

        let user
        await table.findByPk(id, query).then((res) => {
            let temp = res
            temp.image = res.image
                ? handleImage(res.image, 'users')
                : 'http://localhost:5000/uploads/blankportrait.svg'
            user = temp
        })

        return success(res, { user })
    } catch (error) {
        return failed(res)
    }
}

exports.updateUser = async (req, res) => {
    try {
        const id = req.user.id
        let message = 'Data Updated'

        if (req.cdn) {
            let update = {}
            if (req.cdn.url) update.image = req.cdn.url.split('/').pop()

            await table.update(update, {
                where: {
                    id,
                },
            })
        } else message = 'No Data Updated'

        return success(res, { message })
    } catch (error) {
        console.log(error)
        return failed(res)
    }
}

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
        return failed(res)
    }
}
