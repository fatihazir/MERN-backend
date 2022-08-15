const express = require('express')
const errorHandler = require('./middlewares/Error');
const dotenv = require('dotenv')
const morgan = require('morgan')
dotenv.config({ path: './config/config.env' })
const bootcampsRouter = require('./routes/BootcampsRoute')
const coursesRouter = require('./routes/CoursesRoute')
const reviewsRouter = require('./routes/ReviewsRoute')
const authRouter = require('./routes/AuthRoute')
const usersRouter = require('./routes/UsersRoute')
const ConnectDb = require('./config/db')
const colors = require('colors')
const fileUpload = require('express-fileupload')
const path = require('path')
var cookieParser = require('cookie-parser')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
var xss = require('xss-clean')
var hpp = require('hpp');
var rateLimit = require('express-rate-limit');
const cors = require('cors')

ConnectDb()

const app = express()

//security headers
app.use(helmet());

//Body parser
app.use(express.json())

//Cookie parser
app.use(cookieParser())

//Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// File upload
app.use(fileUpload())

//Sanitize data
app.use(mongoSanitize())

//prevent xss attacks
app.use(xss())

//Rate limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100
})
app.use(limiter)

//Prevent http param pollution
app.use(hpp())

//Enable cors
app.use(cors())

// Set static folder
app.use(express.static(path.join(__dirname, 'public')))

//Mount routers
app.use('/api/v1/bootcamps', bootcampsRouter)
app.use('/api/v1/courses', coursesRouter)
app.use('/api/v1/reviews', reviewsRouter)
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/auth/users', usersRouter)

//error handler must be after controller-routes etc
app.use(errorHandler)


const PORT = process.env.PORT || 5000
const server = app.listen(PORT, console.log(`Server is up and running for ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold))

process.on('unhandledRejection', (err, promise) => {
    console.log(`Unhandled rejection ${err.message}`.red.bold)
    server.close(() => { process.exit(1) })
})