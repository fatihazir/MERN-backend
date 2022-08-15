const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middlewares/Async')
const User = require('../models/User')
const SendEmail = require('../utils/sendEmail')
const crypto = require('crypto')

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

// @desc Get Logout - clear cookie
// @route Get /api/v1/auth/logout
// @access Private
exports.Logout = asyncHandler(async (req, res, next) => {
    res.cookie('token', 'none', {
        //10 min
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        data: {},
    });
});

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

// @desc Put Update password
// @route Put /api/v1/auth/updatepassword
// @access Private
exports.UpdatePassword = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password')

    //Check current password
    if (!(await user.MatchPassword(req.body.currentPassword))) {
        return next(new ErrorResponse("Password is incorrect", 400))
    }

    user.password = req.body.newPassword

    await user.save()

    SendTokenResponse(user, 200, res)
})

// @desc Put Update user details
// @route Put /api/v1/auth/updatedetails
// @access Private
exports.UpdateDetails = asyncHandler(async (req, res, next) => {
    const fieldsToUpdate = {
        name: req.body.name,
        email: req.body.email
    }

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, { new: true, runValidators: true })

    res.status(200).json({
        success: true,
        data: user
    })
})

// @desc Post forgot password
// @route Post /api/v1/auth/forgotpassword
// @access public
exports.ForgotPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email })

    if (!user) {
        return next(new ErrorResponse("Please provide an existing email", 404))
    }

    // Get reset token
    let resetToken = user.GetResetPasswordToken()

    await user.save({ validateBeforeSave: false })

    // Create reset url
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

    try {
        await SendEmail({
            email: user.email,
            subject: 'Password reset token',
            message
        })

        res.status(200).json({ success: true, data: 'Email send' })
    } catch (error) {
        console.log(error)
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined

        await user.save({ validateBeforeSave: false })

        return next(new ErrorResponse("Email could not be sent", 500))
    }

    res.status(200).json({
        success: true,
        data: user
    })
})

// @desc Post Reset password
// @route Post /api/v1/auth/resetpassword:/resettoken
// @access Public
exports.ResetPassword = asyncHandler(async (req, res, next) => {
    // Get hashed token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex')

    const user = await User.findOne({ resetPasswordToken, resetPasswordExpire: { $gt: Date.now() } })

    if (!user) {
        return next(new ErrorResponse("Invalid token", 400))
    }

    // Set new password
    user.password = req.body.password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save()

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
