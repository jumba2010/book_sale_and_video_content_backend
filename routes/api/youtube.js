var fs = require('fs');
const express=require('express');
const router=express.Router();
var readline = require('readline');
var {google} = require('googleapis');
const cron = require('node-cron');
const admin = require("firebase-admin");
const Connecteddevice=require('../../models/connecteddevice');
const Livevideo=require('../../models/livevideo');
const keys = require('./../../config/keys');
var OAuth2 = google.auth.OAuth2;
var oauth2Client;

var tokensg;

//Task que 5 em 5 minutos vai ao youtube para ver se não ha nenhuma transmissão ao vivo
var task =cron.schedule('*/15 * * * *', () => {
  let service = google.youtube('v3');
  
  //Procura por agendas de transmissão
  service.search.list({ auth: oauth2Client, part: 'snippet', 
  channelId: keys.channelId, type:'video',eventType:'upcoming',
  order:'date', maxResults:1 
}, 
async function (err, response) {
  if(response){
 let upcomingvideos=response.data.items.filter( video=>video.snippet.liveBroadcastContent==='upcoming');
if(upcomingvideos.length!=0){ 
  
  console.log('Agenda de transmissão ao vivo encontrada com videoId: '+upcomingvideos[0].id.videoId)
  const oldlivevideo = await Livevideo.findOne({type:'upcoming',videoId:upcomingvideos[0].id.videoId});
  if(!oldlivevideo){

    console.log('Registando agenda de transmissao')
    //Grava na base e notifica aos utilizadores mobile
    let livevideo=new Livevideo({videoId:upcomingvideos[0].id.videoId,type:'upcoming',snapshot:upcomingvideos[0].snippet.thumbnails.high.url});
    livevideo= await livevideo.save()
    sendNotification('Nova Transmissão ao vivo agendada','Transmissao ao vivo agendada para daqui a 30 minutos',upcomingvideos[0].id.videoId)
  }


  else if(oldlivevideo.date && diff_minutes(new Date(oldlivevideo.date), new Date(Date.now()))<=10){
    sendNotification('Nova Transmissão ao vivo agendada','Transmissao ao vivo agendada para daqui a 30 minutos',upcomingvideos[0].id.videoId)

  }

  else{
    console.log('agenda gravada '+oldlivevideo._id)
  }

}
else{
  console.log('Nenhuma agenda de transmissão encontrada')

}
}
}
); 

//Procura por transmissões em directo
service.search.list({ auth: oauth2Client, part: 'snippet', 
channelId: keys.channelId, type:'video',eventType:'live',
order:'date', maxResults:1 
}, 
async function (err, response) {
  if(response){
let livevideos=response.data.items.filter( video=>video.snippet.liveBroadcastContent==='live');
if(livevideos.length!=0){
  console.log('Transmissão ao vivo encontrada com videoId: '+livevideos[0].id.videoId)
  const oldlivevideo = await Livevideo.findOne({type:'live',videoId:livevideos[0].id.videoId});
  if(!oldlivevideo){
    console.log('Registando transmissão ao vivo')
    //Grava na base e notifica aos utilizadores mobile
    let livevideo=new Livevideo({videoId:livevideos[0].id.videoId,type:'live',snapshot:livevideos[0].snippet.thumbnails.high.url});
    livevideo= await livevideo.save()
   // sendNotification('A Transmitir em directo neste momento','Esta a decorrer uma transmissão ao vivo neste momento',livevideos[0].id.videoId)
  }
  else{
    console.log('Transmissão gravada '+oldlivevideo._id)
  }

}else{
  console.log('Ainda não está a transmitir')

}
}
}
); 

});

//Inicia a execução da task
task.start();

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/youtube-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/youtube.upload','https://www.googleapis.com/auth/youtube.readonly'];

// Load client secrets from a local file.
fs.readFile('client_secret.json', function processClientSecrets(err, content) {
  if (err) {
    console.log('Error loading client secret file: ' + err);
    return;
  }
  // Authorize a client with the loaded credentials, then call the YouTube API.
  credentials=content;
  authorize(JSON.parse(content),getVideos);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
 authorize = async(credentials, callback)=> {
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  const connecteddevice =await Connecteddevice.find({device:'youtube'});
     if (!connecteddevice.toke) {
      getNewToken(oauth2Client, callback);
    } else {
         //Once the client has a refresh token, access tokens will be acquired and refreshed automatically in the next call to the API.
              oauth2Client.setCredentials({
      refresh_token: connecteddevice.token
      });
      callback(oauth2Client);
    }
  
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
getNewToken= async(oauth2Client, callback) =>{
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;

      oauth2Client.on('tokens', (tokens) => {
        if (tokens.refresh_token) {
          // store the refresh_token in my database!
          console.log(tokens.refresh_token);
        }
        console.log(tokens.access_token);
        oauth2Client.setCredentials({
          refresh_token:tokens.access_token,
          access_token:tokens.access_token
        });
        console.log('Access token:',tokens.access_token)
        console.log('tokens:',tokens)
        tokensg=tokens;
      });   

         callback(oauth2Client);
    });
  });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */

/**
 * Lists the names and IDs of up to 10 files.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */

function getVideos(auth) {
let service = google.youtube('v3');
   //Get the videos
   service.search.list({ auth: auth, part: 'snippet', 
   channelId: keys.channelId, type:'video',
   order:'date', maxResults:1 
 }, 
 function(err, response) {
   if(err)console.log(response.data);
   if(response) console.log(response.data);
  else{console.log('Sem videos por mostar')}
 }
); 
  }


  function diff_minutes(dt2, dt1) 
 {

  var diff =(dt2.getTime() - dt1.getTime()) / 1000;
  diff /= 60;
  return Math.abs(Math.round(diff));
  
 }

  sendNotification=async(notificatioTitle,notificationDescription,videoId)=> {
    const connecteddevices =await Connecteddevice.find();
    connecteddevices.map((device)=>{
      const message = {
        android:{
          notification: {
            title: notificatioTitle,
            body:  notificationDescription,
            sound:'default'
          }
  
        },
  
        data: {
          id: ''+videoId
        },
        notification: {
          title: notificatioTitle,
          body:  notificationDescription
        },
        token: device.token
      };

 // Send a message to the device corresponding to the provided
    // registration token.
    admin.messaging().send(message)
      .then((response) => {
        // Response is a message ID string.
        console.log('Successfully sent youtube notification:', response);

        console.log(message);
      })
      .catch((error) => {
        console.log('Error sending youtube notification:', error);
      });
      console.log('Youtube notification Sent');

    });   
  }

  router.post('/upload', async (req,res)=>{

    let service = google.youtube('v3');
    const { url, title, description } = req.body;
    //Get the videos
    service.videos.insert({ auth: oauth2Client, part: 'status,snippet', notifySubscribers:true,
    resource:{snippet: {
        title: title,
      description: description
    },
    status: {
      privacyStatus: 'private'
    }},

    media: {
      body: fs.createReadStream(keys.videoBaseUrl+url)
  }

  }, 
  function(err, response) {

    if(err) console.log(err)
   console.log(response)
  }
 ); 


      });
 
 //Get all youtube the videos from my channel
router.get('/', async (req,res)=>{

  let service = google.youtube('v3');
   //Get the videos
   service.search.list({ auth: oauth2Client, part: 'snippet', 
   channelId: keys.channelId, type:'video',
   order:'date', maxResults:1 
 }, 
 function(err, response) {
  res.send(response.data.items);
 }
); 
});

//Get all broadcast videos from my channel
router.get('/live', async (req,res)=>{
  let service = google.youtube('v3');
   service.search.list({ auth: oauth2Client, part: 'snippet', 
   channelId: keys.channelId, type:'video',eventType:'live',
   order:'date', maxResults:1 
 }, 
 function(err, response) {
  let livevideos=[]
  if(response){
  livevideos=response.data.items.filter( video=>video.snippet.liveBroadcastContent==='live');
  }
 res.send(livevideos);
}
);     
});


    router.get('/upcoming', async (req,res)=>{
      let service = google.youtube('v3');    
       service.search.list({ auth: oauth2Client, part: 'snippet', 
       channelId: keys.channelId, type:'video',eventType:'upcoming',
       order:'date', maxResults:1 
     }, 
     function(err, response) {
      let upcomingvideos=[]
      if(response){
       upcomingvideos=response.data.items.filter( video=>video.snippet.liveBroadcastContent==='upcoming');
     
     }
     res.send(upcomingvideos);
    }

    ); 
        
        });
    
module.exports=router;