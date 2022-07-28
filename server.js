const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
dotenv.config({ path: './config/config.env' })
const bootcampsRouter = require('./routes/BootcampsRoute')
const ConnectDb = require('./config/db')

ConnectDb()

const app = express()

//Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

//Mount routers
app.use('/api/v1/bootcamps', bootcampsRouter)


const PORT = process.env.PORT || 5000
const server = app.listen(PORT, console.log(`Server is up and running for ${process.env.NODE_ENV} mode on port ${PORT}`))

process.on('unhandledRejection', (err, promise) => {
    console.log("unhandled rejection : ", err.message)
    server.close(() => { process.exit(1) })
})