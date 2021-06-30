const Joi=require('joi');
const express=require('express');
const Transaction=require('../models/transaction');
const router=express.Router();

//Busca Todas as Transacoes
router.get('/', async (req,res)=>{
    const transactions =await Transaction.find().sort('description');
    res.send(transactions);
});


module.exports=router;