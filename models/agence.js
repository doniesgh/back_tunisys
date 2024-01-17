const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const agenceSchema = new Schema(
  {
    localisation: {
      type: String,
    },
    code_agence: {
      type: String,
    },
    rue: {
      type: String,
    },
    client: [
      {
        type: Schema.Types.ObjectId,
        ref: "Client",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Agence = mongoose.model("Agence", agenceSchema);
module.exports = Agence;