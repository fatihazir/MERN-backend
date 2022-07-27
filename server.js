const express = require('express')
const dotenv = require('dotenv')

const bootcampsRouter = require('./Routes/BootcampsRoute')

//load env vars
dotenv.config({ path: './config/config.env' })

const app = express()

app.use('/api/v1/bootcamps', bootcampsRouter)


const PORT = process.env.PORT || 5000
app.listen(PORT, console.log(`Server is up and running for ${process.env.NODE_ENV} mode on port ${PORT}`))