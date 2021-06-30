const mongoose=require('mongoose');

const requestSchema=new mongoose.Schema({
    title:String,
    type:String,
    status:{type:String,required:true,default:'pending'},
    details:String,
    answer:String,
    sender:{type:mongoose.Schema.Types.ObjectId,
        ref:'User' },
    creationDate:{type:Date,required:true,default:Date.now()},
    active:{type:Boolean,required:true,default:true},
    createdBy:{type:String,required:true},
    updateDate:Date ,
    updatedBy:String, 
    })
    
const Request=mongoose.model('Request',requestSchema);
module.exports=Request;
