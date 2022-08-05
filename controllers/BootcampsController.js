const ErrorResponse = require('../utils/errorResponse')
const Bootcamp = require('../models/Bootcamp')
const asyncHandler = require('../middlewares/Async')
const geocoder = require('../utils/geocoder')

// @desc Get All bootcamps
// @route Get /api/v1/bootcamps
// @access Public
exports.GetBootcamps = asyncHandler(async (req, res, next) => {
    let query;

    // Copy query from request
    const reqQuery = { ...req.query }

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit']

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param])

    // Create query string
    let queryString = JSON.stringify(reqQuery)

    // Create operators ($gt,$gte...)
    queryString = queryString.replace(/\b(gt|gte|lt|lte|in)\b/g, match => ('$' + match))

    // Finding resource
    query = Bootcamp.find(JSON.parse(queryString)).populate('courses')

    // Select fields
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ')
        query = query.select(fields)
    }

    // Sort
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ')
        query = query.sort(sortBy)
    } else {
        query = query.sort('-createdAt')
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 25
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const total = await Bootcamp.countDocuments()

    query = query.skip(startIndex).limit(limit)

    // Executing query
    const bootcamps = await query

    // Pagination result
    const pagination = {}

    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }

    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        }
    }


    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps,
        pagination
    })
})

// @desc Get bootcamp
// @route Get /api/v1/bootcamps/:id
// @access Public
exports.GetBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id)

    if (!bootcamp) {
        //correctly formatted object id
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
    }

    res.status(200).json({
        success: true,
        data: bootcamp
    })
})

// @desc Create new bootcamp
// @route Post /api/v1/bootcamps
// @access Private
exports.CreateBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.create(req.body)

    res.status(201).json({
        success: true,
        data: bootcamp,
    })
})

// @desc update bootcamp
// @route Put /api/v1/bootcamps/:id
// @access Private
exports.UpdateBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    if (!bootcamp) {
        //correctly formatted object id
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
    }

    res.status(200).json({
        success: true,
        data: bootcamp
    })
})

// @desc Delete bootcamp
// @route Delete /api/v1/bootcamps/:id
// @access Private
exports.DeleteBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)

    if (!bootcamp) {
        //correctly formatted object id
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
    }

    res.status(200).json({
        success: true,
        data: {}
    })
})

// @desc Get bootcamps within a radius
// @route Get /api/v1/bootcamps/radius/:zipcode/:distance
// @access Private
exports.GetBootcampsInRadius = asyncHandler(async (req, res, next) => {
    const { zipcode, distance } = req.params

    // Get lat-lang from geocoder
    const loc = await geocoder.geocode(zipcode)
    const lat = loc[0].latitude
    const lng = loc[0].longitude

    // Calculate radius using radians
    // Divide dist by radius of earth
    // Earth radiuss = 3,963 ni /6,378 km
    const radius = distance / 3963

    const bootcamps = await Bootcamp.find({
        location: {
            $geoWithin: {
                $centerSphere: [[lng, lat], radius]
            }
        }
    })

    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    })


})
