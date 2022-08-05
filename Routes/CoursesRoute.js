const express = require('express')
const { GetCourses } = require('../controllers/CoursesController')

const router = express.Router({ mergeParams: true })

router.route('/')
    .get(GetCourses)

module.exports = router

