const fs = require('fs')
const mongoose = require('mongoose')
const colors = require('colors')
const dotenv = require('dotenv')

dotenv.config({ path: './config/config.env' })

// Load models
const Bootcamp = require('./models/Bootcamp')
const Course = require('./models/Course')
const Review = require('./models/Review')
const User = require('./models/User')

// Connect to db
mongoose.connect(process.env.MONGO_URI);

// Read JSON files
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'))
const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8'))
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/_data/reviews.json`, 'utf-8'))
const users = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8'))

// Import into db
// node seeder -i
const importData = async () => {
    try {
        await User.create(users)
        await Bootcamp.create(bootcamps)
        await Course.create(courses)
        await Review.create(reviews)
        console.log("Data imported as seed mode.".green.inverse)
        process.exit()
    } catch (error) {
        console.log("Data seed importing error : ", error)
    }
}

// Delete data
// node seeder -d
const deleteData = async () => {
    try {
        await Bootcamp.deleteMany()
        await Course.deleteMany()
        await Review.deleteMany()
        await User.deleteMany()
        console.log("Data destroyed.".red.inverse)
        process.exit()
    } catch (error) {
        console.log("Data deleting error : ", error)
    }
}

if (process.argv[2] === '-i') {
    importData()
} else if (process.argv[2] === '-d') {
    deleteData()
}

