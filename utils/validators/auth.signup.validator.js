const Joi = require('joi')
const passwordComplexity = require('joi-password-complexity')

const authSignUpValidation = (body)=>{
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: passwordComplexity().required()
    })
    return schema.validate(body)
}

module.exports = authSignUpValidation