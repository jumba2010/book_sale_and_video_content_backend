module.exports={
  mongoURI:'mongodb://localhost/nacoes_para_cristo_db',
  stripePublishableKey: '<YOUR STRIPE PUBLISHABLE KEY>',
  stripeSecretKey:'<YOUR STRIPE SECRET KEY>',
  paypalClientId:'<YOUR PAYPAL CLIENT ID>', 
  paypalClientSecret:'<YOUR PAYPAL API SECRET>',
  paypalMode:'sandbox',
  bucketName:process.env.GCLOUD_STORAGE_BUCKET,
  projectId:process.env.GOOGLE_CLOUD_PROJECT_ID,
  videoBaseUrl:'E:/projects/Portal das Nacoes/nacoes_para_cristo_core/public/files/videos/',
  channelId:'<YOUR CHANNEL ID HERE>',
  paypalRedirectUrl:'http://localhost:3000/book-checkout-2',
  paypalCancelUrl:'http://localhost:3000/book-checkout-1',
  baseUrl:'http://localhost:3333',
  msg91AuthKey:'<YOUR KEY HERE>',
  email:'parceiros-noreply@nacoesparacristo.org',
  emailpassword:'nacoes2019',
  serviceSMTP:'az1-ss1.a2hosting.com'
};