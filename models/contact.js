
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contactSchema = new Schema(
  {
    name: {
        type: String,
        required: true,
        unique: true
      },
      title: String,
      office: String,
      gender: String,
      mobile: {
        type: Number,
        required: true,
        unique: true
      },
      email:{
        type: String,
        required: true,
      },
      client: [
        {
          type: Schema.Types.ObjectId,
          ref: "Client",
        },
      ],
  },
  { timestamps: true }
);

const Contact = mongoose.model('Contact', contactSchema);
module.exports = Contact;