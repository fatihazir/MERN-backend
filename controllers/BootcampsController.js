const ErrorResponse = require('../utils/errorResponse')
const Bootcamp = require('../models/Bootcamp')
const asyncHandler = require('../middlewares/Async')
const geocoder = require('../utils/geocoder')
const path = require('path')

// @desc Get All bootcamps
// @route Get /api/v1/bootcamps
// @access Public
exports.GetBootcamps = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults)
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
    // Add user to body
    req.body.user = req.user

    // Check for published bootcamp
    const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id })

    // If the user is not an admin, they can only add one bootcamp
    if (publishedBootcamp && req.user.role !== 'admin') {
        return next(new ErrorResponse(`The user with id ${req.user.id} has already published a bootcamp`, 400))
    }

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
    let bootcamp = await Bootcamp.findById(req.params.id)

    if (!bootcamp) {
        //correctly formatted object id
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
    }

    // Make sure user is bootcamp's owner
    if ((bootcamp.user.toString() !== req.user.id) && (req.user.role !== 'admin')) {
        return next(new ErrorResponse(`User ${req.params.id} is not authorized to update this bootcamp`, 401))
    }

    bootcamp = await Bootcamp.findOneAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })


    res.status(200).json({
        success: true,
        data: bootcamp
    })
})

// @desc Delete bootcamp
// @route Delete /api/v1/bootcamps/:id
// @access Private
exports.DeleteBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id)

    if (!bootcamp) {
        //correctly formatted object id
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
    }

    // Make sure user is bootcamp's owner
    if ((bootcamp.user.toString() !== req.user.id) && (req.user.role !== 'admin')) {
        return next(new ErrorResponse(`User ${req.params.id} is not authorized to update this bootcamp`, 401))
    }

    // This function triggers cascade pre section
    bootcamp.remove();

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

// @desc Upload photo for bootcamp
// @route Delete /api/v1/bootcamps/:id/photo
// @access Private
exports.UploadBootcampPhoto = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id)

    if (!bootcamp) {
        //correctly formatted object id
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
    }

    // Make sure user is bootcamp's owner
    if ((bootcamp.user.toString() !== req.user.id) && (req.user.role !== 'admin')) {
        return next(new ErrorResponse(`User ${req.params.id} is not authorized to update this bootcamp`, 401))
    }


    if (!req.files) {
        return next(new ErrorResponse(`Please upload a file`, 400))
    }

    const file = req.files.file

    // Make sure the image is photo
    if (!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse(`Please upload an image file`, 400))
    }

    //Check filesize
    if (file.size > process.env.MAX_FILE_UPLOAD) {
        return next(new ErrorResponse(`Please upload an image that is less then ${process.env.MAX_FILE_UPLOAD}`, 400))
    }

    // Create custom filename + extension
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
        if (err) {
            console.error(err)
            return next(new ErrorResponse(`Problem with file upload`, 500))
        }

        await Bootcamp.findByIdAndUpdate(req.params.id, {
            photo: file.name
        })

        res.status(200).json({
            success: true,
            data: file.name
        })
    })

})