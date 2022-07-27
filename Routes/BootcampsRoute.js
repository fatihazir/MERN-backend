const express = require('express')
const { GetBootcamps, CreateBootcamp, DeleteBootcamp, GetBootcamp, UpdateBootcamp } = require('../controllers/BootcampsController')

const router = express.Router()

router.route('/')
    .get(GetBootcamps)
    .post(CreateBootcamp);

router.route('/:id')
    .get(GetBootcamp)
    .put(UpdateBootcamp)
    .delete(DeleteBootcamp)


module.exports = router