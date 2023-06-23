const db = require('mongoose').default
const Schema = db.Schema

const userTokenSchema = new Schema(
    {
        userId:{
            type: Schema.Types.ObjectId,
            required: true,
        },
        refreshToken:{
            type: String,
            required: true,
        },
        device:{
            type: String,
            required: true,
        },
        ip: {
            type:String,
            required: true,
        },
        createdAt:{
            type: Date,
            default: Date.now(),
            expires: 30*86400 // 30 days
        }
    }
)

const UserToken = db.model('UserToken', userTokenSchema)

module.exports = UserToken