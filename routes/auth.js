const config=require('config');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');
const _ = require('lodash');
const Joi = require('joi');
const express=require('express');
const User=require('../models/user');
const router=express.Router();

const schema={
        title:Joi.string().min(1).required() 
    };

//Autenticar Utilizador
router.post('/', async (req,res)=>{ 
    // Valida a existencia do user
    let user=await User.findOne({userName:req.body.userName});
    if(!user) return res.status(400).send('Invalid username or  password');
    const validPassword=await bcrypt.compare(req.body.password,user.password);
    if(!validPassword) return res.status(400).send('Invalid username or  password');
    const token=await jwt.sign({_id:user._id,userName:user.userName,profile:user.profile,transactions:user.transactions,name:user.name,picture:user.picture,email:user.email},config.get('jwtPrivateKey'));

    res.send(token);
    
});


module.exports=router;