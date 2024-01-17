const express = require('express');
const { addService, getAllServices } = require('../controllers/serviceController');
const router = express.Router()
router.post('/add',addService)
router.get('/liste',getAllServices)


module.exports = router 