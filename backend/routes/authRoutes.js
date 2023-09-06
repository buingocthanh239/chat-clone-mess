const router = require('express').Router();
const {userRegister, loginUser} = require('../controller/authController')

router.post('/register',userRegister)
router.post('/login', loginUser)

module.exports = router