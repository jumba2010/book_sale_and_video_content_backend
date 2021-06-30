const Joi=require('joi');
const express=require('express');
const thematiccontent=require('../models/thematiccontent');
const router=express.Router();

 const schema={
        title:Joi.string().min(1).required() 
    };

//Criar Conteudo Tematico
router.post('/', async (req,res)=>{

    const {title, category, type,details,link,createdBy}=req.body; 
    let thematiccontent=new Thematiccontent({title, category, type,details,link,createdBy});
    thematiccontent=await thematiccontent.save()
    res.send(thematiccontent);
});


//Actualiza Conteudo Tematico
router.put('/:id', async (req,res)=>{
    const {title, category, type,details,link,createdBy}=req.body;   
      
    const result=await Thematiccontent.update({_id:req.params.id},{
        $set:{title:title, 
            category:category, 
            type:type,
            details:details,
            link:link,
            updatedBy:updatedBy,
            updateDate:Date.now()}
    });   

    res.send(result);
});


//Busca os ultimos 10 conteudos tematicos ordenados pelo mais recente
router.get('/', async (req,res)=>{
    const thematiccontents =await Thematiccontent.find()
    .limit(10)
    .sort({creationDate:-1});
    res.send(thematiccontents);
});

//Busca conteudos temaicos pela categoria
router.get('/:category', async (req,res)=>{
    const thematiccontents =await Thematiccontent.find({category:req.params.category})
    .sort({creationDate:-1});
    res.send(thematiccontents);
});


//Busca conteudos temaicos pela data
router.get('/:date', async (req,res)=>{
    const thematiccontents =await Thematiccontent.find({creationDate:req.params.date});
    res.send(thematiccontents);
});


//Busca conteudos pelo id
router.get('/:id', async (req,res)=>{
    const thematiccontent =await Thematiccontent.findById(req.params.id);
    res.send(thematiccontent);
});

module.exports=router;