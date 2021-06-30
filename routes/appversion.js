const express=require('express');
const Appversion=require('../models/appversion');
const router=express.Router();



//Busca ultima versao
router.get('/last', async (req,res)=>{
    const appversion =await Appversion.findOne();
    res.send(appversion);
});


module.exports=router;