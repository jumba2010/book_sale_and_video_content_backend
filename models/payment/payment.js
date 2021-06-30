const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    userId:{type: String, required: true},
    paymentId:{ type: String, required: true},
    payerId:{ type: String, required: true },
    token:{ type: String, required: true },
    status: { type: String, required: true,default: 'COMPLETE'},
    total: { type: Number, required: true },
    description:{ type: String, required: true},
    discount: String, 
    items: [{
        code: String,
        name:String,                
        description: String,   
        price: {type:Number,required:true},
        quantity:{ type: Number, required: true, default: 1},
        url:String, 
        total: {type:Number,required:true},
    }],
    customer: { type: mongoose.Schema.Types.ObjectId, ref:'Customer' } ,
    creationDate: { type: Date, required: true, default: Date.now() },
    active: { type: Boolean, required: true ,default: true},
    createdBy: { type: String, required: true },
    address: String
})

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
