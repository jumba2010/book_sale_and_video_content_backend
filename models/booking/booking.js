const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: { type: String },
    status: { type: String, required: true, default: 'PENDING' },
    checkinDate: { type: Date, required: true },
    checkoutDate: { type: Date, required: true },
    numberOfDays: { type: Number, required: true },
    total: { type: Number, required: true },
    description: { type: String, required: true },
    discount: Number,
    persons: {type: Number, required: true },
    remarks: { type: String },
    property: {
        code: { type: String, required: true },
        roomNumber: { type: Number, required: true },
        capacity: { type: Number, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        total: { type: Number, required: true },
        pictures:[{url:{type: String, required: true},main:Boolean}],
    },
    customer: {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
        name: { type: String, required: true },
        address: { type: String },
        picture:String,
        country: { type: String },
        street: String,
        zipcode: String,
        email: { type: String},
        contact: { type: String }
    },
    creationDate: { type: Date, required: true, default: Date.now() },
    active: { type: Boolean, required: true, default: true },
    createdBy: { type: String, required: true }
})

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
