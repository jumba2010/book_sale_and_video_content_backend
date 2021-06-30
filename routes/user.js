const bcrypt=require('bcrypt');
const _ = require('lodash');
const Joi = require('joi');
const express=require('express');
const User=require('../models/user');
const router=express.Router();

 const schema={
        title:Joi.string().min(1).required() 
    };

//Cria Utilizador
router.post('/', async (req,res)=>{
   
    const {userName, password,phoneVerified,continent,countryName,currency,countryCode,longitude, latitude,name,email,contact,contactprefix,profile,createdBy,address,transactions,picture,active}=req.body;

    const salt=await bcrypt.genSalt(10);
    
    // Valida a existencia do user
    if(email){
    let user2=await User.findOne({email:email});
    if(user2) return res.status(400).send({error:'Este email está sendo usado'});
}
    let user=await User.findOne({userName:userName});
    
    if(user) return res.status(400).send({user:user});
    let user1=await User.findOne({contact:contact,contactprefix:contactprefix});
    if(user1) return res.status(401).send({user:user1});
   
    
    user=new User({userName, contactprefix,name,email,contact,profile,createdBy,address,transactions,picture,phoneVerified,continent,countryName,currency,countryCode,longitude, latitude,active});
    user.password=await bcrypt.hash(password,salt);
    user=await user.save()
    res.send(_.pick(user,['_id','userName','name','email','contact','contactprefix','countryName','creationDate','profile','address','transactions','picture']));
});

router.put('/password', async (req,res)=>{   
    var {userName, password}=req.body;
    console.log(password)
    const salt=await bcrypt.genSalt(10);
    password= await bcrypt.hash(password,salt);
    
    const result=await User.updateOne({userName:userName,active:true},{
        $set:{
            password:password
                }
    }); 
    
    res.send(result);
});


//Actualiza Utilizador
router.put('/:id', async (req,res)=>{
     const {name,email,contact,profile,updatedBy,address,transactions}=req.body;     
      
    const result=await User.update({_id:req.params.id},{
        $set:{
                      name:name,
            email:email,
            contact:contact,
            profile:profile,
            updatedBy:updatedBy,
            address:address,
            transactions:transactions
                }
    });   

    res.send(result);
});

//Actualiza Utilizador
router.put('/profile/:id', async (req,res)=>{
    const {name,email,contact,address}=req.body;
    console.log('Actualizando',req.params.userName);
    const result=await User.update({_id:req.params.id},{
        $set:{
            name:name,
            email:email,
            contact:contact,
            address:address
            }
    });   
    console.log(result);
    res.send(result);
});

router.get('/unique/:contact', async (req,res)=>{
    const user =await User.findOne({contact:req.params.contact});
    res.send(user);
});

//Busca Todos os Utilizadores
router.get('/', async (req,res)=>{
    const users =await User.find();
    res.send( _.map(users, _.partialRight(_.pick,['_id','userName','name','email','contact','contactprefix','countryName','creationDate','profile','address','transactions','picture'])));
});


//Busca Todos os Missionários
router.get('/missionary', async (req,res)=>{
    const missionaries =await User.find({profile:'Missionário',active:true}).sort({name:1});
    res.send( _.map(missionaries, _.partialRight(_.pick,['_id','userName','name','email','contact','contactprefix','countryName','creationDate','profile','address','transactions','picture'])));
});

//Busca todos os parceiros paginados em 6 elementos
router.get('/all/:page', async (req,res)=>{
    var page=req.params.page;
    const elementsperpage = 6;  
    const users =await User.find().skip((elementsperpage*page)-elementsperpage).limit(elementsperpage).sort({creationDate:-1});
    res.send(_.map(users, _.partialRight(_.pick,['_id','userName','name','email','contact','contactprefix','countryName','creationDate','profile','address','transactions','picture'])));
});

//Busca total
router.get('/count/all/users', async (req,res)=>{
    const total =await User.countDocuments();
    res.status(200).json({
        total: total
      });  
});

//Busca Utilizador pelo userName
router.get('/:userName', async (req,res)=>{
    const user =await User.findOne({userName:req.params.userName});
    res.send(_.pick(user,['_id','userName','name','email','contact','contactprefix','countryName','creationDate','profile','address','transactions','picture']));
});

module.exports=router;