const express = require('express');
const io = require('socket.io'); 

const router = express.Router();
const reclamationController = require('../controllers/reclamationController');
const {
    reaffecterRecalmation,
    updateReclamationStatusReporte,
    getReportedReclamations,
    getReclamationsByDay,
    createReclamation,
    getAssignedReclamations,
    updateReclamationStatus,
    getReclamations,
    countReclamations,
    updateReclamation,
    deleteRecalmation,
    getAssignedFinalReclamations,
    getReclamationsFinalise,
    updateReclamationStatusFinal,
    getReclamationsByClientName
    
} = require('../controllers/reclamationController')
const requireAuth = require('../middleware/requireAuth')
router.use(requireAuth)
router.get('/',getReclamations);
router.get('/reporte',getReportedReclamations);
router.get('/recClient',getReclamationsByClientName);
router.get('/finaltech',getAssignedFinalReclamations);
router.get('/finalmanager',getReclamationsFinalise);
router.delete('/:id', deleteRecalmation)
router.post('/add',createReclamation);
router.patch('/:id', updateReclamation)
router.get('/assigned-reclamations', getAssignedReclamations);
router.put('/update-reclamation-status/:reclamationId/:newStatus',updateReclamationStatus);
router.put('/reporte/:reclamationId/:newStatus',updateReclamationStatusReporte);
router.put('/finalise/:reclamationId/:newStatus',updateReclamationStatusFinal);
router.put('/reaffecter/:reclamationId/:newStatus',reaffecterRecalmation);
router.get('/number',countReclamations)
router.get('/getRecByDay',getReclamationsByDay)

module.exports = router;
