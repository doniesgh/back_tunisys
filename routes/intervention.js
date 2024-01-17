const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const {
    createIntervention, getInterventionByUserId
} = require('../controllers/interventionController')

const router = express.Router()
router.use(requireAuth)
router.post('/add', createIntervention)
router.get('/get', getInterventionByUserId)

module.exports = router
