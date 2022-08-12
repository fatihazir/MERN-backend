const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middlewares/Async')
const User = require('../models/User')

// @desc Get all user
// @route Get /api/v1/auth/users
// @access Private/Admin
exports.GetUsers = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults)
})

// @desc Get single user
// @route Get /api/v1/auth/users/:id
// @access Private/Admin
exports.GetUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id)

    if (!user) {
        return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404))
    }

    res.status(200).json({
        success: true,
        data: user
    })
})

// @desc Post create user
// @route Get /api/v1/auth/users
// @access Private/Admin
exports.CreateUser = asyncHandler(async (req, res, next) => {
    const user = await User.create(req.body)

    res.status(201).json({
        success: true,
        data: user
    })
})

// @desc Put update user
// @route Get /api/v1/auth/users
// @access Private/Admin
exports.UpdateUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

    if (!user) {
        return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404))
    }

    res.status(200).json({
        success: true,
        data: user
    })
})

// @desc Delete delete user
// @route Get /api/v1/auth/users
// @access Private/Admin
exports.DeleteUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id)

    if (!user) {
        return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404))
    }

    user.remove()

    res.status(200).json({
        success: true,
        data: {}
    })
})