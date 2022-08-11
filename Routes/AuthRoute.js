const express = require('express')
const { Register, Login, GetMe, ForgotPassword, ResetPassword } = require('../controllers/AuthController')

const router = express.Router()

const { Protect } = require('../middlewares/Auth')

router.post('/register', Register)
router.post('/login', Login)
router.post('/forgotpassword', ForgotPassword)
router.get('/me', Protect, GetMe)
router.put('/resetpassword/:resettoken', ResetPassword)

module.exports = router
