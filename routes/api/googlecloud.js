const express = require('express');
const router = express.Router();
const path = require('path');
const { Storage } = require('@google-cloud/storage');
const fs = require('fs')

const gcs = new Storage(
    {
      keyFilename: path.join(__dirname, "nacoesparacristo-e655679e0970.json"),
      projectId: 'nacoesparacristo'
    }
  );

const bucketName = 'nacoesparacristomedia'
const bucket = gcs.bucket(bucketName);

function getPublicUrl(filename) {
  return 'https://storage.googleapis.com/' + bucketName + '/' + filename;
}

//Upload Events
router.post('/aaaevents', async(req, res, next) => {

    if(!req.files.file) return next();
    const gcsname = req.files.file.originalname;
  const file = bucket.file(gcsname);

  const stream = file.createWriteStream({
    metadata: {
      contentType: req.files.file.mimetype
    }
  });

  stream.on('error', (err) => {
    req.files.file.cloudStorageError = err;
    next(err);
  });

  stream.on('finish', () => {    

    console.log(getPublicUrl(gcsname))

  });

  stream.end(req.files.file.buffer);
  
  });


module.exports = router;