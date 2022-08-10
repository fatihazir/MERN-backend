const express = require('express')
const { GetBootcamps, CreateBootcamp, DeleteBootcamp, GetBootcamp, UpdateBootcamp, GetBootcampsInRadius, UploadBootcampPhoto } = require('../controllers/BootcampsController')
const advancedResults = require('../middlewares/AdvancedResults')
const Bootcamp = require('../models/Bootcamp')

// Include other resource routers
const courseRouter = require('./CoursesRoute')
const reviewRouter = require('./ReviewsRoute')

const { Protect } = require('../middlewares/Auth')

const router = express.Router()

// Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter)
router.use('/:bootcampId/reviews', reviewRouter)

router.route('/radius/:zipcode/:distance').get(GetBootcampsInRadius)

router.route('/')
    .get(advancedResults(Bootcamp, 'courses'), GetBootcamps)
    .post(Protect, CreateBootcamp);

router.route('/:id')
    .get(GetBootcamp)
    .put(Protect, UpdateBootcamp)
    .delete(Protect, DeleteBootcamp)

router.route('/:id/photo').put(Protect, UploadBootcampPhoto)

module.exports = router