const Joi=require('joi');
const express=require('express');
const Testimony=require('../models/testimony');
const router=express.Router();

   //Criar Testemunho
router.post('/', async (req,res)=>{

    const {title, details, status,videoLink,createdBy}=req.body; 
    let testimony=new Testimony({title, details, status,videoLink,createdBy});
    testimony=await testimony.save()
    res.send(testimony);
});


//Actualiza Testemunho
router.put('/:id', async (req,res)=>{
    const {title, details, status,videoLink,createdBy}=req.body;   
      
    const result=await Testimony.update({_id:req.params.id},{
        $set:{
            title:title,
            type:type,
            status:status,
            details:details,
            updateDate:Date.now(),
            videoLink:videoLink,
            updatedBy:updatedBy
        }
    });   

    res.send(result);
});

//Aprovar Testemunho
router.put('/acept', async (req,res)=>{
    const {title}=req.body;   
      
    const result=await Testimony.update({_id:req.params.resp},{
        $set:{
            status:'published',
            title:title,
            updateDate:Date.now(),
            updatedBy:updatedBy
        }
    });   

    res.send(result);
});

//Busca todos os Testemunhos ordenados pelo mais recente
router.get('/', async (req,res)=>{
    const testimony =await Testimony.find()
    .populate('sender')
    .sort({creationDate:-1});
    res.send(testimony);
});

//Busca todos os Testemunhos ordenados pelo mais recente
router.get('/active', async (req,res)=>{
    const testimony =await Testimony.find()
    .populate('sender')
    .sort({creationDate:-1});
    res.send(testimony);
});

//Busca os primeiros 5 Testemunhos pelo estado 
router.get('/:status', async (req,res)=>{
    const testimony =await Testimony.find({status:req.params.status,active:true})
    .populate('sender')
    .limit(5)
    .sort({creationDate:-1});
    res.send(testimony);
});


//Busca Testemunho pelo id
router.get('/:id', async (req,res)=>{
    const testimony =await Testimony.findById(req.params.id)
    .populate('sender');
    res.send(testimony);
});

module.exports=router;