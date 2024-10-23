const router = require('express').Router()
const review_controller = require('./../controllers/review_controller')



router.get('/hotel/:id',review_controller.getReviewByHotelId)

router.post('/', review_controller.createReview)

module.exports = router