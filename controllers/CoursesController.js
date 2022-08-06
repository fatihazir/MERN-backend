const ErrorResponse = require('../utils/errorResponse')
const Course = require('../models/Course')
const Bootcamp = require('../models/Bootcamp')
const asyncHandler = require('../middlewares/Async')

// @desc Get All Courses
// @route Get /api/v1/courses
// @route Get /api/v1/bootcamps/:bootcampId/courses
// @access Public
exports.GetCourses = asyncHandler(async (req, res, next) => {
    if (req.params.bootcampId) {
        const courses = await Course.find({ bootcamp: req.params.bootcampId })
        return res.status(200).json({
            success: true,
            count: courses.length,
            data: courses,
        })
    } else {
        res.status(200).json(res.advancedResults)
    }

})

// @desc Get course
// @route Get /api/v1/courses/:id
// @access Public
exports.GetCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    })

    if (!course) {
        //correctly formatted object id
        return next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404))
    }

    res.status(200).json({
        success: true,
        data: course
    })
})

// @desc Create new course
// @route Post /api/v1/bootcamps/:boorcampId/courses
// @access Private
exports.CreateCourse = asyncHandler(async (req, res, next) => {
    req.body.bootcamp = req.params.bootcampId

    const bootcamp = await Bootcamp.findById(req.params.bootcampId)

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.bootcampId}`, 404))
    }

    const course = await Course.create(req.body)

    res.status(201).json({
        success: true,
        data: course,
    })
})

// @desc update course
// @route Put /api/v1/courses/:id
// @access Private
exports.UpdateCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    if (!course) {
        //correctly formatted object id
        return next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404))
    }

    res.status(200).json({
        success: true,
        data: course
    })
})

// @desc Delete course
// @route Delete /api/v1/courses/:id
// @access Private
exports.DeleteCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id)

    if (!course) {
        //correctly formatted object id
        return next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404))
    }

    course.remove();

    res.status(200).json({
        success: true,
        data: {}
    })
})
