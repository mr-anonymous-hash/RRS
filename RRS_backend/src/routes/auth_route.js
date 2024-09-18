const router = require('express').Router();
const auth_controller = require('./../controllers/auth_controller')

router.post('/signup', auth_controller.signup)
router.post('/login', auth_controller.login)
  
module.exports = router