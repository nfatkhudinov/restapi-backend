const Joi = require('joi')
const passwordComplexity = require('joi-password-complexity')

const changePassportValidation = (body)=>{
    const schema = Joi.object({
        oldPassword: Joi.string().required(),
        newPassword: passwordComplexity().required()
    })
    return schema.validate(body)
}

module.exports = changePassportValidation