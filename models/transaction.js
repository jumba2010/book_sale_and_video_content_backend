const mongoose=require('mongoose');

const transactionSchema=new mongoose.Schema({
    code:{type:String,required:true},
    description:{type:String,required:true}
    })
    
const Transaction=mongoose.model('Transaction',transactionSchema);
module.exports=Transaction;
