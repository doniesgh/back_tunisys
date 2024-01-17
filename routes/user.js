const express = require('express')
const router = express.Router()
const passport= require('passport')
const userController = require('../controllers/userController')
const {getTechnicien,gethelpdesk,updateUserByemail,signupUser,loginUser,updateProfil,getUsersByEmail,getTechHelp,getUserById,getUsers,createUser, deleteUser,updateUser} =  require('../controllers/userController')
//login route
router.post('/login',loginUser)
//signup route
router.post('/signup',signupUser)

//get users
router.get('/list',getUsers)
//get usersby email
router.get('/email/:email',getUsersByEmail)
router.patch('/email/:email',updateUserByemail)

//get usersby id
router.get('/id/:id',getUserById)
// POST user
router.post('/add', createUser)
// DELETE user
router.delete('/:id', deleteUser)
// UPDATE user
router.patch('/:id', updateUser)
//UPDATE Profil
router.patch('/:id', updateProfil)

//client number

router.get('/client',userController.NbClient)
//helpdesk number
router.get('/helpdesk',userController.NbHelpDesk)
//technicien number
router.get('/technicien',userController.NbTechnicien)
router.get('/profile/:userId', userController.getUserById);
router.get('/role/:role', userController.getUserByRole);
router.get('/techhelp',getTechHelp);
router.get('/helpdesk/liste',gethelpdesk);
router.get('/technicien/liste',getTechnicien);


module.exports = router 