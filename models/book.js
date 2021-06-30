const mongoose=require('mongoose');

const bookSchema=new mongoose.Schema({
    title:{type:String,required:true,unique:true},
    publishDate:Date,
    image:{type:String,required:true},
    pageNumbers:Number,
    price:{type:Number,required:true},
    url:{type:String,required:true},
    likes:{type:Number,required:true,default:0},
    details:{type:String,required:true},
    comments:[{comment:String,senderName:String,senderPicture:String,date:Date,likes:Number}],
    author:{type:String,required:true},
    creationDate:{type:Date,required:true,default:Date.now()},
    active:{type:Boolean,required:true,default:true},
    createdBy:{type:String,required:true}  
    })
    
    
const Book=mongoose.model('Book',bookSchema);
module.exports=Book;
