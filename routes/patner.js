const Joi=require('joi');
const express=require('express');
const Patner=require('../models/patner')
const router=express.Router();

   //Cria Parceiro
router.post('/', async (req,res)=>{
    const {code,name,lastname,email,contact,
        address,compromisse,picture,phoneVerified,continent,countryName,currency,countryCode,longitude, latitude,contactprefix,createdBy}=req.body; 
      
    let patner=new Patner({code,name,lastname,email,contact,
        address,compromisse,picture,phoneVerified,continent,countryName,currency,countryCode,longitude, latitude,contactprefix,createdBy});
        patner=await patner.save();
    res.send(patner);
    
});

router.put('/:id', async (req,res)=>{
  const   {code,name,lastname,email,contact,
    address,compromisse,picture,updatedBy}=req.body;
     
   const result=await Patner.findByIdAndUpdate(req.params.id,{
       $set:{
        code,name,lastname,email,contact,
        address,compromisse,picture,updatedBy
                 }
   });   

   res.send(result);
});


//Busca todos os Parceiros
router.get('/', async (req,res)=>{
    const patner =await Patner.find({active:true}).sort({creationDate:-1});
    res.send(patner);
});

//Busca todos os parceiros paginados em 6 elementos
router.get('/all/:page', async (req,res)=>{
    var page=req.params.page;
    const elementsperpage = 6;  
    const patners =await Patner.find().skip((elementsperpage*page)-elementsperpage).limit(elementsperpage).sort({creationDate:-1});
    res.send(patners);
});

//Busca parceiros paginados em 6 elementos
router.get('/by/:name/:creatinoDate/:year/:month/:page', async (req,res)=>{
    var page=req.params.page;
    const elementsperpage = 6;  
    const patners =await Patner.find().skip((elementsperpage*page)-elementsperpage).limit(elementsperpage).sort({creationDate:-1});
    res.send(patners);
});

//Busca total
router.get('/count/all/patners', async (req,res)=>{
    const total =await Patner.countDocuments();
    res.status(200).json({
        total: total
      });  
});

router.get('/count/by/:name/:creatinoDate/:year/:month/:page', async (req,res)=>{
    const total =await Patner.countDocuments();
    res.status(200).json({
        total: total
      });  
});


//Busca Parceiro por Id 
router.get('/:id', async (req,res)=>{
    const patner =await Patner.findOne({active:true,_id:req.params.id});
    res.send(patner);
});


module.exports=router;