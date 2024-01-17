const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const serviceSchema = new Schema(
  {
    model: {
      type: String,
      required: true,
    },
    effective_date: Date,
    termination_date: {
      type: Date,
      required: true,
    },
    quantity: {
      type: String,
      required: true,
    },
    /*working_hour_start :{
      type: Date,
      required: true,
    },
    working_hour_end :{
      type: Date,
      required: true,
    },*/
    response_time_critical :{
      type: Number,
    },
    response_time_major:{
      type: Number,
    },
    response_time_minor :{
      type: Number,
    },
    equipement: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Equipement',
      },
    ],
    contrat: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Contrat',
      },
    ],
  },
  { timestamps: true }
);


const Service = mongoose.model('Service', serviceSchema);
module.exports = Service;
