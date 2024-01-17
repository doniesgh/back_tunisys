/*const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientSchema = new Schema(
  {
    agences: [{ type: Schema.Types.ObjectId, ref: 'Agence' }], 
    name: String,
    code_client: Number,
  },
  {
    timestamps: true,
  }
);

const Client = mongoose.model('Client', clientSchema);
module.exports = Client;
*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const contactSchema = require('./contact');
const contratSchema = require('./contrat');


const clientSchema = new Schema(
  {
    client: {
      type: String,
      required: true,
      unique: true
    },
    adresse: {
      type: String,
      required: true,
      unique: true
    },
    email: String,
    corporate: String,
    title: String,
    mobile: {
      type: Number,
      required: true,
      unique: true
    },
    office: String,
    contacts: [{
      type: Schema.Types.ObjectId,
      ref: 'Contact',
    }],
    contrats: [{
      type: Schema.Types.ObjectId,
      ref: 'Contrat',
    }],
  },
  { timestamps: true }
);clientSchema.index({ client: 1, email: 1, mobile: 1 }, { unique: true });

const Client = mongoose.model('Client', clientSchema);
module.exports = Client;