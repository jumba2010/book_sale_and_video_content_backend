const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    name: { type: String, required: true},
    code:{type: String, required: true},
    roomNumber: { type: Number, required: true },
    capacity: { type: Number, required: true },
    price:{ type: Number, required: true },
    pictures:[{url:{type: String, required: true},main:Boolean}],
    creationDate: { type: Date, required: true, default: Date.now()},
    ocuppationDate: { type: Date, required: true},
    desocuppationDate: { type: Date, required: true},
    status:{type: String, required: true,default:'AVAILABLE'},
    active: { type: Boolean, required: true, default: true },
    createdBy: { type: String, required: true},
   })

const Property = mongoose.model('Property', propertySchema);
module.exports = Property;
