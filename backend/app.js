require('dotenv').config()
require('express-async-errors')

const express = require('express')
const cors = require('cors')
const app = express()
const mongoose = require('mongoose')



const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')

const bloglistsRouter = require('./controllers/bloglists')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')


logger.info('connecting to: ', config.MONGODB_URI, "from app")
mongoose.connect(config.MONGODB_URI)
    .then( ()=> {
        logger.info('connected to mongoDB')
    })
    .catch( (error)=> {
        logger.info('error connecting to mongoDB: ', error.message)
    })


app.use(express.json()) //JSON-Parse middleware should always be in the front!
app.use(cors())

app.use(middleware.tokenExtractor)
app.use(middleware.userExtractor)

app.use('/api/bloglists',bloglistsRouter)
app.use('/api/users',usersRouter)
app.use('/api/login', loginRouter)


app.use(middleware.unknownEndPoint)
app.use(middleware.errorHandler)


module.exports = app
