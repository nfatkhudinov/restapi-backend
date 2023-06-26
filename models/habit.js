const db = require('mongoose')
const {number, string, bool, boolean} = require("joi");
const Schema  = db.Schema

const habitSchema = new Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        startDate: {
            type: String,
            required: true,
        },
        expDate: {
            type: String,
            required: true,
        },
        taskLength: {
            type: Number,
            required: true,
        },
        isCompleted:{
            type: Boolean,
            required: true
        },
        daysArray:{
            type: [],
            required: true,
        }
    }
)

const Habit = db.model('Habit', habitSchema)

module.exports = Habit