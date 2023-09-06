//definimos que utilizaremos variables de entorno
require('dotenv').config()

//llamamos a las dependias que utilizaremos
const MAIL = require('../config/email')
const CODE = require('../models/code')
const FECHA = require('node-datetime')
const BCRYPT = require('bcrypt')
const VALIDATION = require('../helpers/validations/password')

//funcion para enviar correo de recuperacion de contraseña a clientes
exports.newPasswordEmail = async (req, res) => {
    let username, email

    if (req.session.user && req.body.email) {
        username = req.session.user
        email = req.body.email
    } else if (req.body.user && req.body.email) {
        username = req.body.user
        email = req.body.email
    } else {
        res.send('empty')
    }

    //validamos si existe una sesión y de existir validamos que sea la misma a la que se le quiere cambiar la contraseña
    if (req.session.user && req.session.user != username) {
        res.send('user')
    } else {
        let userValidation = await VALIDATION.userValidation(req.body.user) 

        if (userValidation == false) {
            res.send('user')
        }

        let emailValidation = await VALIDATION.emailValidation(email, username)

        if (emailValidation == false) {
            res.send('user')
        }

        //creamos un arreglo con los caracteres que tendra el codigo
        let array = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
        let result = ''
        //iniciamos la dependencia para obtener la fecha
        let date = FECHA.create()

        //utilizamos un for para concatenar 7 valores del arreglo
        for (let index = 0; index < 7; index++) {
            //utilizamos una ecuacion para elejir posciciones del arreglo de forma aleatoria
            result += array[Math.floor(array.length * (Math.random()))]
        }

        //definimos las rondas de salto a 10 segun la documentacion de OWASP
        const SALT_ROUNDS = 10
        //enviamos el string que vamos a encriptar
        const ENCRYPTED_STRING = result

        //generamos las rondas con el porametro que enviamos antes
        BCRYPT.genSalt(SALT_ROUNDS, function (err, salt) {
            //encriptampos el string con la cantidad de saltos que definmos antes (10)
            BCRYPT.hash(ENCRYPTED_STRING, salt, function (err, hash) {
                //creamos un objeto para guardarlo en la base
                const CODES = new CODE({
                    code: hash,
                    user: req.body.user,
                    date: date.format('Y-m-d H:M:S')
                })

                //guardamos el objeto en la base 
                CODES.save(CODES).then(data => {
                    //validamos que se haya guardado 
                    if (!data) {
                        res.send('error')
                    } else {
                        //enviamos el correo
                        let info = MAIL.sendMail({
                            //utilizamos variables de entorno para dar el correo con el que enviaremos el mensaje
                            from: `Sublisivarte <${process.env.EMAIL}>`,
                            to: email,
                            subject: "Cambio de contraseña",
                            html: `<!DOCTYPE html>
                            <html lang="en">
                            
                            <head>
                                <meta charset="UTF-8">
                                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                <link rel="stylesheet" href="../resources/css/dashbard.css">
                            </head>

                            <body style="background-color: #ffffff;">
                                <div style="position: absolute; top: 15%; left: 40%;">
                                    <form style="height: 600px; width: 480px; background-color: #000000; border-radius: 5%;" action="">
                                        <div>
                                            <h1 style="display:inline-block; color: #4280EF; padding-left: 3%;">¿Has olvidado tu <br> contraseña?</h1>
                                            <img src="http://localhost:443/images/LOG23-01.png"
                                                style=" display:inline-block; margin-left: 10%; height: 10%; width: 20%;"
                                                alt="">
                                        </div>
                                        <div style="margin-top: 20px;">
                                            <h3 style=" color: #ffffff; padding-top: 3%; padding-left: 3%;">Si usted no ha realizado ninguna
                                                peticion de cambio <br> de contraseña unicamente ignore el correo.</h4>
                                            <h3 style=" color: #ffffff; padding-top: 7%; padding-left: 3%;">${result}:</h3>
                                        </div>
                                        <div style="text-align: center; margin-top: 20px;">
                                            <input style="margin-top: 2%; margin-left: 2%; height: 45px; width: 50px;" type="text">
                                            <input style="margin-top: 2%; margin-left: 2%; height: 45px; width: 50px;" type="text">
                                            <input style="margin-top: 2%; margin-left: 2%; height: 45px; width: 50px;" type="text">
                                            <h1 style="display: inline-block; color: #ffffff; margin-left: 3%;">-</h3>
                                            <input style="margin-top: 2%; margin-left: 3%; height: 45px; width: 50px;" type="text">
                                            <input style="margin-top: 2%; margin-left: 3%; height: 45px; width: 50px;" type="text">
                                            <input style="margin-top: 2%; margin-left: 3%; height: 45px; width: 50px;" type="text">
                                        </div>
                                        <div style="text-align: center; margin-top: 20px;">
                                            <button type="button" style="cursor: pointer; background-color: #4280EF; border-radius: 5px; margin-top: 5%; margin-left: 3%; height: 50px; width: 400px; font-size: large; border: none;">Cambiar
                                                contraseña</button>
                                        </div>
                                        <footer style="position: fixed; bottom: 22%; width: 25%;background-color: #4280EF;padding: 20px; text-align: center; border-bottom-left-radius: 15px; border-bottom-right-radius: 15px;">
                                            <p>Copyright © 2023 Sublisivarte</p>
                                            <p>Contacto: sublisivarte@email.com</p>
                                        </footer>
                                    </form>
                                </div>
                            </body>

                            </html>
                            `
                        })
                        res.send(true)
                    }
                }).catch(err => {
                    console.log(err)
                })
            })
        })
    }
}