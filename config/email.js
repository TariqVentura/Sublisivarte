//mandamos a llamar las variables de entorno
require('dotenv').config()

//llamamos la dependencia de nodemailer
const NODEMAILER = require('nodemailer')

//creamos la configuramos para poder usar la dependencia
let transporter = NODEMAILER.createTransport({
    //definimos que utilizaremos gmail para enviar los correos
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      //utilizamos variables de entorno para enviar las credenciales que utiliza la depencia
      user: process.env.EMAIL,
      pass: process.env.APP_PASSWORD
    }
  });

//enviamos la configuración
module.exports = transporter