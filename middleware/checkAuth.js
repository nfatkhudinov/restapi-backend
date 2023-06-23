const jwt = require('jsonwebtoken')
const {verify} = require("jsonwebtoken");

const authMiddleware = async(req, res, next)=>{
    console.log(req.headers)
    const authHeader = req.headers.authorization
    if (authHeader) {
        const authType = authHeader.slice(0, authHeader.indexOf(' '))
        const authToken = authHeader.slice(authHeader.indexOf(' ') + 1)
        console.log(authToken)
        if (authType !== 'Bearer') return res.status(400).json({error: true, message: 'bearer error'})
        try {
            const tokenDetails = jwt.verify(authToken, process.env.ACCESS_TOKEN_SECRET)
            req.userId = tokenDetails._id
            next()
        } catch (e) {
            return res.status(401).json({error: true, message: 'Token validation error'})
        }
    }
    else return res.status(400).json({error: true, message: 'No bearer', authHeader})
}

module.exports = authMiddleware