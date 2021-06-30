const keys = require('./../../config/keys');
var paypal = require('paypal-rest-sdk');
const express = require('express');
const Payment = require('../../models/payment/payment');
const Customer = require('../../models/payment/customer');
const router = express.Router();

paypal.configure({
  mode: keys.paypalMode,
  client_id: keys.paypalClientId,
  client_secret: keys.paypalClientSecret
});


router.get('/pay/:price/:description/:url/:userId', async (req, res) => {

  //Define a Payment
  var payment = {
    intent: 'sale',
    payer: {
      payment_method: 'paypal',
      payer_info:{


      }
    },
    redirect_urls: {
      return_url: `${keys.baseUrl}/api/billing/execute`,
      cancel_url: keys.paypalCancelUrl
    },

    transactions: [{
      amount: {
        total: req.params.price,
        currency: 'USD'
      },
      description: req.params.description,
      item_list: {
        items: [
          {
         sku:req.params.url,   
         name:req.params.userId,
         description:req.params.description,
         quantity:1,
         price:req.params.price,
         currency: 'USD' 
          }

        ]
      }
    }]
  }

  paypal.payment.create(payment, function (error, payment) {
    var links = {};

    if (error) {
      console.error(JSON.stringify(error));
    } else {

      // Capture HATEOAS links 
      payment.links.forEach(function (linkObj) {
        links[linkObj.rel] = {
          href: linkObj.href,
          method: linkObj.method
        };
      })

      // If the redirect URL is present, redirect the customer to that URL
      if (links.hasOwnProperty('approval_url')) {
        // Redirect the customer to links['approval_url'].href
        return res.redirect(links['approval_url'].href)

      } else {
        console.error('no redirect URI present');
      }

    }
  });

});

router.get('/execute', async (req, res) => {

  var paymentId = req.query.paymentId;
  var payerId = { payer_id: req.query.PayerID };
  var token = req.query.token;

  await paypal.payment.execute(paymentId, payerId, async function (error, payment) {
    if (error) {
      console.error(JSON.stringify(error));
    } else {
      if (payment.state == 'approved') {

        console.log('Pagamento aprovado!')
        //Save the Customer in the Database
        const name = payment.payer.payer_info.first_name + ' ' + payment.payer.payer_info.last_name;
        const country = payment.payer.payer_info.shipping_address.country_code + ', ' + payment.payer.payer_info.shipping_address.city
          + ', ' + payment.payer.payer_info.shipping_address.state;
        const zipcode = payment.payer.payer_info.shipping_address.postal_code;
        const email = payment.payer.payer_info.email;
        const contact = payment.payer.payer_info.shipping_address.phone;
        const street = payment.payer.payer_info.shipping_address.line1;
      
        const userId = payment.transactions[0].item_list.items[0].name;
        const createdBy = userId;
        
        console.log(name+', '+country+', '+email+', '+contact+', '+userId)

        let customer = new Customer({ userId, name, country, street, zipcode, email, contact, createdBy });
        customer = await customer.save();

        console.log('My Customer: ' + customer)

        //Save the Payment in the Database
        const total = payment.transactions[0].amount.total;

        const description = payment.transactions[0].description;
        const url=payment.transactions[0].item_list.items[0].sku;
        const items = [{
          code: 'BK',
          name: 'Livro',
          description: description,
          price: total,
          url: url,
          total: total,
        }];

        var payerId = req.query.PayerID;
        let myPayment = new Payment({userId, token, payerId, paymentId, total, description, items, customer: customer.id, address: country, createdBy });
        await myPayment.save();
        console.log('My Payment: ' + myPayment);
        console.log('payment completed successfully');
      } else {
        console.log('payment not successful');
      }
    }
  });
  return res.redirect(keys.paypalRedirectUrl)
});

module.exports = router;