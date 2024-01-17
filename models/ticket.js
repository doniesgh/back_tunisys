const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ticketSchema = new Schema(
    { 
        reference: {
        type: String,
        },
        client:  [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        completion_date: {
            type: Date,
        },
        starting_date: {
            type: Date,
        },
        departure_date: {
            type: Date,
        },
        accepting_date: {
            type: Date,
        },
       
        description:{
            type:String
        },
        call_time :{
            type:Date
        },
        service_type:{
            type:String
        },
        
        technicien: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        equipement_sn: [
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
        ],localisation:{
            type:String
        },
        statue:{
            type:String
        },
        contact :{
            type:String
        }
    },
    { timestamps: true }
);


const Ticket = mongoose.model('Ticket', ticketSchema);
module.exports = Ticket;
