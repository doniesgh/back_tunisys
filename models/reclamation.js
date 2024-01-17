const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reclamationSchema = new Schema({
    user_id:{
        type: String,
        required : true,
    },
    idn: {
        type: Number,
        unique: true,
        required : true
    },
    type: {
        type: String,
    },
    client: {
        type: String,
        required: true,
    },
    equipement: {
        type: String,
        required: true,
    },
    localisation: {
        type: String,
        required: true
    },
    creerpar: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    traiteur: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    etat: {
        type: String,
        enum: ['affecté', 'en cours', 'finalise','reporte'],
        default: "affecté"
    }
}, { timestamps: true });

module.exports = mongoose.model('Reclamation', reclamationSchema);
