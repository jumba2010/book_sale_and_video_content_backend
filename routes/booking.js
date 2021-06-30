const express=require('express');
const Booking=require('../models/booking/booking');
const Customer=require('../models/payment/customer');
const User=require('../models/user');
const router=express.Router();

router.post('/', async (req, res) => {
    const { userId, checkinDate, checkoutDate, numberOfDays, total, description,discount,persons,property, createdBy } = req.body;
    property.total=total
    const user =await User.findOne({_id:userId});
    let customer = new Customer({ userId, name:user.name, country:user.country, street:user.street, zipcode:user.zipcode, email:user.email, contact:user.contact, createdBy });
    customer = await customer.save();    
    let booking = new Booking({ userId, checkinDate, checkoutDate, numberOfDays, total, description,discount,persons,property,customer, createdBy  });
    request = await booking.save()
    res.send(booking);
});

router.post('/create', async (req, res) => {
    const { name, email, contact, address,picture,total, checkinDate, checkoutDate, numberOfDays, description,discount,persons,property, createdBy } = req.body;
    let customer = new Customer({ name, email,picture, contact,address, createdBy });
    customer = await customer.save();  
    property.total=total;  
    let booking = new Booking({ status:'CONFIRMED',checkinDate, checkoutDate, numberOfDays, total, description,discount,persons,property,customer, createdBy  });
    request = await booking.save()
    res.send(booking);
});

router.put('/:id', async (req, res) => {
       const {checkinDate, checkoutnDate, numberOfDays, total,persons,property, updatedBy } = req.body;

    const result = await Booking.update({ _id: req.params.id }, {
        $set: {
            checkinDate, checkoutnDate, numberOfDays, total,persons,property, updatedBy
        }
    });

    res.send(result);
});

router.put('/cancel/:id', async (req, res) => {

    const result = await Booking.update({ _id: req.params.id }, {
        $set: {
            status:'CANCELED',            
            remarks:req.body.remarks
        }
    });

    res.send(result);
});

router.put('/confirm/:id', async (req, res) => {

    const result = await Booking.update({ _id: req.params.id }, {
        $set: {
            status:'CONFIRMED',
            remarks:req.body.remarks
        }
    });

    res.send(result);
});

router.put('/complete/:id', async (req, res) => {

    const result = await Booking.update({ _id: req.params.id }, {
        $set: {
            status:'COMPLETE'
        }
    });

    res.send(result);
});

router.put('/refuse/:id', async (req, res) => {

    const result = await Booking.update({ _id: req.params.id }, {
        $set: {
            status:'REFUSED',
            remarks:req.body.remarks
        }
    });

    res.send(result);
});
// Busca  todas as compras por userId
router.get('/mybooking/:userId', async (req,res)=>{
    const bookings =await Booking.find({userId:req.params.userId})
    .sort({creationDate:-1});   
    res.send(bookings);
});

router.get('/all/:page', async (req,res)=>{
    var page=req.params.page;
    const elementsperpage = 6;  
    const bookings =await Booking.find().skip((elementsperpage*page)-elementsperpage).limit(elementsperpage).sort({creationDate:-1});
    res.send(bookings);
});

//Busca total
router.get('/count/all/bookings', async (req,res)=>{
    const total =await Booking.countDocuments();
    res.status(200).json({
        total: total
      });  
});

router.get('/count/all/bookings/:startDate/:endDate', async (req,res)=>{
    const total =await Booking.countDocuments({date:{$gte:req.params.startDate,$lte:req.params.endDate}});
    res.status(200).json({
        total: total
      });  
});




// Busca  pagamentos por data
router.get('/recent/:creationDate', async (req,res)=>{
    const bookings =await Booking.find({creationDate:req.params.creationDate})
    .sort({creationDate:-1});
    res.send(bookings);
});

router.get('/between/:startDate/:endDate', async (req,res)=>{
    const bookings =await Booking.find({date:{$gte:req.params.startDate,$lte:req.params.endDate}}).sort({creationDate:-1});
    res.send(bookings);   
});

// Busca todas as reservas 
router.get('/', async (req,res)=>{
    const bookings =await Booking.find()
    .sort({creationDate:-1});
    res.send(bookings);
});

router.get('/:id', async (req,res)=>{
    const bookings =await Booking.findOne({_id:req.params.id});
    res.send(bookings);   
});

module.exports=router;