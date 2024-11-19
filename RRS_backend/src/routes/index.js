const router = require('express').Router();

const users_route = require('./users_route')
const admin_route = require('./admin_route')
const hotels_route = require('./hotel_route')
const reservations_route = require('./reservations_route')
const fooditems_route = require('./fooditems_route')
const auth_route = require('./auth_route')
const auth_controller = require('./../controllers/auth_controller')
const review_route = require('./review_route')
const verifyToken = require('./../utils/middleware')

router.use('/signup', auth_controller.signup )
router.use('/login', auth_controller.login)
router.post('/forgot-password', auth_controller.token)
router.patch('/reset-password/:token', auth_controller.resetPassword)
router.use('/users',  users_route)
router.use('/admin', verifyToken, admin_route)
router.use('/hotels', verifyToken, hotels_route)
router.use('/reviews', review_route)
router.use('/reservations', verifyToken, reservations_route)
router.use('/fooditems', verifyToken, fooditems_route)



module.exports = router