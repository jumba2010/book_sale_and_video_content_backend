const express=require('express');
const Payment=require('../models/payment/payment');
const router=express.Router();


// Busca  a ultima compra por userId
router.get('/last/:userId', async (req,res)=>{
    const payments =await Payment.find({userId:req.params.userId})
    .sort({creationDate:-1});
    console.log(payments)
    res.send(payments[0]);
});

// Busca  todas as compras por userId
router.get('/mypayments/:userId', async (req,res)=>{
    const payments =await Payment.find({userId:req.params.userId})
    .sort({creationDate:-1});   
    res.send(payments);
});

// Busca  pagamentos por data
router.get('/recent/:creationDate', async (req,res)=>{
    const payments =await Payment.find({creationDate:req.params.creationDate})
    .sort({creationDate:-1});
    res.send(payments);
});

router.get('/between/:startDate/:endDate', async (req,res)=>{
    const payments =await Payment.find({date:{$gte:req.params.startDate,$lte:req.params.endDate}}).sort({creationDate:-1});
    res.send(payments);   
});

// Busca todos os pagamentos 
router.get('/', async (req,res)=>{
    const payments =await Payment.find()
    .sort({creationDate:-1});
    res.send(payments);
});


module.exports=router;