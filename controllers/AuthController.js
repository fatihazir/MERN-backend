const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middlewares/Async')
const User = require('../models/User')

// @desc Register user
// @route Post /api/v1/auth/register
// @access Public
exports.Register = asyncHandler(async (req, res, next) => {
    res.status(200).json({ success: true })
})