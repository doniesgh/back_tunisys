const express = require('express')
const router = express.Router()
const { deleteNotification } = require('../controllers/notificationController');
const {getNotification} =  require('../controllers/notificationController')
const requireAuth = require('../middleware/requireAuth')
router.use(requireAuth)

router.get('/get',getNotification)
router.delete('/delete/:id',deleteNotification)


module.exports = router 