const db = require('mongoose')
const Schema  = db.Schema

const habitSchema = new Schema(
    {
        userId: {
            type: Number,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        expDate: {
            type: Date,
            required: true,
        },
        completeDates: {
            type: [Date]
        }
    }
)

const Habit = db.model('Habit', habitSchema)

module.exports = Habit