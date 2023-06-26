const Joi = require('joi')
const passwordComplexity = require('joi-password-complexity')

const makeNewHabitValidation = (body)=>{
    const schema = Joi.object({
        name: Joi.string(),
        startDate: Joi.string(),
        expDate: Joi.string(),
        taskLength: Joi.number(),
    })
    return schema.validate(body)
}

module.exports = makeNewHabitValidation