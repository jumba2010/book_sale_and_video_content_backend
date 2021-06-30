const mongoose=require('mongoose');

const sucursalSchema=new mongoose.Schema({
    name:{type:String,required:true},
    foundationDate:Date,
    numberOfBeleavers:Number,
    bornAgainNumber:Number,
    notBornAgainNumber:Number,
    address:{type:String,required:true},
    missionary:{_id:String,name:String,contact:String,email:String,picture:String},
    creationDate:{type:Date,required:true,default:Date.now()},
    updateDate:{type:Date},
    active:{type:Boolean,required:true,default:true},
    createdBy:{type:String,required:true}  
    })
    
const Sucursal=mongoose.model('Sucursal',sucursalSchema);
module.exports=Sucursal;
