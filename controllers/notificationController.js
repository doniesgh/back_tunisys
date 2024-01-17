const Notification = require('../models/notification')
const mongoose = require('mongoose')
const requireAuth = require('../middleware/requireAuth')
const getNotification = async (req, res) => {
    try {
        const userId = req.user._id; 
        const notifications = await Notification.find({ receiverId: userId }).sort({ createdAt: -1 });
        res.json( {notifications} );
      } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
      }
  }
  const deleteNotification = async (req, res) => {
    const { id } = req.params;
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid notification ID' });
    }
  
    try {
      const notification = await Notification.findOneAndDelete({ _id: id });
  
      if (!notification) {
        return res.status(404).json({ error: 'Notification not found' });
      }
  
      res.status(200).json({ message: 'Notification deleted successfully', notification });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  module.exports = {
    getNotification,
    deleteNotification
  }