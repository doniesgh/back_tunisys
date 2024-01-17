const Contrat = require('../models/contrat');
const Service = require('../models/service');
const Equipement = require('../models/equipement');

/*
const addService = async (req, res) => {
  try {
    const { effective_date, termination_date, model, quantity, working_hour_start, working_hour_end, response_time_critical, response_time_major, response_time_minor, equipement, contrat } = req.body;

    if (!termination_date || !effective_date || !model || !quantity || !contrat || !equipement) {
      return res.status(400).json({ error: 'All required fields must be filled' });
    }

    const contratExists = await Contrat.findById(contrat);

    if (!contratExists) {
      return res.status(404).json({ error: 'Contrat not found' });
    }
    const newService = new Service({
      termination_date,
      effective_date,
      model,
      quantity,
      working_hour_start,
      working_hour_end,
      response_time_critical,
      response_time_major,
      response_time_minor,
      contrat: contratExists._id,
      equipement: equipement,
    });

    const savedService = await newService.save();

    contratExists.services = contratExists.services || [];

    if (Array.isArray(contratExists.Service)) {
      contratExists.Service.push(savedService._id);
      await contratExists.save();

      const response = {
        service: savedService,
        contratId: contratExists._id,
      };

      return res.status(201).json(response);
    } else {
      console.error('contratExists.services is not an array:', contratExists.services);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};*/
const addService = async (req, res) => {
  try {
    const {
      effective_date,
      termination_date,
      model,
      quantity,
      response_time_critical,
      response_time_major,
      response_time_minor,
      equipement,  // Assuming equipement is an array of equipement IDs
      contrat,
    } = req.body;

    if (!termination_date || !effective_date || !model || !quantity || !contrat || !equipement) {
      return res.status(400).json({ error: 'All required fields must be filled' });
    }

    const contratExists = await Contrat.findById(contrat);

    if (!contratExists) {
      return res.status(404).json({ error: 'Contrat not found' });
    }

    // Assuming Equipement is a Mongoose model
    const equipements = await Equipement.find({ _id: { $in: equipement } });

    if (equipements.length !== equipement.length) {
      return res.status(404).json({ error: 'One or more equipements not found' });
    }

    const newService = new Service({
      termination_date,
      effective_date,
      model,
      quantity,

      response_time_critical,
      response_time_major,
      response_time_minor,
      contrat: contratExists._id,
      equipement: equipements.map((equip) => equip._id),
    });

    const savedService = await newService.save();

    contratExists.services = contratExists.services || [];

    if (Array.isArray(contratExists.services)) {
      contratExists.services.push(savedService._id);
      await contratExists.save();

      const response = {
        service: savedService,
        contratId: contratExists._id,
      };

      return res.status(201).json(response);
    } else {
      console.error('contratExists.services is not an array:', contratExists.services);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const fetchServices = async (req, res) => {
  try {
    const services = await Service.find().populate('contrat');

    res.status(200).json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
const getAllServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (error) {
    console.error('Error getting services:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get a specific service by ID
const getServiceById = async (req, res) => {
  const { serviceId } = req.params;

  try {
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.status(200).json(service);
  } catch (error) {
    console.error('Error getting service by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete a service by ID
const deleteServiceById = async (req, res) => {
  const { serviceId } = req.params;

  try {
    const deletedService = await Service.findByIdAndDelete(serviceId);
    if (!deletedService) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.status(200).json(deletedService);
  } catch (error) {
    console.error('Error deleting service by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  addService,
  getAllServices,
  getServiceById,
  deleteServiceById,
};
