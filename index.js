const config = require('config');
const express = require('express');
const anouncement = require('./routes/anouncement');
const mongoose = require("mongoose");
const book = require('./routes/book');
const request = require('./routes/request');
const appversion = require('./routes/appversion');
const sucursal = require('./routes/sucursal');
const smsnotification = require('./routes/api/smsnotification');
const property = require('./routes/property');
const mailsender = require('./routes/api/mailsender');
const connecteddevice=require('./routes/connecteddivice');
const booking = require('./routes/booking');
const testimony = require('./routes/testimony');
var fs = require('fs');
var https = require('https');
var http = require('http');
//const youtube = require('./routes/api/youtube');
const patner = require('./routes/patner');
const thematiccontent = require('./routes/thematiccontent');
const googlecloudupload = require('./routes/old_/cloudupload');
const user = require('./routes/user');
const video = require('./routes/video');
const worker = require('./routes/worker');
const auth = require('./routes/auth');
const billing = require('./routes/api/billing');
const payment = require('./routes/payment');
const notification = require('./routes/api/notification');
const customer = require('./routes/customer');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const transaction = require('./routes/transaction');
const keys = require('./config/keys');
const worship = require('./routes/worship');
const Video=require('./models/video');
const dotenv = require('dotenv');
const cors = require('cors');
var stream = require('stream');
var httprequest = require('request');
const { getVideoDurationInSeconds } = require('get-video-duration')
const { Storage } = require('@google-cloud/storage');
const app = express();
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});



app.use(express.json());
app.use('/api/book', book);
app.use('/api/user', user);
app.use('/api/auth', auth);
app.use('/api/request', request);
app.use('/api/sucursal', sucursal);
app.use('/api/testimony', testimony);
app.use('/api/thematiccontent', thematiccontent);
app.use('/api/video', video);
app.use('/api/worker', worker);
app.use('/api/billing', billing);
app.use('/api/event', anouncement);
app.use('/api/payment', payment);
app.use('/api/customer', customer);
app.use('/api/transaction', transaction);
app.use('/api/gcupload', googlecloudupload);
app.use('/api/connecteddevice',connecteddevice);
app.use('/api/notification', notification);
app.use('/api/booking',booking);
app.use('/api/property', property);
app.use('/api/sms', smsnotification);
app.use('/api/email', mailsender);
app.use('/api/appversion', appversion);
app.use('/api/worship', worship);
//app.use('/api/youtube', youtube);
app.use('/api/patner', patner);
app.use('/public/files', express.static(__dirname + '/public/files'));
app.use(express.static(__dirname + '/public'));

//Configuando o ficheiro das variáveis de ambiente. A ser removido futuramente
dotenv.config();

app.use(logger('dev'));
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: false,
  }),
);

app.use(
  bodyParser.json()
);
app.use(cookieParser());
app.use(fileUpload());

const gcs = new Storage(
  {
    keyFilename: path.join(__dirname, "nacoesparacristo-e655679e0970.json"),
    projectId: 'nacoesparacristo'
  }
);

const bucketName = 'nacoesparacristomedia'
const bucket = gcs.bucket(bucketName);


//Upload Events
app.post('/api/upload/events', (req, res, next) => {
  
  //Escrevendo o conteudo em pequenos chunks
  var bufferStream = new stream.PassThrough();
  bufferStream.end(new Buffer(req.files.file.data));
  
 const writable = fs.createWriteStream(`${__dirname}/public/files/events/${req.body.filename}`);   

  bufferStream.on('data', chunk => {
    writable.write(chunk);
  });
  bufferStream.on('finish', () => {
    console.log('Upload Feito com sucesso');
  });

  bufferStream.pipe(
    bucket.file(req.files.file.name).createWriteStream({
      resumable: false,
      metadata:{
        contentType: req.files.file.mimetype
      },    
      gzip: true
    })
  )
  .on("finish",  () => {
    console.log('Upload para o google  cloud Feito com sucesso');
    res.json({ file:  req.files.file.name});
  })

});

//Upload Books
app.post('/api/upload/books', (req, res, next) => { 
    
  //Escrevendo o conteudo em pequenos chunks
  var bufferStream = new stream.PassThrough();
  bufferStream.end(new Buffer(req.files.file.data));
 
  bufferStream.pipe(
    bucket.file(req.files.file.name).createWriteStream({
      resumable: false,
      metadata:{
        contentType: req.files.file.mimetype
      },    
      gzip: true
    })
  )
  .on("finish",  () => {
    console.log('Upload para o google  cloud Feito com sucesso');
    res.json({ file:  req.files.file.name});
  })

});

//Upload Videos
app.post('/api/upload/videos',async (req, res, next) => {
  
  //Escrevendo o conteudo em pequenos chunks
  var bufferStream = new stream.PassThrough();
  bufferStream.end(new Buffer(req.files.file.data));
  
 const writable = fs.createWriteStream(`${__dirname}/public/files/videos/${req.body.filename}`);   
  bufferStream.on('data', chunk => {
    console.log('Lendo: ',chunk.length);
    writable.write(chunk);
  });
  bufferStream.on('finish', () => {
    console.log('Upload Feito com sucesso');
    getVideoDurationInSeconds(`public/files/videos/${req.body.filename}`).then(async (duration) => {
      res.json({ file: req.body.filename, duration:duration});
  })
  });

  bufferStream.pipe(
    bucket.file(req.files.file.name).createWriteStream({
      resumable: true,
      metadata:{
        contentType: req.files.file.mimetype
      },    
      gzip: true
    })
  )
  .on("finish",  () => {
    console.log('Upload para o google  cloud Feito com sucesso'); 
  })  

});

//Stream de videos
app.get('/api/play/videos/:url', async(req, res) => {
const videoFile = httprequest.get(`https://storage.googleapis.com/nacoesparacristomedia/${req.params.url}`)
await Video.findOneAndUpdate({url:req.params.url},{
    $inc:{views:1}
})

videoFile.pipe(res);

});


app.post('/api/upload/videos/capa',async (req, res, next) => {
 //Escrevendo o conteudo em pequenos chunks
 var bufferStream = new stream.PassThrough();
 bufferStream.end(new Buffer(req.files.file.data));
 
const writable = fs.createWriteStream(`${__dirname}/public/files/videos/capa/${req.body.filename}`);   

 bufferStream.on('data', chunk => {
   writable.write(chunk);
 });
 bufferStream.on('finish', () => {
   console.log('Upload Feito com sucesso');
 });

 bufferStream.pipe(
   bucket.file(req.files.file.name).createWriteStream({
     resumable: false,
     metadata:{
       contentType: req.files.file.mimetype
     },    
     gzip: true
   })
 )
 .on("finish",  () => {
   console.log('Upload para o google  cloud Feito com sucesso');
   res.json({ file:  req.files.file.name});
 })
});

//Upload pictures
app.post('/api/upload/pictures', (req, res, next) => {  

  //Escrevendo o conteudo em pequenos chunks
 var bufferStream = new stream.PassThrough();
 bufferStream.end(new Buffer(req.files.file.data));
 bufferStream.pipe(
   bucket.file(req.files.file.name).createWriteStream({
     resumable: false,
     metadata:{
       contentType: req.files.file.mimetype
     },    
     gzip: true
   })
 )
 .on("finish",  () => {
   console.log('Upload para o google cloud  Feito com sucesso');
   res.json({ file:  req.files.file.name});
 })

});

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/home-three', function(req, res) {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/blog-details', function(req, res) {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/blog-list', function(req, res) {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/blog-right-sidebar', function(req, res) {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/book-details', function(req, res) {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/book-checkout-1', function(req, res) {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/book-checkout-2', function(req, res) {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});


app.get('/residencial-booking', function(req, res) {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/my-booking', function(req, res) {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/mybooks', function(req, res) {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/register-patner', function(req, res) {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});
app.get('/sign-up', function(req, res) {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/sign-in', function(req, res) {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});


app.get('/residencial-booking-success', function(req, res) {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/thank-you', function(req, res) {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/forget-password', function(req, res) {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});


app.get('/create-user-success', function(req, res) {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/privacy-policy', function(req, res) {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


mongoose.connect(keys.mongoURI, { useNewUrlParser: true })
  .then(() => console.log('Connected to Mongodb...'))
  .catch(err => console.error('Could not connect to Mongodb', err));
  
  // depois de PORT ,'192.168.43.130'


 app.listen(process.env.PORT, '127.0.0.1',() => {
  console.log(`server running on port ${process.env.PORT}`);

}
) 
