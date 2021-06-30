const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: String,
    picture:{ type: String, default: 'blank_picture.png' },
    email: String,
    contact: String,
    phoneVerified:Boolean,
    contactprefix:String,
    latitude:String,
    longitude:String,
    countryCode:String,   
    countryName:String,
    currency:String,
    continent:String,
    zipcode:String,
    profile: {
        type: String,
        required: true
    },
    transactions: [{
        code: String,
        description: String,       
    }],
    creationDate: { type: Date, required: true, default: Date.now() },
    active: { type: Boolean, required: true },
    createdBy: { type: String, required: true },
    address: String
})

const User = mongoose.model('User', userSchema);
module.exports = User;
