
const express = require('express');
const router = express.Router();
const multiparty = require('multiparty');
const FormData = require('form-data');
// const multer = require('multer')();
const axios = require('axios');
const sgMail = require('@sendgrid/mail');
const http = require('http');
const util = require('util');
const req = require('express/lib/request');
const { format } = require('path');
const { sys } = require('typescript');
const apiKey = process.env.EmailAPIKey;
const toEmail = process.env.toEmail;
const fromEmail = process.env.fromEmail;
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
