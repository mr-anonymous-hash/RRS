const router = require('express').Router();
const hotel_controller = require('./../controllers/hotel_controller')

router.get('/', hotel_controller.getAllHotels)
router.get('/:id', hotel_controller.getHotelById)
router.get('/admin/:id', hotel_controller.getHotelsByAdminId)
router.post('/', hotel_controller.createHotel)
router.put('/:id', hotel_controller.updateHotel)
router.delete('/:id', hotel_controller.deleteHotel)

module.exports = router