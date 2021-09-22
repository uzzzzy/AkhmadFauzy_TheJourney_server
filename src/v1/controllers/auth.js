const { models, success, failed, formAuth } = require('../functions/')

const { user: table } = models

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.login = async (req, res) => {
    try {
        const error = formAuth(req.body)

        if (error) return failed(res, error.details[0].message, 400)

        const userExist = await table.findOne({
            where: {
                email: req.body.email,
            },
        })

        if (!userExist) return failed(res, 'user not found', 400)

        const isValid = await bcrypt.compare(req.body.password, userExist.password)

        if (!isValid) return failed(res, 'credential is invalid', 400)

        const token = jwt.sign(
            {
                id: userExist.id,
                role: userExist.status,
            },
            process.env.TOKEN_KEY
        )

        return success(res, {
            custom: {
                message: 'success',
                username: userExist.email,
                token,
            },
        })
    } catch (error) {
        return failed(res)
    }
}

exports.register = async (req, res) => {
    try {
        const error = formAuth(req.body, 'register')

        if (error) return failed(res, error.details[0].message, 400)

        const userExist = await table.findOne({
            where: {
                email: req.body.email,
            },
        })

        if (userExist) return failed(res, 'User Already Registered', 400)

        const salt = await bcrypt.genSalt(10)

        const hashedPassword = await bcrypt.hash(req.body.password, salt)

        const newUser = await table.create({
            fullName: req.body.fullName,
            email: req.body.email,
            password: hashedPassword,
            phone: req.body.phone,
            status: 'user',
        })

        const token = jwt.sign(
            {
                id: newUser.id,
                role: newUser.status,
            },
            process.env.TOKEN_KEY
        )

        return success(res, {
            custom: {
                message: 'success',
                token,
            },
        })
    } catch (error) {
        console.log(error)
        return failed(res)
    }
}

exports.verifyToken = async (req, res) => {
    try {
        const result = await table.findByPk(req.user.id, {
            attributes: ['email', 'fullName', 'image', 'status'],
        })

        // if (result.status === 'customer') result.image = result.image ? 'http://localhost:5000/uploads/users/' + result.image : 'http://localhost:5000/uploads/profile.jpg'
        // else result.image = 'http://localhost:5000/uploads/admin.jpg'

        res.send({
            status: 'succes',
            data: {
                user: result,
            },
        })
    } catch (error) {
        console.log(error)
        return failed(res)
    }
}
