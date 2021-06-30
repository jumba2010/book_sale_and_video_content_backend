const Joi=require('joi');
const express=require('express');
const Sucursal=require('../models/sucursal');
const router=express.Router();

   //Cria Sucursal
router.post('/', async (req,res)=>{

    const {name, foundationDate, numberOfBeleavers,bornAgainNumber,notBornAgainNumber,address,createdBy}=req.body; 
    let sucursal=new Sucursal({name, foundationDate, numberOfBeleavers,bornAgainNumber,notBornAgainNumber,address,createdBy});
    sucursal=await sucursal.save()
    res.send(sucursal);
});


//Actualiza Sucursal
router.put('/:id', async (req,res)=>{
    const {name, foundationDate, numberOfBeleavers,bornAgainNumber,notBornAgainNumber,address,missionary}=req.body; 
      
    const result=await Sucursal.findByIdAndUpdate({_id:req.params.id},{
        $set:{name, 
            foundationDate, 
            numberOfBeleavers,
            bornAgainNumber,
            notBornAgainNumber,
            missionary,
            address,updateDate:Date.now()}
    });   

    res.send(result);
});

//Alocar Missionario 
router.put('/missionary/:id', async (req,res)=>{
    const {missionary}=req.body;

       let mission={_id:missionary._id,name:missionary.name,contact:missionary.contact,picture:missionary.picture};
          const result=await Sucursal.findOneAndUpdate({_id:req.params.id},{
        $set:{missionary:mission,updateDate:Date.now()}
    });   

    res.send(result);
});


//Busca todas as celulas do  Ministerio
router.get('/', async (req,res)=>{
    const sucursals =await Sucursal.find();
    res.send(sucursals);
});

//Busca todos os registos paginados em 6 elementos
router.get('/all/:page', async (req,res)=>{
    var page=req.params.page;
    const sucursals =await Sucursal.find().skip((6*page)-6).limit(6).sort({creationDate:-1});
    res.send(sucursals);
});

//Busca total
router.get('/count/alll/sucursals', async (req,res)=>{
    const total =await Sucursal.countDocuments();
    res.status(200).json({
        total: total
      });
  
});

//Busca todas as celulas pelo missionary
router.get('/missionary/:missionaryId', async (req,res)=>{
    const sucursals =await Sucursal.findOne({'missionary._id':req.params.missionaryId});
    res.send(sucursals);
});


//Busca celula pelo id
router.get('/:id', async (req,res)=>{
    const sucursal =await Sucursal.findById(req.params.id);
    res.send(sucursal);
});

module.exports=router;