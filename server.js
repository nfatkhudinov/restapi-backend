const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const colors = require('colors')
const dbConnection = require('./db')
require('dotenv').config()
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const habitRoutes = require('./routes/habit')

/** Configuring CORS **/
const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions)) //CORS enabled for all routes

app.use(bodyParser.json()) //JSON syntax analyzer for all routes

/** Routes **/

app.use("/api", authRoutes)
app.use("/api/user", userRoutes)
app.use("/api/habit", habitRoutes)

/** Connecting to database and starting listening port **/
const listenToPort = ()=>{
    app.listen(process.env.SERVER_PORT, process.env.SERVER_IP)
}

dbConnection()
    .then(()=>listenToPort())
    .then(()=>console.log(`SERVER STARTED AT PORT ${process.env.SERVER_PORT}`.bgGreen.white))

