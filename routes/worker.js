const Joi=require('joi');
const express=require('express');
const Worker=require('../models/worker');
const router=express.Router();

 const schema={
        title:Joi.string().min(1).required() 
    };

//Cria Membro
router.post('/', async (req,res)=>{

    const {birthDate, picture, name,email,contact,category,maritulstatus,address,user,createdBy}=req.body; 
    let worker=new Worker({birthDate, maritulstatus,address, name,email,contact,category,user,picture,createdBy});
    worker=await worker.save()
    res.send(worker);
});


//Actualiza Obreiro
router.put('/:id', async (req,res)=>{
    const {birthDate, picture, name,email,contact,category,maritulstatus,address,user,updatedBy}=req.body;   
      
    const result=await Worker.update({_id:req.params.id},{
        $set:{birthDate:birthDate, 
            address:address, 
            name:name,
            email:email,
            contact:contact,
            category:category,
            maritulstatus:maritulstatus,
            picture:picture,
            user:user,
            updatedBy:updatedBy}
    });   

    res.send(result);
});

router.put('/profile', async (req,res)=>{
    const { picture, name,email,contact,address}=req.body; 
    const result=await Worker.update({contact:contact},{
        $set:{
            address:address, 
            name:name,
            email:email,
            contact:contact,
            picture:picture
          }
    });   

    res.send(result);
});

//Busca Todos os Membros
router.get('/:page', async (req,res)=>{
    var page=req.params.page;
    const workers =await Worker.find().skip((6*page)-6).limit(6).sort({creationDate:-1});
    res.send(workers);
});

//Busca Obreiro pelo id
router.get('/unique/:id', async (req,res)=>{
    const worker =await Worker.findOne({_id:req.params.id});
    res.send(worker);
});

//Busca total
router.get('/count/alll/workers', async (req,res)=>{
    const total =await Worker.countDocuments();
    res.status(200).json({
        total: total
      });
  
});


router.get('/count/all/workers/:startDate/:endDate', async (req,res)=>{
    const total =await Worker.countDocuments({date:{$gte:req.params.startDate,$lte:req.params.endDate}});
    res.status(200).json({
        total: total
      });  
});

module.exports=router;