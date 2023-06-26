const Joi = require('joi')
const passwordComplexity = require('joi-password-complexity')

const deleteHabitValidation = (body)=>{
    const schema = Joi.object({
        id: Joi.string(),
    })
    return schema.validate(body)
}

module.exports = deleteHabitValidation