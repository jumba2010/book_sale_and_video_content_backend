const express=require('express');
const keys = require('../../config/keys');
const router=express.Router();
const bodyParser = require('body-parser');

//Imports the Google Cloud client library
const {Storage} = require('@google-cloud/storage');

// Creates a client
const storage = new Storage();


const app = express();
app.set('view engine', 'pug');
app.use(bodyParser.json());

/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
const bucketName = keys.bucketName;

   //Upload File
   router.put('/', async  (req, res, next) => {  console.log(req);
    let file = req.files.file;

    const bucket = storage.bucket(bucketName);

  // Create a new blob in the bucket and upload the file data.
  const blob = bucket.file(file.originalname);
  const blobStream = blob.createWriteStream();

  blobStream.on('error', (err) => {
    console.log(err);
  });

  blobStream.on('finish', () => {
    // The public URL can be used to directly access the file via HTTP.
    const publicUrl = format(`https://storage.googleapis.com/${bucket.name}/${blob.name}`);
    res.status(200).send(publicUrl);
  });

  blobStream.end(file.buffer);
});

module.exports=router;