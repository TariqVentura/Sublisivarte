//definimos que utilizaremos variables de entorno
require('dotenv').config()

//llamamos a las dependias que utilizaremos
const MAIL = require('../config/email')
const CODE = require('../models/code')
const FECHA = require('node-datetime')
const BCRYPT = require('bcrypt')

//funcion para enviar correo de recuperacion de contraseña a clientes
exports.newPasswordEmail = (req, res) => {
    //validamos si existe una sesión y de existir validamos que sea la misma a la que se le quiere cambiar la contraseña
    if (req.session.user && req.session.user != req.body.user) {
        res.send('Solo puedes generar codigo para tu usuario')
    } else {
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
                            to: req.body.email,
                            subject: "Cambio de contraseña",
                            html: `<p> Saludos</p> </br> <a href=''>${result}</a>`
                        })
                    }
                }).catch(err => {
                    res.send(err)
                })
            })
        })
    }
}