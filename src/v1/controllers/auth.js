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
        let result = {}

        await table
            .findByPk(req.user.id, {
                attributes: ['email', 'fullName', 'image', 'status', 'address'],
            })
            .then((res) => {
                let temp = res

                temp = { ...temp, image: 'https://www.pixsy.com/wp-content/uploads/2021/04/edi-libedinsky-1bhp9zBPHVE-unsplash-1-1024x683.jpeg' }

                result = {
                    email: res.email,
                    fullName: res.fullName,
                    image: 'https://www.pixsy.com/wp-content/uploads/2021/04/edi-libedinsky-1bhp9zBPHVE-unsplash-1-1024x683.jpeg',
                    status: res.status,
                    address: res.address,
                }
            })
        // else result.image = 'https://www.pixsy.com/wp-content/uploads/2021/04/edi-libedinsky-1bhp9zBPHVE-unsplash-1-1024x683.jpeg'

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
