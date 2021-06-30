const express=require('express');
const Connecteddevice=require('../models/connecteddevice');
const router=express.Router();

   //Regista o token
router.post('/', async (req,res)=>{

    const {device,token,userId,createdBy}=req.body; 
    let connecteddevice=new Connecteddevice({device,token,userId,createdBy});
    connecteddevice=await connecteddevice.save()
    res.send(connecteddevice);
});


//Actualiza token
router.put('/', async (req,res)=>{
    const {device,token}=req.body; 
      
    const result=await Connecteddevice.findOneAndUpdate({device:device},{
        $set:{token
          }
    });   

    res.send(result);
});


//Busca token por dispositivo
router.get('/:device', async (req,res)=>{
    const connecteddevices =await Connecteddevice.find({device:req.params.device});
    res.send(connecteddevices);
});

//Busca todos os tokens
router.get('/', async (req,res)=>{
    const connecteddevices =await Connecteddevice.find();
    res.send(connecteddevices);
});

module.exports=router;