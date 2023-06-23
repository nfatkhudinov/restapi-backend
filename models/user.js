const db = require('mongoose').default
const {Schema} = require("mongoose");
const schema = db.Schema

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        name: {
            type: String,
        },
        avatarLink: {
            type: String,
        },
    }
)

const User = db.model('User', userSchema)

module.exports = User