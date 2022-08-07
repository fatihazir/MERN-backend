const express = require('express')
const advancedResults = require('../middlewares/AdvancedResults')
const { GetReviews, GetReview, CreateReview, UpdateReview, DeleteReview } = require('../controllers/ReviewsController')
const Review = require('../models/Review')

const router = express.Router({ mergeParams: true })

router.route('/')
    .get(advancedResults(Review, {
        path: 'bootcamp',
        select: 'name description'
    }), GetReviews)
    .post(CreateReview)

router.route('/:id')
    .get(GetReview)
    .put(UpdateReview)
    .delete(DeleteReview)

module.exports = router
