const express = require('express')
const { GetBootcamps, CreateBootcamp, DeleteBootcamp, GetBootcamp, UpdateBootcamp, GetBootcampsInRadius } = require('../controllers/BootcampsController')

const router = express.Router()

router.route('/radius/:zipcode/:distance').get(GetBootcampsInRadius)

router.route('/')
    .get(GetBootcamps)
    .post(CreateBootcamp);

router.route('/:id')
    .get(GetBootcamp)
    .put(UpdateBootcamp)
    .delete(DeleteBootcamp)




module.exports = router