const Joi=require('joi');
const express=require('express');
const Request=require('../models/request');
const router=express.Router();

   //Envia Pedido
router.post('/', async (req,res)=>{

    const {title, type, createdBy,details,sender}=req.body; 
    let request=new Request({title,type,details,sender,createdBy});
    request=await request.save()
    res.send(request);
});


//Actualiza Pedido
router.put('/:id', async (req,res)=>{
    const {title, type, details,updatedBy}=req.body;   
      
    const result=await Request.findByIdAndUpdate(req.params.id,{
        $set:{
            title:title,
            type:type,
            details:details,
            updateDate:Date.now(),
            updatedBy:updatedBy
        }
    },{new:true});   

    res.send(result);
});

//Responder Pedido
router.put('/answer/:id', async (req,res)=>{
    const {answer, status,updatedBy}=req.body;   
      
    const result=await Request.findByIdAndUpdate(req.params.id,{
        $set:{
            status:status,
            answer:answer,
            updateDate:Date.now(),
            updatedBy:updatedBy
        }
    },{new:true});   

    res.send(result);
});

//Busca todos os Pedidos
router.get('/', async (req,res)=>{
    const request =await Request.find().populate('sender');
    res.send(request);
});

//Busca todos os Pedidos Activos
router.get('/active', async (req,res)=>{
    const request =await Request.find({active:true}).populate('sender');
    res.send(request);
});

//Busca Pedidos pelo estado 
router.get('/:status', async (req,res)=>{
    const request =await Request.find({status:req.params.status,active:true}).sort({creationDate:-1}).populate('sender');
    res.send(request);
});


//Busca Pedido pelo id
router.get('/:id', async (req,res)=>{
    const request =await Request.findById(req.params.id).populate('sender');
    res.send(request);
});

module.exports=router;