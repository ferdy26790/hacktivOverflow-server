var nodemailer = require('nodemailer')
var smtpTransport = require('nodemailer-smtp-transport')
require('dotenv').config()
const mailConfig = {
  service: 'gmail',
  auth: {
    user: process.env.EMAILACC,
    pass: process.env.EMAILPASS
  }
}

const transporter = nodemailer.createTransport(smtpTransport(mailConfig));

const sendMail = (to, html) => {
  console.log(process.env.EMAILACC, process.env.EMAILPASS, 'ini mailer');
  let mailOptions = {
    from: 'ferdy26790@gmail.com',
    to: to,
    subject: 'you get answer!',
    html: html
  }
  transporter.sendMail(mailOptions, (err, status) => {
     if (!err) {
       console.log(status)
     } else {
       console.log(err)
     }
   })
}

module.exports = sendMail
