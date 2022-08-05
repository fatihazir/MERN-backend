const ErrorResponse = require('../utils/errorResponse')
const Course = require('../models/Course')
const asyncHandler = require('../middlewares/Async')

// @desc Get All Courses
// @route Get /api/v1/courses
// @route Get /api/v1/bootcamps/:bootcampId/courses
// @access Public
exports.GetCourses = asyncHandler(async (req, res, next) => {
    let query;
    if (req.params.bootcampId) {
        query = Course.find({ bootcamp: req.params.bootcampId })
    } else {
        //returns both course and bootcamp data
        // query = Course.find().populate('bootcamp')

        //returns course data and only name and desc of related bootcamp
        query = Course.find().populate({
            path: 'bootcamp',
            select: 'name description'
        })
    }

    let courses = await query;

    res.status(200).json({
        success: true,
        count: courses.length,
        data: courses,
    })
})