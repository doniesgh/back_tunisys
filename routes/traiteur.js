const express = require('express')
const router = express.Router()
const {getRecsById,findUserNameById,getReclamations} = require('../controllers/traiteurController')

router.get('/:id',getRecsById)

router.get('/:name',findUserNameById)

router.get('/rec',getReclamations)

module.exports = router 