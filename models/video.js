const mongoose=require('mongoose');

const videoSchema=new mongoose.Schema({
    title:{type:String,required:true},
    publishDate:{type:Date,required:true,default:Date.now()},
    category:{
        type:String
               },
    url:{type:String,required:true},
    screenshot:{type:String,required:true},
    details:{type:String},
    comments:[{comment:String,senderName:String,senderPicture:String,date:{type:Date,default:Date.now()},likes:Number}],
    author:{type:String,default:'Apóstolo Onorio Cutane'},
    views:{type:Number,required:true,default:0},
    likes:{type:Number,required:true,default:0},
    downloads:{type:Number,required:true,default:0},
    recomended:{type:Boolean,default:false},
    duration:{type:Number,required:true,default:0},
    creationDate:{type:Date,required:true,default:Date.now()},
    active:{type:Boolean,required:true,default:true},
    createdBy:{type:String,required:true}  
    })
    
const Video=mongoose.model('Video',videoSchema);

module.exports=Video;
