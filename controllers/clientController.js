const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Client = require('../models/client');
const Agence = require('../models/agence');
const Contact = require('../models/contact');
////////////////// CLIENT ////////////////
const createClient = async (req, res) => {
  const { client, adresse, email, corporate, title, mobile, office } = req.body;
  let emptyFields = [];

  if (!client || !adresse || !mobile) {
    if (!client) emptyFields.push('client');
    if (!adresse) emptyFields.push('adresse');
    if (!mobile) emptyFields.push('mobile');
    return res.status(400).json({ error: 'Please fill in all required fields.', emptyFields });
  }

  try {
    const existingClient = await Client.findOne({ client });

    if (existingClient) {
      const errorMessage = 'Client name is already in use.';
      return res.status(400).json({ error: errorMessage });
    }

    const newClient = await Client.create({
      client,
      adresse,
      email,
      corporate,
      title,
      mobile,
      office
    });

    res.status(201).json(newClient);
  } catch (error) {
    if (error.name === 'MongoError' && error.code === 11000) {
      const errorMessage = 'Client name is already in use.';
      return res.status(400).json({ error: errorMessage });
    }
    res.status(400).json({ error: error.message });
  }
};
const deleteClient = async (req, res) => {
  const { clientId } = req.params;

  try {
    const client = await Client.findById(clientId);

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    await Contact.deleteMany({ _id: { $in: client.contacts } });
    await Client.findByIdAndDelete(clientId);
    res.status(200).json({ message: 'Client and associated contacts deleted successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getClients = async (req, res) => {
  try {
    const clients = await Client.find({});
    res.status(200).json(clients);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
const getClientById = async (req, res) => {
  try {
    const { clientId } = req.params;
    const client = await Client.findById(clientId);

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.status(200).json(client);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

/////////////////// SEARCH ///////////////////////


/////////////////////// EDIT //////////////////

const editClient = async (req, res) => {
  const { clientId } = req.params;
  const { client, adresse, email, corporate, title, mobile, office } = req.body;

  try {
    const existingClient = await Client.findById(clientId);

    if (!existingClient) {
      return res.status(404).json({ message: 'Client not found' });
    }

    if (client !== existingClient.client) {
      const isClientNameTaken = await Client.findOne({ client });

      if (isClientNameTaken) {
        return res.status(400).json({ error: 'Client name is already in use.' });
      }
    }
    if (email !== existingClient.email) {
      const isEmailTaken = await Client.findOne({ email });

      if (isEmailTaken) {
        return res.status(400).json({ error: 'Email is already in use.' });
      }
    }
    if (mobile !== existingClient.mobile) {
      const isMobileTaken = await Client.findOne({ mobile });

      if (isMobileTaken) {
        return res.status(400).json({ error: 'Mobile number is already in use.' });
      }
    }
    existingClient.client = client;
    existingClient.adresse = adresse;
    existingClient.email = email;
    existingClient.corporate = corporate;
    existingClient.title = title;
    existingClient.mobile = mobile;
    existingClient.office = office;

    const updatedClient = await existingClient.save();

    res.status(200).json(updatedClient);
  } catch (error) {
    if (error.name === 'MongoError' && error.code === 11000) {
      let errorMessage = 'Duplicate key error.';
      if (error.keyPattern.client) {
        errorMessage = 'Client name is already in use.';
      } else if (error.keyPattern.email) {
        errorMessage = 'Email is already in use.';
      } else if (error.keyPattern.mobile) {
        errorMessage = 'Mobile number is already in use.';
      }
      return res.status(400).json({ error: errorMessage });
    }
    res.status(500).json({ error: error.message });
  }
};

/////////// CONTACT ///////////

const getContactByClient = async (req, res) => {
  try {
    const { clientId } = req.params;

    const client = await Client.findById(clientId).populate('contacts');

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.status(200).json(client.contacts);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const createContactByClient = async (req, res) => {
  const { clientId, name, title, office, gender, mobile, email } = req.body;

  if (!name || !email || !mobile) {
    return res.status(400).json({ message: 'Name, email, and mobile are required fields' });
  }

  try {
    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    const existingContact = await Contact.findOne({ $or: [{ name }, { mobile }] });
    if (existingContact) {
      return res.status(400).json({ message: 'Contact with the same name or mobile number already exists' });
    }

    const contact = await Contact.create({
      name,
      title,
      office,
      gender,
      mobile,
      email,
      client: client._id,
    });

    client.contacts.push(contact._id);
    await client.save();

    res.status(201).json({
      message: 'Contact created and associated with the client successfully',
      client,
    });
  }catch (error) {
    console.error('Error:', error);
  
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: 'Validation failed', errors: validationErrors });
    }
  
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};


const deleteContact = async (req, res) => {
  const { clientId, contactId } = req.params;

  try {
    const client = await Client.findById(clientId);

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    const contactIndex = client.contacts.indexOf(contactId);

    if (contactIndex === -1) {
      return res.status(404).json({ message: 'Contact not found for the client' });
    }
    client.contacts.splice(contactIndex, 1);
    await client.save();
    await Contact.findByIdAndDelete(contactId);

    res.status(200).json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
const updateContact = async (req, res) => {
  const { clientId, contactId } = req.params;
  const { name, title, office, gender, mobile, email } = req.body;

  try {
    const client = await Client.findById(clientId);

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    const contact = await Contact.findById(contactId);

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    // Update contact properties
    contact.name = name;
    contact.title = title;
    contact.office = office;
    contact.gender = gender;
    contact.mobile = mobile;
    contact.email = email;

    // Save the updated contact
    const updatedContact = await contact.save();

    res.status(200).json(updatedContact);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  updateContact,  
  createClient,
  getClients,
  createContactByClient,
  getClientById,
  getContactByClient,
  deleteContact,
  deleteClient,
  editClient,
};


