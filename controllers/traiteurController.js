const Reclamation = require('../models/reclamation')
const User = require('../models/userModel')

const mongoose = require('mongoose')


const updateReclamation = async (req, res) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({error: 'No such reclamation'})
  }
  const reclamation = await Reclamation.findById(id)
  if (!reclamation) {
    return res.status(400).json({error: 'No such reclamation'})
  }
  const { idn,type,client,traiteur,equipement,localisation,etat} = req.body
  if (!idn && !type && !client && !traiteur && !equipement && !localisation && !etat) {
    return res.status(400).json({ error: 'Please provide at least one field to update' })
  }
  const updateReclamation = await Reclamation.findByIdAndUpdate(
    id,
    {  idn,type,client,traiteur,equipement,localisation,etat},
    { new: true }
  )
  res.status(200).json(updateReclamation)
}

const getRecsById = async (req, res) => {
    const { user_id } = req.params;
    try {
      const reclamations = await Reclamation.find({ traiteur: user_id });
  
      res.json(reclamations);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  const findUserNameById = async (userId) => {
    try {
      const user = await User.findById(userId);
  
      if (user) {
        const userName = `${user.firstname} ${user.lastname}`;
        return userName;
      } else {
        return null; // User not found
      }
    } catch (error) {
      console.error(error);
      throw new Error('Error finding user by ID');
    }
  };
  const getReclamations = async (req, res) => {
    //const user_id = req.user._id
    try {
      const reclamations = await Reclamation.find().sort({ createdAt: -1 });
      res.status(200).json(reclamations);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

module.exports = {
    getRecsById,
    findUserNameById,
    getReclamations
  
}