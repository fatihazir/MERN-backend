const ErrorResponse = require('../utils/errorResponse')
const Course = require('../models/Course')
const Bootcamp = require('../models/Bootcamp')
const Review = require('../models/Review')
const asyncHandler = require('../middlewares/Async')

// @desc Get All Reviews
// @route Get /api/v1/reviews
// @route Get /api/v1/bootcamps/:bootcampId/reviews
// @access Public
exports.GetReviews = asyncHandler(async (req, res, next) => {
    if (req.params.bootcampId) {
        const reviews = await Review.find({ bootcamp: req.params.bootcampId })
        return res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews,
        })
    } else {
        res.status(200).json(res.advancedResults)
    }

})

// @desc Get review
// @route Get /api/v1/reviews/:id
// @access Public
exports.GetReview = asyncHandler(async (req, res, next) => {
    const review = await Review.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    })

    if (!review) {
        //correctly formatted object id
        return next(new ErrorResponse(`Review not found with id of ${req.params.id}`, 404))
    }

    res.status(200).json({
        success: true,
        data: review
    })
})

// @desc Create new review
// @route Post /api/v1/bootcamps/:boorcampId/review
// @access Private
exports.CreateReview = asyncHandler(async (req, res, next) => {
    req.body.bootcamp = req.params.bootcampId

    const bootcamp = await Bootcamp.findById(req.params.bootcampId)

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.bootcampId}`, 404))
    }

    const review = await Review.create(req.body)

    res.status(201).json({
        success: true,
        data: review,
    })
})

// @desc update review
// @route Put /api/v1/reviews/:id
// @access Private
exports.UpdateReview = asyncHandler(async (req, res, next) => {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    if (!review) {
        //correctly formatted object id
        return next(new ErrorResponse(`Review not found with id of ${req.params.id}`, 404))
    }

    res.status(200).json({
        success: true,
        data: review
    })
})

// @desc Delete review
// @route Delete /api/v1/reviews/:id
// @access Private
exports.DeleteReview = asyncHandler(async (req, res, next) => {
    const review = await Review.findById(req.params.id)

    if (!review) {
        //correctly formatted object id
        return next(new ErrorResponse(`Review not found with id of ${req.params.id}`, 404))
    }

    review.remove();

    res.status(200).json({
        success: true,
        data: {}
    })
})
