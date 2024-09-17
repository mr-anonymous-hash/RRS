const router = require('express').Router();
const reservations_controller = require('./../controllers/reservation_controller')

router.get('/', reservations_controller.getAllReservations)
router.get('/:id', reservations_controller.getReservationsById)
router.post('/', reservations_controller.createReservation)
router.delete('/:id', reservations_controller.deleteReservation)

module.exports = router