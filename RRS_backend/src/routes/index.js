const router = require('express').Router();

const users_route = require('./users_route')
const admin_route = require('./admin_route')
const hotels_route = require('./hotel_route')
const reservations_route = require('./reservations_route')
const fooditems_route = require('./fooditems_route')

router.use('/users', users_route)
router.use('/admin', admin_route)
router.use('/hotels', hotels_route)
router.use('/reservations', reservations_route)
router.use('/fooditems', fooditems_route)


module.exports = router