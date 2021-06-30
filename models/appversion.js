const mongoose=require('mongoose');

const appversionSchema=new mongoose.Schema({
    version:{type:String},
    updateDate:{type:Date},
    critical:{type:Boolean,required:true,default:true},   
    })
    
const Appversion=mongoose.model('Appversion',appversionSchema);
module.exports=Appversion;
