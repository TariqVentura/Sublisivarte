//definimos que utilizaremos variables de entorno
require('dotenv').config()

//llamamos a las dependias que utilizaremos
const MAIL = require('../config/email')
const CODE = require('../models/code')
const FECHA = require('node-datetime')
const BCRYPT = require('bcrypt')
const VALIDATION = require('../helpers/validations/users')

//funcion para enviar correo de recuperacion de contraseña a clientes
exports.newPasswordEmail = async (req, res) => {
    //declaramos variables 
    let username, email

    //validamos si exite una sesion
    if (req.session.user && req.body.email) {
        username = req.session.user
        email = req.body.email
    } else {
        //sino hay una sesion validamos que se no existan campos vacios en el formulario
        if (req.body.user && req.body.email) {
            username = req.body.user
            email = req.body.email
        } else {
            //si hay campos vacios enviamos una alerta
            res.send('empty')
            return
        }
    }

    //validamos si existe una sesión y de existir validamos que sea la misma a la que se le quiere cambiar la contraseña
    if (req.session.user && req.session.user != username) {
        res.send('user')
        return
    } else {
        //validamos que sea un usuario valido
        let userValidation = await VALIDATION.userValidation(req.body.user)

        if (userValidation == false) {
            res.send('user')
            return
        }

        //validamos que sea el correo del usuario al que se le pide la restauración
        let emailValidation = await VALIDATION.emailValidation(email, username)

        if (emailValidation == false) {
            res.send('user')
            return
        }

        let codeAuthentication = await VALIDATION.codeAuthentication(username)

        if (codeAuthentication == false) {
            res.send('code')
            return
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
                                <div style="position: absolute; top: 20%; left: 40%;">
                                    <div style="height: 284px; width: 350px; background-color: #000000; border-radius: 5%;">
                                        <div>
                                            <h2 style=" color: #4280EF; padding-left: 3%;">¿Has olvidado tu <br> contraseña?
                                                </h2>
                                        </div>
                                        <div>
                                            <h5 style=" color: #ffffff;padding-left: 3%;">Si usted no ha realizado ninguna
                                                peticion de cambio de contraseña puede bloquear su cuenta
                                            <br> Codigo de recuperación:</h5>
                                        </div>
                                        <div style="text-align: center;">
                                            <input style="margin: auto; height: 30px; width: 250px;" type="text" value="${result}">
                                        </div>
                                        <div style="text-align: center; margin-top: 20px;">
                                            <button type="button"
                                                style=" color: #ffffff; background-color: #4280EF; border-radius: 5px; height: 30px; width: 250px; border: none;">Cambiar contraseña</button>
                                        </div>
                                        <footer
                                            style="position: fixed-bottom; height: 13%; width: 100%; background-color: #4280EF; text-align: center; border-bottom-left-radius: 15px; border-bottom-right-radius: 15px;">
                                            <h5 style="color: #ffffff;">Copyright © 2023 Sublisivarte <br>Contacto: sublisivarte@email.com</h5>
                                        </footer>
                                    </div>
                                </div>
                            </body>
                            
                            </html>
                            `
                        })
                        //enviamos mensaje que se envio el correo
                        res.send(true)
                    }
                }).catch(err => {
                    //enviamos mensaje que no se envio el correo
                    res.send(false)
                })
            })
        })
    }
}