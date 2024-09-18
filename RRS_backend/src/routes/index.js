const router = require('express').Router();

const users_route = require('./users_route')
const admin_route = require('./admin_route')
const hotels_route = require('./hotel_route')
const reservations_route = require('./reservations_route')
const fooditems_route = require('./fooditems_route')
const auth_route = require('./auth_route')
const verifyToken = require('./../utils/middleware')

router.use('/login', auth_route)
router.use('/users', verifyToken, users_route)
router.use('/admin', verifyToken, admin_route)
router.use('/hotels', verifyToken, hotels_route)
router.use('/reservations', verifyToken, reservations_route)
router.use('/fooditems', verifyToken, fooditems_route)


module.exports = router