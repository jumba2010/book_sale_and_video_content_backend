const mongoose=require('mongoose');

const connecteddeviceSchema=new mongoose.Schema({
    device:{type:String},
    token:{type:String,required:true},
    userId:{type:String},
    creationDate:{type:Date,required:true,default:Date.now()},
    updateDate:{type:Date},
    active:{type:Boolean,required:true,default:true},
    createdBy:{type:String,required:true}  
    })
    
const Connecteddevice=mongoose.model('Connecteddevice',connecteddeviceSchema);
module.exports=Connecteddevice;
