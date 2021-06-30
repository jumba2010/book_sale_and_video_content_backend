const mongoose=require('mongoose');

const workerSchema=new mongoose.Schema({
    name:{type:String,required:true},
    birthDate:{type:Date,required:true},
    maritulstatus:{
        type:String,
        required:true,
       },
    contact:String,
    category:{
        type:String,
        required:true,
       },
       picture:{ type: String, default: 'blank_picture.png' },
    baptimsDate:Date,
    address:{
        type:String,
        required:true,
       },
    email:String,
    user:Boolean,
    creationDate:{type:Date,required:true,default:Date.now()},
    active:{type:Boolean,required:true,default:true},
    createdBy:{type:String,required:true}  
    })
    
const Worker=mongoose.model('Worker',workerSchema);
module.exports=Worker;
