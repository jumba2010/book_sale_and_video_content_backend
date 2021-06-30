const express = require('express');
const Customer = require('../models/payment/customer');
const router = express.Router();

//Crete Customer
router.post('/', async (req, res) => {

    const { name, country, street, zipcode, email, contact, createdBy } = req.body;
    let request = new Request({ name, country, street, zipcode, email, contact, createdBy });
    request = await request.save()
    res.send(request);
});

//Update Customer
router.put('/:id', async (req, res) => {
    const { name, country, street, zipcode, email, contact, updatedBy } = req.body;

    const result = await Customer.update({ _id: req.params.id }, {
        $set: {
            name, country, street, zipcode, email, contact, updatedBy
        }
    });

    res.send(result);
});

// Busca  todos os customers por userId
router.get('/last/:userId', async (req,res)=>{
    const customer =await Customer.findOne({userId:req.params.userId})
    .sort({creationDate:-1});
    res.send(customer);
});

router.get('/:id', async (req,res)=>{
    const customer =await Customer.findOne({_id:req.params.id})  
    res.send(customer);
});

module.exports = router;