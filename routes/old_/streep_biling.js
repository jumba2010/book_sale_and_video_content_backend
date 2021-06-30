const keys = require('../../config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const express=require('express');
const router=express.Router();


//Pagar com cartao via streep
router.post('/card', async (req,res)=>{
         
     const charge=await stripe.charges.create({
        amount: 2000,
        currency: 'usd',
        description:'Compra do Livro Nao Rompa O muro',
          source:req.body.id
      });
      res.send(token);
    
});


//Pagar com via paypal
router.post('/payal', async (req,res)=>{     
 
 
 
 
 
 
  const charge=await stripe.charges.create({
     amount: 2000,
     currency: 'usd',
     description:'Compra do Livro Nao Rompa O muro',
       source:req.body.id
   });
   res.send(token);
 
});


module.exports=router;