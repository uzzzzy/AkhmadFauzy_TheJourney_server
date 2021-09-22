exports.models = require('../../../models')
const Joi = require('joi')

// Validation
exports.formAuth = (body, opt) => {
    let validator = {
        email: Joi.string().email().min(6).required(),
        password: Joi.string().min(6).required(),
    }
    if (opt === 'register') {
        validator.fullName = Joi.string().min(1).required()
        validator.phone = Joi.string()
            .length(11)
            .pattern(/^[0-9]+$/)
            .required()
    }

    return validCheck(body, validator)
}

const validCheck = (body, validator) => {
    const schema = Joi.object(validator)

    const { error } = schema.validate(body)

    return error ? error : null
}

// Response To Client

exports.failed = (res, message, status) => {
    const responseCode = status ? status : 500
    const responseMessage = message ? message : 'Server Error'

    return res.status(responseCode).send({
        status: 'failed',
        message: responseMessage,
    })
}

exports.success = (res, data, status) => {
    const responseCode = status ? status : 200
    let responseData = data
        ? {
              message: 'success',
              data: data,
          }
        : []

    if (data.custom) responseData = data.custom

    return res.status(responseCode).send(responseData)
}
