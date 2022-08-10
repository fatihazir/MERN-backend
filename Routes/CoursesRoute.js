const express = require('express')
const { GetCourses, GetCourse, CreateCourse, UpdateCourse, DeleteCourse } = require('../controllers/CoursesController')
const advancedResults = require('../middlewares/AdvancedResults')
const Course = require('../models/Course')

const { Protect } = require('../middlewares/Auth')

const router = express.Router({ mergeParams: true })

router.route('/')
    .get(advancedResults(Course, {
        path: 'bootcamp',
        select: 'name description'
    }), GetCourses)
    .post(Protect, CreateCourse);

router.route('/:id')
    .get(GetCourse)
    .put(Protect, UpdateCourse)
    .delete(Protect, DeleteCourse)

module.exports = router

