const Intervention = require("../models/ficheIntervention");
const mongoose = require("mongoose");
exports.getInterventionByUserId = async (req, res) => {
  try {
    const user = req.user && req.user._id;  
    const interventions = await Intervention.find({ user: user }).sort({ createdAt: -1 });

    if (interventions.length === 0) {
      return res.status(404).json({ message: "No interventions found for this user" });
    }

    res.status(200).json(interventions);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
exports.createIntervention = async (req, res) => {
  const user = req.user && req.user._id;
  if (!user) {
    return res.status(400).json({ error: "User not authenticated or missing _id" });
  }  
  const { dateDebut, client, dateFin, type, numRapport, description } =
    req.body;
  const existingIntervention = await Intervention.findOne({ numRapport });

  if (existingIntervention) {
    return res
      .status(400)
      .json({ error: "Le numéro de rapport doit être unique." });
  }
  let emptyFields = [];
  if (!user) {
    emptyFields.push("user");
  }
  if (!dateDebut) {
    emptyFields.push("dateDebut");
  }

  if (!dateFin) {
    emptyFields.push("dateFin");
  }

  if (!type) {
    emptyFields.push("type");
  }

  if (!client) {
    emptyFields.push("client");
  }

  if (!numRapport) {
    emptyFields.push("numRapport");
  }

  if (!description) {
    emptyFields.push("description");
  }
  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: "Veuillez remplir tous les champs.", emptyFields });
  }

  // add to the database
  try {
    const intervention = await Intervention.create({
      user,
      dateDebut,
      dateFin,
      type,
      client,
      numRapport,
      description,
    });

    res.status(200).json(intervention);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
