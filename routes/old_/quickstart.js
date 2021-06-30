var fs = require('fs');
const express=require('express');
const router=express.Router();
var readline = require('readline');
var {google} = require('googleapis');
const Connecteddevice=require('../../models/connecteddevice');
var OAuth2 = google.auth.OAuth2;
var oauth2Client

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/youtube-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/youtube.readonly'];

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
   channelId: 'UCnmrqaaQubkKeiOs0c6x7Aw', type:'video',
   order:'date', maxResults:3 
 }, 
 function(err, response) {
  console.log(response.data);
 }
); 

  }


 
 //Get all youtube the videos from my channel
router.get('/', async (req,res)=>{

  let service = google.youtube('v3');
   //Get the videos
   service.search.list({ auth: oauth2Client, part: 'snippet', 
   channelId: 'UCnmrqaaQubkKeiOs0c6x7Aw', type:'video',
   order:'date', maxResults:6 
 }, 
 function(err, response) {
  res.send(response.data.items);
 }
); 
    
    });

module.exports=router;