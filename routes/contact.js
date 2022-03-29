
var express = require('express');
var router = express.Router();
var multiparty = require('multiparty');
var FormData = require('form-data');
// var multer = require('multer')();
var axios = require('axios');
var sgMail = require('@sendgrid/mail');
var http = require('http');
var util = require('util');
const req = require('express/lib/request');
const { format } = require('path');
const { sys } = require('typescript');
var apiKey = process.env.EmailAPIKey;
var toEmail = process.env.toEmail;
var fromEmail = process.env.fromEmail;
sgMail.setApiKey(apiKey);

router.post('/', async function(req, res) {
  var body;
  var senderName;
  var senderEmail;
  
    var form = new multiparty.Form();
    await form.parse(req, async function(err, fields, files) {
        senderName = fields['name'][0];
        senderEmail = fields['email'][0];
        body = fields['message'][0];

        const msg = {
          to: toEmail,
          from: fromEmail,
          subject: 'Portfolio Email Submission',
          text: "From: " + senderName + " (" + senderEmail + ") \n" + body
        }

        try {
          await sgMail.send(msg); 
          res.status(200).send(JSON.stringify({status: "200", result: "success"}));
        }
        catch(e) {
          res.status(500).send(JSON.stringify({status: "500", result: "failed"}));
          }
    })
  });

module.exports = router;
