const Reclamation = require('../models/reclamation')
const User = require('../models/userModel')
const Notification = require('../models/notification')
//const requireAuth = require('../middleware/requireAuth')
const Intervention = require ('../models/ficheIntervention')
const mongoose = require('mongoose')

exports.getManagerId = async () => {
  try {
    const manager = await User.findOne({ role: 'COORDINATRICE' });

    if (!manager) {
      throw Error('Manager not found');
    }

    return manager._id; // Retourne l'ID du manager
  } catch (error) {
    throw Error('Error fetching manager ID: ' + error.message);
  }
};
//***********COORDINATRICE***********//
// Create a new reclamation

exports.createReclamation = async (req, res) => {
  const user_id = req.user._id;
  const creerpar = req.user._id;
  const { idn, type, client, traiteur, equipement, localisation } = req.body;
  let emptyFields = [];
  
  if (!user_id) {
    emptyFields.push('user_id');
  }
  
  if (!creerpar) {
    emptyFields.push('creerpar');
  }

  if (!idn) {
    emptyFields.push('idn');
  }

  if (!type) {
    emptyFields.push('type');
  }

  if (!client) {
    emptyFields.push('client');
  }

  if (!traiteur) {
    emptyFields.push('traiteur');
  }

  if (!equipement) {
    emptyFields.push('equipement');
  }

  if (!localisation) {
    emptyFields.push('localisation');
  }

  if (emptyFields.length > 0) {
    return res.status(400).json({ error: 'Veuillez remplir tous les champs.', emptyFields });
  }

  try {
    const reclamation = await Reclamation.create({
      user_id,
      creerpar,
      idn,
      type,
      client,
      traiteur,
      equipement,
      localisation,
    });

    const notification = await Notification.create({
      receiverId: traiteur,
      senderId: user_id,
      message: `Nouvelle réclamation: ${idn}`,
    });

    res.status(200).json(reclamation);
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.idn) {
      // Handle uniqueness constraint violation
      return res.status(400).json({ error: 'L\'identifiant idn doit être unique.', field: 'idn' });
    }
  
    res.status(400).json({ error: error.message });
  }
};


// delete event
exports.deleteRecalmation = async (req, res) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({error: 'No such reclamation'})
  }
  const reclamation = await Reclamation.findOneAndDelete({_id: id})

  if(!reclamation) {
    return res.status(400).json({error: 'No such reclamation'})
  }

  res.status(200).json(reclamation)
}
exports.reaffecterRecalmation = async (req, res) => {
  const { reclamationId, newStatus } = req.params;
  const { traiteur } = req.body;

  try {
    const reclamation = await Reclamation.findByIdAndUpdate(
      reclamationId,
      { etat: newStatus, traiteur: traiteur }, // Update the traiteur field
      { new: true }
    );

    if (!reclamation) {
      return res.status(404).json({ message: 'Reclamation not found' });
    }
    const notification = await Notification.create({
      receiverId: traiteur,
      senderId: reclamation.user_id,
      message: `Nouvelle réclamation: ${reclamation.idn}`,
    });

    // Send a response with the updated reclamation
    res.status(200).json({ reclamation });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
//modifier
/*
exports.updateReclamationStatus = async (req, res) => {
  const { reclamationId, newStatus } = req.params;

  try {
      const reclamation = await Reclamation.findByIdAndUpdate(
          reclamationId,
          { etat: newStatus },
          { new: true }
      );

      if (!reclamation) {
          throw Error('Reclamation not found');
      }
      const coordinatorUserId = await User.findOne({ role: 'COORDINATRICE' }, '_id');
      const notificationMessage = `Mise à jour de reclamation ${reclamationId} à ${newStatus}`;
      const notification = await Notification.create({
        receiverId: coordinatorUserId,
        senderId: req.user._id,
        message: notificationMessage,
      });
  

      res.status(200).json({ reclamation });
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
};

exports.updateReclamationStatusReporte = async (req, res) => {
  const { reclamationId, newStatus } = req.params;

  try {
    const reclamation = await Reclamation.findByIdAndUpdate(
      reclamationId,
      { etat: newStatus, traiteur: null }, // Set traiteur to null
      { new: true }
    );

    if (!reclamation) {
      throw Error('Reclamation not found');
    }

    console.log('Reclamation:', reclamation); 
    console.log(reclamation.creerpar);
    const coordinatorUserId = await User.findOne({ role: 'COORDINATRICE' }, '_id');

    const notificationMessage = `Mise à jour de reclamation ${reclamationId} à ${newStatus}`;
    const notification = await Notification.create({
      receiverId: coordinatorUserId,
      senderId: req.user._id,
      message: notificationMessage,
    });
    res.status(200).json({ reclamation });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

*/
/*
exports.updateReclamationStatus = async (req, res) => {
  const { reclamationId, newStatus } = req.params;

  try {
    const reclamation = await Reclamation.findByIdAndUpdate(
      reclamationId,
      { etat: newStatus },
      { new: true }
    );

    if (!reclamation) {
      throw Error('Reclamation not found');
    }

    // Retrieve all user IDs where role is "COORDINATRICE"
    const coordinatorUserIds = await User.find({ role: 'COORDINATRICE' }, '_id');

    // Use the retrieved user IDs to send notifications
    const notifications = await Promise.all(
      coordinatorUserIds.map(async (userId) => {
        const notificationMessage = `Mise à jour de reclamation ${reclamationId} à ${newStatus}`;
        return Notification.create({
          receiverId: userId,
          senderId: req.user._id,
          message: notificationMessage,
        });
      })
    );

    res.status(200).json({ reclamation, notifications });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
*/

exports.updateReclamationStatus = async (req, res) => {
  const { reclamationId, newStatus } = req.params;

  try {
    const reclamation = await Reclamation.findByIdAndUpdate(
      reclamationId,
      { etat: newStatus },
      { new: true }
    );

    if (!reclamation) {
      throw Error('Reclamation not found');
    }

    // Retrieve all user IDs where role is "COORDINATRICE"
    const coordinatorUserIds = await User.find({ role: 'COORDINATRICE' }, '_id');

    // Use the retrieved user IDs to send notifications
    const notifications = await Promise.all(
      coordinatorUserIds.map(async (userId) => {
        const notificationMessage = `Mise à jour de reclamation ${reclamationId} à ${newStatus}`;
        return Notification.create({
          receiverId: userId,
          senderId: req.user._id,
          message: notificationMessage,
        });
      })
    );
    io.emit('notification', {
      reclamationId,
      newStatus,
      message: `Mise à jour de reclamation ${reclamationId} à ${newStatus}`,
    });

    // Emit a notification event to all connected clients
    io.emit('notification', {
      reclamationId,
      newStatus,
      message: `Mise à jour de reclamation ${reclamationId} à ${newStatus}`,
    });

    res.status(200).json({ reclamation, notifications });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateReclamationStatusReporte = async (req, res) => {
  const { reclamationId, newStatus } = req.params;

  try {
    const reclamation = await Reclamation.findByIdAndUpdate(
      reclamationId,
      { etat: newStatus, traiteur: null },
      { new: true }
    );

    if (!reclamation) {
      throw Error('Reclamation not found');
    }

    // Retrieve all user IDs where role is "COORDINATRICE"
    const coordinatorUserIds = await User.find({ role: 'COORDINATRICE' }, '_id');

    // Use the retrieved user IDs to send notifications
    const notifications = await Promise.all(
      coordinatorUserIds.map(async (userId) => {
        const notificationMessage = `Mise à jour de reclamation ${reclamationId} à ${newStatus}`;
        return Notification.create({
          receiverId: userId,
          senderId: req.user._id,
          message: notificationMessage,
        });
      })
    );

    res.status(200).json({ reclamation, notifications });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//*****************Technicien****************//

exports.updateReclamationStatusFinal = async (req, res) => {
  const { reclamationId, newStatus } = req.params;

  try {
    const reclamation = await Reclamation.findByIdAndUpdate(
      reclamationId,
      { etat: newStatus },
      { new: true }
    );

    if (!reclamation) {
      throw Error('Reclamation not found');
    }
        // Retrieve all user IDs where role is "COORDINATRICE"
        const coordinatorUserIds = await User.find({ role: 'COORDINATRICE' }, '_id');

        // Use the retrieved user IDs to send notifications
        const notifications = await Promise.all(
          coordinatorUserIds.map(async (userId) => {
            const notificationMessage = `Finalisation de reclamation ${reclamationId} `;
            return Notification.create({
              receiverId: userId,
              senderId: req.user._id,
              message: notificationMessage,
            });
          })
        );
    
    const {
      user_id,
      idn,
      type,
      client,
      equipement,
      localisation,
      traiteur,
      etat,
      Description,
      dateFin,
    } = req.body;

    const newIntervention = new Intervention({
      user_id,
      idn,
      type,
      client,
      equipement,
      localisation,
      creerpar: req.user._id, 
      traiteur,
      etat,
      Description,
      dateFin,
    });

    const savedIntervention = await newIntervention.save();

    res.status(200).json({ reclamation, intervention: savedIntervention });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// update an reclamation
exports.updateReclamation = async (req, res) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({error: 'No such reclamation'})
  }
  const reclamation = await Reclamation.findById(id)
  if (!reclamation) {
    return res.status(400).json({error: 'No such reclamation'})
  }
  const { idn, type, client, traiteur, equipement, localisation,etat } = req.body
  if (!idn && !type && !client && !traiteur && !equipement && !localisation && !etat ) {
    return res.status(400).json({ error: 'Please provide at least one field to update' })
  }
  const updateReclamation = await Reclamation.findByIdAndUpdate(
    id,
    {  idn,type,client,traiteur,equipement,localisation, etat},
    { new: true }
  )
  res.status(200).json(updateReclamation)
}
// get all recmations  for client 

// get all recmations
exports.getReportedReclamations = async (req, res) => {
  try {
    const reclamations = await Reclamation.find({ etat:  'reporte'  }).sort({ createdAt: -1 });
    res.status(200).json(reclamations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
exports.getReclamations = async (req, res) => {
  try {
    const reclamations = await Reclamation.find({ etat: { $ne: 'finalise' } }).sort({ createdAt: -1 });
    res.status(200).json(reclamations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

//get all reclamations finalisés manager
exports.getReclamationsFinalise = async (req, res) => {
  try {
    const reclamations = await Reclamation.find({ etat: 'finalise' }).sort({ createdAt: -1 });
    res.status(200).json(reclamations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
//number
exports.countReclamations = async (req, res) => {
  try {
    const count = await Reclamation.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getUserById = async (userId) => {
  try {
    const user = await User.findById(userId);
    return user ? { firstName: user.firstname, lastName: user.lastname } : null;
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getReclamationsByClientName = async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await getUserById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { firstName, lastName } = user;

    const clientName1 = `${firstName} ${lastName}`;
    const clientName2 = `${lastName} ${firstName}`;

    const reclamations1 = await Reclamation.find({ client: clientName1 });
    const reclamations2 = await Reclamation.find({ client: clientName2 });

    const combinedReclamations = [...reclamations1, ...reclamations2];

    if (!combinedReclamations.length) {
      return res.status(404).json({ error: 'No reclamations found for this client' });
    }

    res.status(200).json(combinedReclamations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


//**************************Technicien*****************//
// show reclamation to tech where etat= finalise
exports.getAssignedFinalReclamations = async (req, res) => {
  try {
    const Id = req.user._id;
    const reclamations = await Reclamation.find({ traiteur: Id, etat: 'finalise' });
    res.status(200).json( reclamations );
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
exports.getAssignedReclamations = async (req, res) => {
  try {
    const Id = req.user._id;
    const reclamations = await Reclamation.find({ traiteur: Id, etat: { $ne: 'finalise' } });
    res.status(200).json(reclamations); // Return the array directly
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//***********Home page statistic***********//

exports.getReclamationsByDay = async (req, res) => {
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);

    const allDays = [];
    let currentDay = new Date(startOfMonth);

    while (currentDay <= endOfMonth) {
      allDays.push({
        day: currentDay.toISOString().split('T')[0],
        count: 0,
      });

      currentDay.setDate(currentDay.getDate() + 1);
    }

    const reclamationsByDay = await Reclamation.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfMonth,
            $lte: endOfMonth,
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
    ]);

    reclamationsByDay.forEach((reclamation) => {
      const dayObj = allDays.find((day) => day.day === reclamation._id);
      if (dayObj) {
        dayObj.count = reclamation.count;
      }
    });

    res.status(200).json(allDays);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
