const router = require('express').Router();
const admin_controller = require('./../controllers/admin_controller')

router.get('/', admin_controller.getAllAdmin)
router.get('/:id', admin_controller.getAdminById)
// router.post('/', admin_controller.createUser)
// router.put('/:id',admin_controller.updateUser)
// router.delete('/:id', admin_controller.deleteUser)

module.exports = router