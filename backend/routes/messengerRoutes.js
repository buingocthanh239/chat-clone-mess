const router = require('express').Router();
const { authMiddleware } = require('../middleware/authMiddleware')
const { getFriends } = require('../controller/messengerController')

router.get('/users',authMiddleware, getFriends)


module.exports = router