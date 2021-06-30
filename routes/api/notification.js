const express=require('express');
const admin = require("firebase-admin");
const Connecteddevice=require('../../models/connecteddevice');
const router=express.Router();
const serviceAccount = require("../../nacoesparacristofirebase-firebase-adminsdk-or7fs-076cacf228.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

   router.post('/', async (req,res)=>{
    const connecteddevices =await Connecteddevice.find();
       connecteddevices.map((device)=>{
      const message = {
        android:{
          notification: {
            title: req.body.title,
            body:  req.body.notfiatiodescription,
            sound:'default'
          }
  
        },
  
        data: {
          id: ''+req.body._id
        },
        notification: {
          title: req.body.title,
          body:  req.body.notfiatiodescription
        },
        token: device.token
      };


 // Send a message to the device corresponding to the provided
    // registration token.
    admin.messaging().send(message)
      .then((response) => {
        // Response is a message ID string.
        console.log('Successfully sent message do device:', device.device);
      })
      .catch((error) => {
        console.log('Error sending message:', error);
      });
     

    }); 
    
    res.send('Notifications Sent');
});

module.exports = router;