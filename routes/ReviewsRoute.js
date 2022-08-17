const express = require('express')
const advancedResults = require('../middlewares/AdvancedResults')
const { GetReviews, GetReview, CreateReview, UpdateReview, DeleteReview } = require('../controllers/ReviewsController')
const Review = require('../models/Review')

const router = express.Router({ mergeParams: true })

const { Protect, Authorize } = require('../middlewares/Auth')

router.route('/')
    .get(advancedResults(Review, {
        path: 'bootcamp',
        select: 'name description'
    }), GetReviews)
    .post(Protect, Authorize('user', 'admin'), CreateReview)

router.route('/:id')
    .get(GetReview)
    .put(Protect, Authorize('user', 'admin'), UpdateReview)
    .delete(Protect, Authorize('user', 'admin'), DeleteReview)

module.exports = router
