const express = require('express');
const Worship = require('../models/worship/worship')
const router = express.Router();

//Cria Relatorio de Culto
router.post('/', async (req, res) => {

    const { missionary, helper, status, oldbelievers, newbelievers,
        dateString, topic, startHour, startMinute, endMinute, endHour, progress,
        chalenge, moneycontributions, speciecontributions,
        testimonies, sucursal, createdBy } = req.body;

    var today = new Date();
    let year = dateString.substring(0, 4);
    let month = dateString.substring(5, 7);
    let day = dateString.substring(8, 10);

    let date1 = new Date(year, month, day);
    let date = date1.toISOString().substring(0, 10);

    let worship = new Worship({
        missionary, helper, status, oldbelievers, newbelievers,
        date, topic, startHour, endHour, startMinute, endMinute, progress,
        chalenge, moneycontributions, speciecontributions,
        testimonies, sucursal, createdBy
    });
    worship = await worship.save();
    res.send(worship).pop;

});

router.put('/:id', async (req, res) => {
    const { helper, oldbelievers, newbelievers,
        dateString, topic, startHour, startMinute, endMinute, endHour, progress,
        chalenge, moneycontributions, speciecontributions,
        testimonies, updatedBy } = req.body;
    let updatedDate = Date.now();
    var today = new Date();
    let year = dateString.substring(0, 4);
    let month = dateString.substring(5, 7);
    let day = dateString.substring(8, 10);

    let date1 = new Date(year, month, day);
    let date = date1.toISOString().substring(0, 10);

    const worship = await Worship.updateOne({ _id: req.params.id }, {
        $set: {
            helper: helper,
            oldbelievers: oldbelievers, 
            newbelievers: newbelievers,
            date: date, 
            topic: topic,
            startHour: startHour, 
            endHour: endHour, 
            startMinute: startMinute,
            endMinute: endMinute, 
            progress: progress,
            chalenge: chalenge, 
            moneycontributions: moneycontributions, 
            speciecontributions: speciecontributions,
            testimonies: testimonies, 
            updatedBy: updatedBy, 
            updatedDate: updatedDate
        }
    });
    res.send(worship).pop;
});

router.put('/approve/:id', async (req, res) => {
    const { status, remarks, updatedBy } = req.body;

    const result = await Worship.findByIdAndUpdate(req.params.id, {
        $set: {
            remarks, status, updatedBy
        }
    });

    res.send(result);
});


//Busca todos os Relatorios
router.get('/', async (req, res) => {
    const worship = await Worship.find({ active: true }).sort({ creationDate: -1 });
    res.send(worship);
});

//Busca todos os registos paginados em 6 elementos
router.get('/all/:page', async (req, res) => {
    var page = req.params.page;
    var elementsperpage = 6
    const worships = await Worship.find().skip((elementsperpage * page) - elementsperpage).limit(elementsperpage).sort({ creationDate: -1 });
    Worship.count(),
        res.send(worships);
});

//Busca total
router.get('/count/all/worships', async (req, res) => {
    const total = await Worship.countDocuments();
    res.status(200).json({
        total: total
    });

});

//Busca total
router.get('/count/missionary/:createdBy', async (req, res) => {
    const total = await Worship.count({ createdBy: req.params.createdBy });
    res.status(200).json({
        total: total
    });

});


router.get('/count/all/worships/:startDate/:endDate', async (req, res) => {
    const total = await Worship.countDocuments({ date: { $gte: req.params.startDate, $lte: req.params.endDate } });
    res.status(200).json({
        total: total
    });
});

//Busca Relat贸rio por Id
router.get('/unique/:id', async (req, res) => {
    const worship = await Worship.findOne({ _id: req.params.id });
    res.send(worship);
});

//Busca Anuncio pelo missionario paginados 5 a 5
router.get('/missionary/:createdBy/:page', async (req, res) => {
    var page = req.params.page;
    var elementsperpage = 6
    const worships = await Worship.find({ createdBy: req.params.createdBy }).skip((elementsperpage * page) - elementsperpage).limit(elementsperpage).sort({ creationDate: -1 });
    Worship.count(),
        res.send(worships);
});

//Busca Anuncio pelo missionario
router.get('/:createdBy', async (req, res) => {
    const worship = await Worship.find({ createdBy: req.params.createdBy });
    res.send(worship);
});

module.exports = router;

//Busca Anuncio pelo missionario paginados 5 a 5
router.get('/missionary/:createdBy/:page', async (req, res) => {
    var page = req.params.page;
    var elementsperpage = 6
    const worships = await Worship.find({ createdBy: req.params.createdBy }).skip((elementsperpage * page) - elementsperpage).limit(elementsperpage).sort({ creationDate: -1 });
    Worship.count(),
        res.send(worships);
});

//Busca Anuncio pelo missionario
router.get('/:createdBy', async (req, res) => {
    const worship = await Worship.find({ createdBy: req.params.createdBy });
    res.send(worship);
});

module.exports = router;