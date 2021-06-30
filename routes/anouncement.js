const Joi = require('joi');
const express = require('express');
const Anouncement = require('../models/anouncement');
const router = express.Router();

const schema = {
    title: Joi.string().min(1).required()
};

//Cria Anuncio
router.post('/', async (req, res) => {

    const { title, publishDate, banner, type, place, address, description, createdBy } = req.body;

    //TODO: Chamar um validador de campos

    let anouncement = new Anouncement({ title, publishDate, banner, type, place, address, description, createdBy });
    anouncement = await anouncement.save();
    res.send(anouncement);
});

router.put('/:id', async (req, res) => {
    const { title, banner, type, place, address, description, updatedBy } = req.body;

    const result = await Anouncement.findOneAndUpdate(req.params.id, {
        $set: {
            title,
            banner,
            type,
            place,
            address,
            description,
            updatedBy
        }
    }, { new: true });

    res.send(result);
});


//Comentar sobre o evento
router.put('/comment/:id', async (req, res) => {
    const { comment } = req.body;
    comment.date=Date.now();
    const anouncement = await Anouncement.findOne({ _id: req.params.id });
    let comments = anouncement.comments
    comments.push(comment);
    const result = await Anouncement.findByIdAndUpdate({_id:req.params.id}, {
        $set: {
            comments
        }
    });

    const updated=await Anouncement.findOne({_id:req.params.id});
    res.json(updated); 
});

//Inactiva Anuncio
router.put('/inactive/:id', async (req, res) => {
    let comment = req.body;

    const result = await Anouncement.findOneAndUpdate({ _id: req.params.id }, {
        $set: {
            active: false
        }   
    });

    res.send(result);
});


//Busca todos os anuncions activos
router.get('/', async (req, res) => {
    const anouncement = await Anouncement.find({ active: true }).sort({ creationDate: -1 });
    res.send(anouncement);
});

//Busca todos os parceiros paginados em 6 elementos
router.get('/all/:page', async (req,res)=>{
    var page=req.params.page;
    const elementsperpage = 6;  
    const anouncements =await Anouncement.find().skip((elementsperpage*page)-elementsperpage).limit(elementsperpage).sort({creationDate:-1});
    res.send(anouncements);
});

//Busca total
router.get('/count/alll/annoucements', async (req,res)=>{
    const total =await Anouncement.countDocuments();
    res.status(200).json({
        total: total
      });  
});


//Busca Anuncio pelo id
router.get('/:id', async (req, res) => {
    const anouncement = await Anouncement.findById(req.params.id);
    res.send(anouncement);
});

module.exports = router;