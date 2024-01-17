const Contrat = require('./../models/contrat');
const Client = require('./../models/client');

const addContrat = async (req, res) => {
  try {
    const { client, service_cn, attachement, effective_date, termination_date,contrat_sn } = req.body;

    if (!client || !service_cn || !termination_date) {
      return res.status(400).json({ error: 'All required fields must be filled' });
    }

   
    const clientExists = await Client.findById(client);

    if (!clientExists) {
      return res.status(404).json({ error: 'Client not found' });
    }
    const newContrat = new Contrat({
      contrat_sn,
      service_cn,
      attachement,
      effective_date,
      termination_date,
      client: clientExists._id,
    });
    const savedContrat = await newContrat.save();
    clientExists.contrats = clientExists.contrats || [];
    console.log('clientExists:', clientExists);

    if (Array.isArray(clientExists.contrats)) {
      clientExists.contrats.push(savedContrat._id);
      await clientExists.save();

      const response = {
        contrat: savedContrat,
        clientId: clientExists._id,
      };

      return res.status(201).json(response);
    } else {
      console.error('clientExists.contrats is not an array:', clientExists.contrats);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } catch (error) {
    console.error(error);

    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ error: 'Validation failed', errors: validationErrors });
    }
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Duplicate key violation. The combination of contrat_sn and service_cn must be unique.' });
    }

    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

  

const fetchContrats = async (req, res) => {
    try {
        const contracts = await Contrat.find().populate('client');

        res.status(200).json(contracts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
const viewContratById = async (req, res) => {
    try {
        const { contratId } = req.params;
        if (!contratId) {
            return res.status(400).json({ error: 'Contract ID is required' });
        }

        // Check if the contract exists
        const contract = await Contrat.findById(contratId).populate('client');

        if (!contract) {
            return res.status(404).json({ error: 'Contract not found' });
        }

        res.status(200).json(contract);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
const deleteContrat = async (req, res) => {
  try {
    const { contratId } = req.params;
    if (!contratId) {
      return res.status(400).json({ error: 'Contract ID is required' });
    }
    const contract = await Contrat.findById(contratId);
    if (!contract) {
      return res.status(404).json({ error: 'Contract not found' });
    }
    const client = await Client.findById(contract.client);
    if (client) {
      client.contrats = client.contrats.filter((id) => id.toString() !== contratId);
      await client.save();
    }
    await Contrat.findByIdAndDelete(contratId);
    res.status(200).json({ message: 'Contract deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
const updateContrat = async (req, res) => {
  try {
    const { contratId } = req.params;
    const { client, service_cn, attachement, effective_date, termination_date, contrat_sn } = req.body;
    if (!contratId) {
      return res.status(400).json({ error: 'Contract ID is required' });
    }
    const existingContract = await Contrat.findById(contratId);
    if (!existingContract) {
      return res.status(404).json({ error: 'Contract not found' });
    }
    let clientExists = null;
    if (client) {
      clientExists = await Client.findById(client);

      if (!clientExists) {
        return res.status(404).json({ error: 'Client not found' });
      }
    }
    existingContract.client = clientExists ? clientExists._id : existingContract.client;
    existingContract.service_cn = service_cn || existingContract.service_cn;
    existingContract.attachement = attachement || existingContract.attachement;
    existingContract.effective_date = effective_date || existingContract.effective_date;
    existingContract.termination_date = termination_date || existingContract.termination_date;
    existingContract.contrat_sn = contrat_sn || existingContract.contrat_sn;
    const updatedContract = await existingContract.save();
    res.status(200).json({ message: 'Contract updated successfully', updatedContract });
  } catch (error) {
    console.error(error);
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ error: 'Validation failed', errors: validationErrors });
    }
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
module.exports = {
    addContrat,
    fetchContrats,
    viewContratById,
    deleteContrat,
    updateContrat
};
