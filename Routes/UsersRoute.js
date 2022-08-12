const express = require('express')
const advancedResults = require('../middlewares/AdvancedResults')
const { GetUsers, GetUser, CreateUser, DeleteUser, UpdateUser } = require('../controllers/UserController')
const User = require('../models/User')
const router = express.Router()

const { Protect, Authorize } = require('../middlewares/Auth')

router.use(Protect)
router.use(Authorize('admin'))

router.route('/')
    .get(advancedResults(User), GetUsers)
    .post(CreateUser)

router.route('/:id')
    .get(GetUser)
    .put(UpdateUser)
    .delete(DeleteUser)

module.exports = router