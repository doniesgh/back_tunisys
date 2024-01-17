const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ficheInterventionSchema = new Schema(
  {
    numRapport: {
      type: Number,
      unique: true,
      required : true
    },
    type: {
      type: String,
    },
    dateDebut: {
      type: Date,
    },
    dateFin: {
      type: Date,
    },
    client: {
      type: String,
      required: true,
    },
    user:{
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true
    },
    description: { type: String},  },
  { timestamps: true }
);

module.exports = mongoose.model("Intervention", ficheInterventionSchema);
