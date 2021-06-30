const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: { type: String, required: true},
    userId:{type: String},
    country: { type: String},
    street: String,
    zipcode:String,
    email: String,
    address:String,
    picture:String,
    contact: { type: String },
    creationDate: { type: Date, required: true, default: Date.now() },
    active: { type: Boolean, required: true, default: true },
    createdBy: { type: String, required: true },
   })

const Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;

