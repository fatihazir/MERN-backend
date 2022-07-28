const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')

const bootcampsRouter = require('./routes/BootcampsRoute')
const Logger = require('./middlewares/Logger')

//load env vars
dotenv.config({ path: './config/config.env' })

const app = express()

//Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

//Mount routers
app.use('/api/v1/bootcamps', bootcampsRouter)


const PORT = process.env.PORT || 5000
app.listen(PORT, console.log(`Server is up and running for ${process.env.NODE_ENV} mode on port ${PORT}`))