const router = require('express').Router();
const auth_controller = require('./../controllers/auth_controller')

router.post('/signup', auth_controller.signup)
router.post('/login', auth_controller.login)
router.post('/forgot-password', auth_controller.token)
router.patch('/reset-password/:token', auth_controller.resetPassword)
module.exports = router