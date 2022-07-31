const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
dotenv.config({ path: './config/config.env' })
const bootcampsRouter = require('./routes/BootcampsRoute')
const ConnectDb = require('./config/db')
const colors = require('colors')

ConnectDb()

const app = express()

//Body parser
app.use(express.json())

//Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

//Mount routers
app.use('/api/v1/bootcamps', bootcampsRouter)


const PORT = process.env.PORT || 5000
const server = app.listen(PORT, console.log(`Server is up and running for ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold))

process.on('unhandledRejection', (err, promise) => {
    console.log(`Unhandled rejection ${err.message}`.red.bold)
    server.close(() => { process.exit(1) })
})