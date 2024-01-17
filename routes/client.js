const express = require('express')
const router = express.Router()
const { createClient, getClients, getContactByClient ,createContactByClient, getClientById, deleteClient, editClient, searchClientsByName, deleteContact, updateContact} = require('../controllers/clientController')
router.post('/add',createClient)
router.get('/list',getClients)
router.post('/contact', createContactByClient);
router.get('/contact/:clientId', getContactByClient);
router.get('/:clientId',getClientById);
router.patch('/:clientId',editClient);
router.delete('/:clientId',deleteClient);
router.patch('/contact/:clientId/:contactId', updateContact);
router.delete('/contact/:clientId/:contactId',deleteContact);

module.exports = router 