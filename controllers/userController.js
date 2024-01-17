const bcrypt = require('bcryptjs')
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')


const createToken = (_id) => {
  return jwt.sign({ _id: _id ,role : User.role}, process.env.SECRET, { expiresIn: '3d' })
}
const gethelpdesk = async (req, res) => {
  try {
    const role1 = 'HELPDESK';

    const users = await User.find(
      { role: { $in: [role1] } },
      { _id: 1, firstname: 1, lastname: 1, role:1 }
    );

    if (users.length > 0) {
      res.status(200).json(users);
    } else {
      res.status(404).json([]);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getTechnicien = async (req, res) => {
  try {
    const role1 = 'TECHNICIEN';

    const users = await User.find(
      { role: { $in: [role1] } },
      { _id: 1, firstname: 1, lastname: 1, role:1 }
    );

    if (users.length > 0) {
      res.status(200).json(users);
    } else {
      res.status(404).json([]);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getTechHelp = async (req, res) => {
  try {
    const role1 = 'TECHNICIEN';
    const role2 = 'HELPDESK';

    const users = await User.find(
      { role: { $in: [role1, role2] } },
      { _id: 1, firstname: 1, lastname: 1, role:1 }
    );

    if (users.length > 0) {
      res.status(200).json(users);
    } else {
      res.status(404).json([]);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body
    
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    const { role } = user; // Extract the role from the user object

    res.status(200).json({ email, token, role });  
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}


const NbClient = async (req, res) => {
  try {
    const nbClients = await User.countDocuments({ role: 'client' });
    res.status(200).json({ count: nbClients });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const NbHelpDesk = async (req, res) => {
  try {
    const nbHelpDesk = await User.countDocuments({ role: 'HELPDESK' });
    res.status(200).json({ count: nbHelpDesk });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const NbTechnicien = async (req, res) => {
  try {
    const nbTechnicien = await User.aggregate([
      { $match: { role: 'TECHNICIEN' } },
      { $count: 'count' }
    ]);

    res.status(200).json({ count: nbTechnicien[0] ? nbTechnicien[0].count : 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getUserByRole = async (req, res) => {
  try {
    const userRole = req.params.role;
    const userCount = await User.countDocuments({ role: userRole });
    res.json({ count: userCount });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
}

// signup user
const signupUser = async (req, res) => {
  const { firstname, lastname, email, password,role } = req.body   
  try {
    const user = await User.signup(firstname, lastname, email, password,role)
    const token = createToken(user._id)
    res.status(200).json({ firstname, email, token })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}
// get users
const getUsers = async (req, res) => {
  const users = await User.find({})
  res.status(200).json(users)
}
// get users by email
const getUsersByEmail = async (req, res) => {
  const email = req.params.email;
  try {
    const user = await User.findOne({ email: email })
    if (user) {
      res.status(200).json(user)
    } else {
      res.status(404).json({ message: 'User not found' })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
};
// update user by email
const updateUserByemail = async (req, res) => {
  const userId = req.params.id; // Assuming you're passing the user ID in the URL
  const updatedUserData = req.body; // Assuming you're sending updated data in the request body

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, updatedUserData, { new: true });

    if (updatedUser) {
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const userId = req.params._id;
    const profile = await User.findOne({ userId });
    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).send('not found');
  }
}

// delete user
const deleteUser = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({error: 'No such user'})
  }

  const user = await User.findOneAndDelete({_id: id})

  if(!user) {
    return res.status(400).json({error: 'No such user'})
  }

  res.status(200).json(user)
}
// update an user
const updateUser = async (req, res) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({error: 'No such user'})
  }
  const user = await User.findById(id)
  if (!user) {
    return res.status(400).json({error: 'No such user'})
  }
  const { firstname, lastname,email,password, role } = req.body
  if (!lastname && !firstname && !email && !password && !role ) {
    return res.status(400).json({ error: 'Vous devez au moins modifier un champs' })
  }
  const updatedUser = await User.findByIdAndUpdate(
    id,
    { firstname, lastname,email,password, role},
    { new: true }
  )
  res.status(200).json(updatedUser)
};

//update profile 
const updateProfil = async (req, res) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({error: 'No such user'})
  }
  const user = await User.findById(id)
  if (!user) {
    return res.status(400).json({error: 'No such user'})
  }
  const { firstname, lastname,email,password } = req.body
  if (!lastname && !firstname && !email && !password ) {
    return res.status(400).json({ error: 'Vous devez au moins modifier un champs' })
  }
  const updatedUser = await User.findByIdAndUpdate(
    id,
    { firstname, lastname,email,password},
    { new: true }
  )
  res.status(200).json(updatedUser)
};
const createUser = async (req, res) => {
  const { firstname, lastname, email, password, role } = req.body;
  let emptyFields = [];

  if (!firstname) {
    emptyFields.push('firstname');
  }
  if (!lastname) {
    emptyFields.push('lastname');
  }
  if (!email) {
    emptyFields.push('email');
  }
  if (!password) {
    emptyFields.push('password');
  }
  if (!role) {
    emptyFields.push('role');
  }

  if (emptyFields.length > 0) {
    return res.status(400).json({ error: 'Veuillez remplir tous les champs.', emptyFields });
  }

  try {
    // Check if the email is already in use
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      const errorMessage = `L'adresse e-mail ${email} est déjà utilisée.`;
      return res.status(400).json({ error: errorMessage });
    }

    // If not, create the user
    const user = await User.create({ firstname, lastname, email, password, role });
    res.status(200).json(user);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      const errorMessage = `L'adresse e-mail ${email} est déjà utilisée.`;
      return res.status(400).json({ error: errorMessage });
    }
    res.status(400).json({ error: error.message });
  }
};

module.exports = {getTechnicien,gethelpdesk,updateUserByemail, updateProfil,getTechHelp,getUserByRole,NbClient,NbHelpDesk,NbTechnicien,loginUser, createUser,signupUser ,deleteUser,updateUser, getUsers , getUsersByEmail,getUserById}
