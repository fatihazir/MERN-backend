const ErrorResponse = require('../utils/errorResponse')
const Bootcamp = require('../models/Bootcamps')
const asyncHandler = require('../middlewares/Async')
const geocoder = require('../utils/geocoder')

// @desc Get All bootcamps
// @route Get /api/v1/bootcamps
// @access Public
exports.GetBootcamps = asyncHandler(async (req, res, next) => {
    const bootcamps = await Bootcamp.find();

    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
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
