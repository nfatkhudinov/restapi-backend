const Joi = require('joi')
const passwordComplexity = require('joi-password-complexity')

const authRefreshTokenValidation = (body)=>{
    const schema = Joi.object({
        refreshToken: Joi.string().required(),
    })
    return schema.validate(body)
}

module.exports = authRefreshTokenValidation