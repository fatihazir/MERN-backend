const Bootcamp = require('../models/Bootcamps')

// @desc Get All bootcamps
// @route Get /api/v1/bootcamps
// @access Public
exports.GetBootcamps = async (req, res, next) => {
    try {
        const bootcamps = await Bootcamp.find();
        res.status(200).json({
            success: true,
            count: bootcamps.length,
            data: bootcamps
        })
    } catch (error) {
        res.status(400).json({
            success: false
        })
    }
}

// @desc Get bootcamp
// @route Get /api/v1/bootcamps/:id
// @access Public
exports.GetBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findById(req.params.id)

        if (!bootcamp) {
            //correctly formatted object id
            return res.status(400).json({
                success: false
            })
        }

        res.status(200).json({
            success: true,
            data: bootcamp
        })
    } catch (error) {
        // res.status(400).json({
        //     success: false
        // })
        next(error)
    }
}

// @desc Create new bootcamp
// @route Post /api/v1/bootcamps
// @access Private
exports.CreateBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.create(req.body)

        res.status(201).json({
            success: true,
            data: bootcamp,
        })
    } catch (error) {
        res.status(400).json({
            success: false
        })
    }
}

// @desc update bootcamp
// @route Put /api/v1/bootcamps/:id
// @access Private
exports.UpdateBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })


        if (!bootcamp) {
            //correctly formatted object id
            return res.status(400).json({
                success: false
            })
        }

        res.status(200).json({
            success: true,
            data: bootcamp
        })
    } catch (error) {
        res.status(400).json({
            success: false
        })
    }

}

// @desc Delete bootcamp
// @route Delete /api/v1/bootcamps/:id
// @access Private
exports.DeleteBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)

        if (!bootcamp) {
            //correctly formatted object id
            return res.status(400).json({
                success: false
            })
        }

        res.status(200).json({
            success: true,
            data: {}
        })
    } catch (error) {
        res.status(400).json({
            success: false
        })
    }
}
