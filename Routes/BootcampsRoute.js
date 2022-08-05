const express = require('express')
const { GetBootcamps, CreateBootcamp, DeleteBootcamp, GetBootcamp, UpdateBootcamp, GetBootcampsInRadius } = require('../controllers/BootcampsController')

// Include other resource routers
const courseRouter = require('./CoursesRoute')

const router = express.Router()

// Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter)

router.route('/radius/:zipcode/:distance').get(GetBootcampsInRadius)

router.route('/')
    .get(GetBootcamps)
    .post(CreateBootcamp);

router.route('/:id')
    .get(GetBootcamp)
    .put(UpdateBootcamp)
    .delete(DeleteBootcamp)

module.exports = router