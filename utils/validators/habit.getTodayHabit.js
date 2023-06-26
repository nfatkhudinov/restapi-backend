const Joi = require('joi')
const passwordComplexity = require('joi-password-complexity')

const todayHabitValidation = (body)=>{
    const schema = Joi.object({
    })
    return schema.validate(body)
}

module.exports = todayHabitValidation