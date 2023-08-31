require('dotenv').config()
const NODEMAILER = require('nodemailer')

let transporter = NODEMAILER.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.APP_PASSWORD
    }
  });

module.exports = transporter