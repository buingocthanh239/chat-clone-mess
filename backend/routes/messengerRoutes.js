const router = require('express').Router();
const { getFriends, postMessage, getMessageWithIdUser, postImage } = require('../controller/messengerController')

router.get('/users', getFriends)
router.post('/send-message', postMessage)
router.post('/send-image', postImage)
router.get('/get-messages/:reseverId', getMessageWithIdUser)

module.exports = router