const router = require('express').Router();
const fooditems_controller = require('./../controllers/fooditems_controller')

router.get('/', fooditems_controller.getAllFoodItems)
router.get('/:id', fooditems_controller.getFoodItemsById)
router.post('/', fooditems_controller.createFoodItem)
router.put('/:id', fooditems_controller.updateFoodItem)
router.delete('/:id', fooditems_controller.deleteFoodItem)

module.exports = router