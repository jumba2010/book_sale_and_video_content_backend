const mongoose=require('mongoose');

const anouncementSchema=new mongoose.Schema({
    title:{type:String,required:true},
    type:{type:String,required:true,default:'Evento'},
    banner:{type:String},
    interested:{type:Number,default:0},
    going:{type:Number,default:0},
    notgoing:{type:Number,default:0},
    comments:[{comment:String,senderName:String,senderPicture:String,date:Date,likes:Number}],
    description:{type:String},
    place:{type:String},
    address:{type:String},
    publishDate:{type:Date,required:true},
    creationDate:{type:Date,required:true,default:Date.now()},
    active:{type:Boolean,required:true,default:true},
    createdBy:{type:String,required:true} ,
    updatedBy:{type:String}  
    })
    
const Anouncement=mongoose.model('Anouncement',anouncementSchema);
module.exports=Anouncement;
