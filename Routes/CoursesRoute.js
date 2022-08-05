const express = require('express')
const { GetCourses, GetCourse } = require('../controllers/CoursesController')

const router = express.Router({ mergeParams: true })

router.route('/')
    .get(GetCourses)

router.route('/:id')
    .get(GetCourse)

module.exports = router

