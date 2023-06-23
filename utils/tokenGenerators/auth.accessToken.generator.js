const jwt = require('jsonwebtoken')
const UserRefreshToken = require('../../models/userToken')

const generateAccessToken = (id) =>{
    const payload = {_id: id}
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '5s'})
}

module.exports = generateAccessToken