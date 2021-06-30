const keys = require('../../config/keys');
const express=require('express');
const router=express.Router();
var http = require("https");
var otpGenerator = require('otp-generator');
const SendOtp = require('sendotp');



const sendOtp = new SendOtp(keys.msg91AuthKey,'O seu código de confirmação é {{otp}}');

router.post('/generate', async (req,res)=>{ 

   let otp = await  otpGenerator.generate(6, { upperCase: false, specialChars: false,alphabets:false });
   console.log('Otp is: ',otp)
   console.log('Phone number is: ',req.body.phone)
   sendOtp.setOtpExpiry('5');
   sendOtp.send(req.body.phone, 'IMNC', otp,  function (error, data) {

    if(error){
    console.log(error);
    return res.status(400).send(error);
    }
    else{
    console.log('Data is: ',data);
    res.send(data);
}
  });   
});

router.post('/booking', async (req,res)=>{ 
  var options = {
    "method": "GET",
    "hostname": "world.msg91.com",
    "port": 443,
    "path": `/api/sendhttp.php?mobiles=${req.body.cellphone}&authkey=${keys.msg91AuthKey}&route=4&sender=NCRSTO&message=${req.body.message}`,
    "headers": {}
  };


  var req = http.request(options, function (res) {
    var chunks = [];
  
    res.on("data", function (chunk) {
      chunks.push(chunk);
    });
  
    res.on("end", function () {
      var body = Buffer.concat(chunks);
      console.log(body.toString());
    });
  });
  
  req.end();
 
});


router.post('/retry', async (req,res)=>{      
    sendOtp.retry(req.body.phone, false, function (error, data) {       
     if(error){
        console.log(error);
        return res.status(400).send(error);
        }
        else{
        console.log(data);
        res.send(data);
    }
      });  
 });


 router.post('/verify', async (req,res)=>{ 
    sendOtp.verify(req.body.phone, req.body.otp, function (error, data) {
        if(data.type == 'error')  return res.status(400).send('Invalid Otp code');       
        if(data.type == 'success') return res.send(data);       
      });
 });
 
 

module.exports=router;