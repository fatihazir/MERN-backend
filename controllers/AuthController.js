const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middlewares/Async')
const User = require('../models/User')

// @desc Register user
// @route Post /api/v1/auth/register
// @access Public
exports.Register = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body

    //Create user
    const user = await User.create({
        name,
        email,
        password,
        role
    })

    SendTokenResponse(user, 200, res)
})

// @desc Login user
// @route Post /api/v1/auth/login
// @access Public
exports.Login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body

    // Validation
    if (!email || !password) {
        return next(new ErrorResponse("Please provide an email and password", 400))
    }

    //Check for user
    const user = await User.findOne({ email }).select('+password')

    if (!user) {
        return next(new ErrorResponse("Invalid credentials", 401))
    }

    // Check if psw matches
    const isMatch = await user.MatchPassword(password)

    if (!isMatch) {
        return next(new ErrorResponse("Invalid credentials", 401))
    }

    SendTokenResponse(user, 200, res)
})

//Get token from model, create cookie and send response
const SendTokenResponse = (user, statusCode, res) => {
    // Create Token
    const token = user.GetSignedJwtToken()

    const options = {
        //30 days
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true,
    }

    if (process.env.NODE_ENV === 'production') {
        options.secure = true
    }

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token
        })
}

// @desc Get current logged in user
// @route Post /api/v1/auth/me
// @access Private
exports.GetMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id)

    res.status(200).json({
        success: true,
        data: user
    })
})