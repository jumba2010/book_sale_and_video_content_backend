const mongoose=require('mongoose');

const thematiccontentSchema=new mongoose.Schema({
    title:{type:String,required:true},
    category:{
        type:String,
        required:true,
        enum:[
            'testimony',
            'praise',
            'preaching',
            'prophecy',
            'mariage-testimony',
            'confession']},
    type:{
        type:String,
        required:true,
        enum:[
            'video',
            'card',
            'image']},
    details:String,
    link:String,
    creationDate:{type:Date,required:true,default:Date.now()},
    active:{type:Boolean,required:true,default:true},
    createdBy:{type:String,required:true}  
    })
    
const Thematiccontent=mongoose.model('Thematiccontent',thematiccontentSchema);
module.exports=Thematiccontent;
