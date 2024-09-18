const router = require('express').Router();
const users_controller = require('./../controllers/users_controller')

router.get('/', users_controller.getAllUsers)
router.get('/:id', users_controller.getUserById)
router.put('/:id', users_controller.updateUser)
router.delete('/:id', users_controller.deleteUser)

module.exports = router