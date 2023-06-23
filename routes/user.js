const Router = require('express')
const router = Router()
const authMiddleware = require('../middleware/checkAuth')
const User = require('../models/user')
const UserTokens = require('../models/userToken')
const changePassportValidation = require("../utils/validators/user.changePassword.validator");
const bcrypt = require("bcrypt");

router.post('/getCurrentUserInfo', authMiddleware, async (req, res) => {
    try {
        const findUser = await User.findOne({_id: req.userId}, '-password')
        return res.json(findUser)

    } catch (e) {
        return res.status(500)
    }
})

router.post('/changePassword', authMiddleware, async (req, res) => {
    try {
        const {error} = changePassportValidation(req.body)
        if (error) return res.status(400).json({error: true, message: 'Validation error'})
        const findUser = await User.findOne({_id: req.userId})
        const verifyPassword = await bcrypt.compare(req.body.oldPassword, findUser.password)
        if (!verifyPassword) return res.status(400).json({error: true, message: 'Passwords compare error'})
        findUser.password = await bcrypt.hash(req.body.newPassword, Number(process.env.SALT))
        findUser.save()
        return res.json('Password changed')

    } catch (e) {
        return res.status(500)
    }
})

router.post('/getUserSessions', authMiddleware, async (req, res) => {
    try {
        const foundSessions = await UserTokens.find({userId: req.userId})
        return res.json({message: 'Found sessions:', sessions: foundSessions})
    } catch (e) {
        return res.status(500)
    }
})

router.post('/killUserSessionBySessionId', authMiddleware, async (req, res) => {
    try {
        await UserTokens.deleteOne({_id: req.body._id})
        return res.json({message: 'Session deleted'})
    } catch (e) {
        return res.status(500)
    }
})




module.exports = router