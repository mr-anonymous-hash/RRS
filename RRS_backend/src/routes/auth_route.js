const router = require('express').Router();
const auth_controller = require('./../controllers/auth_controller')

router.post('/', auth_controller.login)  

module.exports = router