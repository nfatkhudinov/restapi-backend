const Router = require("express")
const authSignUpValidation = require("../utils/validators/auth.signup.validator");
const router = Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const authLoginValidation = require("../utils/validators/auth.login.validator");
const generateAccessToken = require("../utils/tokenGenerators/auth.accessToken.generator");
const generateRefreshToken = require("../utils/tokenGenerators/auth.refreshToken.generator");
const UserToken = require('../models/userToken')
const authRefreshTokenValidation = require("../utils/validators/auth.refreshToken.validator");
const authLogoutValidation = require("../utils/validators/auth.logout.validator");

router.post('/signup', async (req,res)=>{
    try{
        const {error} = authSignUpValidation(req.body)
        if (error) return res.status(400).json({error: true, message: error.details[0].message})   //Validation check
        const existUser = await User.findOne({email: req.body.email})
        if (existUser) return res.status(400).json({error: true, message: `user ${req.body.email} already exists`}) //Check for existing user with same email in DB
        const hashedPassword = await bcrypt.hash(req.body.password, Number(process.env.SALT)) //Hash incoming password
        await new User({email: req.body.email, password: hashedPassword}).save()


        return res.json({
            message: 'New user created',
            username: req.body.email,
        })
    }
    catch (e) {
        return res.status(500)
    }
})

router.post('/login', async (req,res)=>{
    console.log('Login tryout...')
    try{
        const {error} = authLoginValidation(req.body)
        if (error) return res.status(400).json({error: true, message: error.details[0].message})   //Validation check
        const foundUser = await User.findOne({email: req.body.email})
        if (!foundUser) return res.status(400).json({error: true, message: `User ${req.body.email} does not exists`})
        const verifyPassword = await bcrypt.compare(req.body.password, foundUser.password)
        if (!verifyPassword) return res.status(400).json({error: true, message: `Wrong password requested`})


        /** GENERATE TOKENS **/
        const accessToken = generateAccessToken(foundUser._id)
        const refreshToken = generateRefreshToken(foundUser._id)

        /** WRITE REFRESH TOKEN INFO TO DATABASE **/
        const newRefreshTokenInfo = await new UserToken({
            userId: foundUser._id,
            refreshToken: refreshToken,
            device: req.get('User-Agent'),
            ip: req.ip,
        })
        newRefreshTokenInfo.save()

        return res.json({
            message: 'Login successful',
            accessToken: accessToken,
            refreshToken: refreshToken,
            userId: foundUser._id
        })
    }
    catch (e) {
        return res.status(500)
    }
})

router.post('/refresh', async (req, res) => {
    try {
        console.log('REQUESTED REFRESH LOGIN', req.body)
        const {error} = authRefreshTokenValidation(req.body)
        if (error) return res.status(400).json({error: true, message: error.details[0].message})   //Validation check
        const foundRefreshTokenInfo = await UserToken.findOne({refreshToken: `${req.body.refreshToken}`})
        console.log('FOUND REFRESH', foundRefreshTokenInfo)
        if (!foundRefreshTokenInfo) {
            return res.status(400).json({error: true, message: 'Refresh token not found'})
        } else {
            const newRefreshToken = generateRefreshToken(foundRefreshTokenInfo.userId)
            foundRefreshTokenInfo.refreshToken = newRefreshToken
            await foundRefreshTokenInfo.save()
            const newAccessToken = generateAccessToken(foundRefreshTokenInfo.userId)
            return res.json({
                message: 'New Token pair generated',
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
            })
        }
    } catch (e) {
        return res.status(500)
    }
})

router.post('/logout', async (req,res)=>{
    try{
        const {error} = authLogoutValidation(req.body)
        if (error) return res.status(400).json({error: true, message: error.details[0].message})   //Validation check
        await UserToken.deleteOne({refreshToken: req.body.refreshToken})
        return res.status(200).json({message: 'User deleted session'})
    }
    catch (e) {
        return res.status(500)
    }

})

module.exports = router