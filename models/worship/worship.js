const mongoose=require('mongoose');

const worshipSchema=new mongoose.Schema({
    missionary: {type:String,required:true},
    sucursal:{type:String,required:true},
    helper:{type:String},
    status:{type:String,required:true,default:'Pendente de Avaliação'},
    oldbelievers:String,
    newbelievers:String,
    date:{type:String,required:true},
       topic:{type:String,required:true},
    startTime:{type:Date,required:true,default:Date.now()},
    endTime:{type:Date,required:true,default:Date.now()},
    endHour:Number,
    endMinute:Number,
    startHour:Number,
    startMinute:Number,
    progress:{type:String},
    chalenge:String,
    remarks:{type:String},
    moneycontributions:[
        {
            designation:{type:String,required:true},          
            amount: {type:Number,required:true}
        }
    ],
    speciecontributions:[
        {
            designation:{type:String,required:true},          
            quantity: {type:Number,required:true},
            unity: {type:String,required:true, default:'Unidade(s)'}
        }
    ],

    testimonies:[
        {
            type:{type:String,required:true},          
            description: {type:String,required:true},
            owner: {type:String,required:true},
        }
    ],

    creationDate:{type:Date,required:true,default:Date.now()},
    active:{type:Boolean,required:true,default:true},
    createdBy:{type: String},
    updateDate:Date ,
    updatedBy:{type:String}, 
    })
    
const Worship=mongoose.model('Worship',worshipSchema);
module.exports=Worship;
