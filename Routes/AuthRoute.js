const express = require('express')
const { Register, Login, GetMe } = require('../controllers/AuthController')

const router = express.Router()

const { Protect } = require('../middlewares/Auth')

router.post('/register', Register)
router.post('/login', Login)
router.get('/me', Protect, GetMe)

module.exports = router
