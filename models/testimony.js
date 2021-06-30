const mongoose=require('mongoose');

const testimonySchema=new mongoose.Schema({
    title:{type:String,required:true},
    details:{type:String,required:true},
    status:{type:String,required:true,default:'pending'},
    videoLink:String,
    sender:{type:mongoose.Schema.Types.ObjectId,
        ref:'User' },
    creationDate:{type:Date,required:true,default:Date.now()},
    active:{type:Boolean,required:true,default:true},
    createdBy:{type:String,required:true}  
    })
    
const Testimony=mongoose.model('Testimony',testimonySchema);
module.exports=Testimony;
