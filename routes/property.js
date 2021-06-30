const express = require('express');
const Property = require('../models/booking/property');
const router = express.Router();

router.post('/', async (req, res) => {
    const { code, name, roomNumber, capacity, pictures, status, createdBy } = req.body;
    let request = new Property({ code, name, roomNumber, capacity, pictures, status, createdBy });
    request = await request.save()
    res.send(request);
});


router.put('/reserve/:id', async (req, res) => {
    const { ocuppationDate,desocuppationDate, updatedBy } = req.body;

    const result = await Property.updateOne({ _id: req.params.id }, {
        $set: {
            status:'RESERVED', ocuppationDate, desocuppationDate, updatedBy
        }
    });

    res.send(result);
});

router.put('/release/:code', async (req, res) => {
    const {updatedBy } = req.body;

    const result = await Property.updateOne({ code: req.params.code }, {
        $set: {
            status:'AVAILABLE', ocuppationDate:'', desocuppationDate:'', updatedBy
        }
    });

    res.send(result);
});

//Busca todos os quartos que estejam disponiveis ou os que estarao disponivesis ate a data de fim
router.get('/available/:endDate', async (req,res)=>{

    let endDate=new Date(req.params.endDate)
    const property =await Property.find({$or:[
    {status:'AVAILABLE'},
    {$and:[
        {status:'RESERVED'},
        {desocuppationDate:{$lt:endDate}}        
    
    ]}        
    ]})
    .sort({status:1});
    res.send(property);
});

router.get('/', async (req,res)=>{
    const property =await Property.find(
    )
    .sort({creationDate:-1});
    res.send(property);
});


module.exports = router;