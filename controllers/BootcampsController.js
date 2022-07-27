// @desc Get All bootcamps
// @route Get /api/v1/bootcamps
// @access Public
exports.GetBootcamps = (req, res, next) => {
    //directly ends the request
    //res.sendStatus(400)

    //send statu code with json
    res.status(200).json({ success: true, message: 'Show all bootcamps' })
    //send json
    //res.json({ name: "brad" })
}

// @desc Get bootcamp
// @route Get /api/v1/bootcamps/:id
// @access Public
exports.GetBootcamp = (req, res, next) => {
    res.status(200).json({ success: true, message: `Show ${req.params.id} bootcamp` })
}

// @desc Create new bootcamp
// @route Post /api/v1/bootcamps
// @access Private
exports.CreateBootcamp = (req, res, next) => {
    res.status(200).json({ success: true, message: 'create new bootcamps' })
}

// @desc update bootcamp
// @route Put /api/v1/bootcamps/:id
// @access Private
exports.UpdateBootcamp = (req, res, next) => {
    res.status(200).json({ success: true, message: 'update bootcamp with id : ' + req.params.id })
}

// @desc Delete bootcamp
// @route Delete /api/v1/bootcamps/:id
// @access Private
exports.DeleteBootcamp = (req, res, next) => {
    res.status(200).json({ success: true, message: 'delete the bootcamp with id : ' + req.params.id })
}
