const mongoose=require('mongoose');

const livevideoSchema=new mongoose.Schema({
    videoId:{type:String,required:true},
    type:{type:String,required:true},
    date:{type:Date,required:true,default:Date.now()},   
    snapshot:{type:String}
        })    
   
const LiveVideo=mongoose.model('LiveVideo',livevideoSchema);
module.exports=LiveVideo;