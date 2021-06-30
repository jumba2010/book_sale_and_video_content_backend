const mongoose=require('mongoose');

const patnerSchema=new mongoose.Schema({
    code: {type:String,required:true},
    name: {type:String,required:true},
    picture: {type:String},   
    email:{type:String},
    contact:{type:String,required:true},
    address:{type:String,required:true},
    phoneVerified:Boolean,
    contactprefix:String,
    latitude:String,
    longitude:String,
    countryCode:String,   
    countryName:String,
    currency:String,
    continent:String,
    zipcode:String,
    compromisse:
        {
            type:{type:String,required:true}, 
            frequency:{type:String,required:true},
            destination:{type:String},   
            designation:{type:String},     
            amount: {type:Number},
            year: {type:Number,required:true},
            month: {type:Number,required:true},
        }
    ,
    creationDate:{type:Date,required:true,default:Date.now()},
    active:{type:Boolean,required:true,default:true},
    createdBy:{type: String},
    updateDate:Date ,
    updatedBy:{type:String}, 
    })
    
const Patner=mongoose.model('Patner',patnerSchema);
module.exports=Patner;
