const express = require('express')
const { GetCourses, GetCourse, CreateCourse, UpdateCourse, DeleteCourse } = require('../controllers/CoursesController')

const router = express.Router({ mergeParams: true })

router.route('/')
    .get(GetCourses)
    .post(CreateCourse);

router.route('/:id')
    .get(GetCourse)
    .put(UpdateCourse)
    .delete(DeleteCourse)

module.exports = router

