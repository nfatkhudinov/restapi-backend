const db = require('mongoose').default
const colors = require('colors')
const dbConnection = async ()=>{
    try{
        console.log('Trying to establish connection to database...')
        await db.connect(`mongodb://${process.env.DATABASE_IP}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`)
        console.log('Connection to database established'.bgGreen.white)
    }
    catch (e) {
        console.log('DATABASE CONNECTION ERROR'.bgRed.white, e)
    }
}

module.exports = dbConnection