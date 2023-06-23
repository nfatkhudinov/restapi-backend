const jwt = require('jsonwebtoken')
const UserRefreshToken = require('../../models/userToken')

const generateRefreshToken = (id) =>{
    const payload = {_id: id}
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '30d'})
}

module.exports = generateRefreshToken