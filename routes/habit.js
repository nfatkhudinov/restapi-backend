const Router = require('express')
const router = Router()
const authMiddleware = require('../middleware/checkAuth')
const User = require('../models/user')
const UserTokens = require('../models/userToken')
const changePassportValidation = require("../utils/validators/user.changePassword.validator");
const bcrypt = require("bcrypt");
const Habit = require("../models/habit");
const makeNewHabitValidation = require("../utils/validators/habit.makeNewHabit");
const deleteHabitValidation = require("../utils/validators/habit.deleteHabit");
const customParseFormat = require('dayjs/plugin/customParseFormat');
const dayjs = require("dayjs");

router.post('/makeNewHabit', authMiddleware, async (req, res) => {

    try {
        const {error} = makeNewHabitValidation(req.body)
        if (error) return res.status(400).json({error: true, message: 'Validation error', errorTip: error})


        const createDaysArray = () =>{
            dayjs.extend(customParseFormat)
            const beginDate = dayjs(req.body.startDate, 'DD.MM.YYYY')
            let daysArray = []
            for (let i=0; i<=req.body.taskLength; i++){
                daysArray.push({date: beginDate.add(i, 'day').format('DD.MM.YYYY'),
                                completed: false})
            }
            return daysArray
        }

        const newHabit = await new Habit({
            userId: req.userId,
            name: req.body.name,
            startDate: req.body.startDate,
            expDate: req.body.expDate,
            taskLength: req.body.taskLength,
            isCompleted: false,
            daysArray: createDaysArray()
        }).save()
        return res.status(200).json({message: 'New task created', task: newHabit, user: req.userId})

    } catch (e) {
        return res.status(500)
    }
})
router.post('/getActiveHabits', authMiddleware, async (req, res) => {
    try {
        const findTasks = await Habit.find({userId: req.userId})
        return res.status(200).json({tasks: findTasks})

    } catch (e) {
        return res.status(500)
    }
})

router.post('/getTodayHabits', authMiddleware, async (req, res) => {
    try {
        const userHabits = await Habit.find({userId: req.userId})
        const todayHabits = userHabits.map(i=>{
            if (i.daysArray.find(i=>i.date===dayjs().format('DD.MM.YYYY'))){
                return i
            }
        })
        return res.status(200).json({habits: todayHabits})

    } catch (e) {
        return res.status(500)
    }
})

router.post('/deleteHabit', authMiddleware, async (req, res) => {
    try {
        const {error} = deleteHabitValidation(req.body)
        if (error) return res.status(400).json({error: true, message: 'Validation error', errorTip: error})
        const q = await Habit.deleteOne({_id: req.body.id})
        return res.json({message: 'Deleted', res: q})

    } catch (e) {
        return res.status(500)
    }
})

router.post('/setTodayCompleted', authMiddleware, async (req, res) => {
    try {
        const q = await Habit.findOne({_id: req.body.id})
        q.daysArray = q.daysArray.map(i=>{
            if (i.date===dayjs().format('DD.MM.YYYY')){
                i.completed=true
            }
            return i
        })
        q.save()

        console.log(q.daysArray)
        await Habit.updateOne({_id: req.body.id}, { $set: {daysArray:q.daysArray}})
        return res.json({message: 'test', res: q})

    } catch (e) {
        return res.status(500)
    }
})


module.exports = router