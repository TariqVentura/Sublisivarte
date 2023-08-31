require('dotenv').config()

const MAIL = require('../config/email')
const CODE = require('../models/code')
const FECHA = require('node-datetime')
const BCRYPT = require('bcrypt')

//funcion para enviar correo de recuperacion de contraseña a clientes
exports.newPasswordEmail = (req, res) => {
    if (req.session.user && req.session.user != req.body.user) {
        res.send('Solo puedes generar codigo para tu usuario')
    } else {

        let array = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
        let result = ''
        let date = FECHA.create()

        for (let index = 0; index < 7; index++) {
            result += array[Math.floor(array.length * (Math.random()))]
        }

        const SALT_ROUNDS = 10
        const ENCRYPTED_STRING = result

        BCRYPT.genSalt(SALT_ROUNDS, function (err, salt) {
            BCRYPT.hash(ENCRYPTED_STRING, salt, function (err, hash) {
                const CODES = new CODE({
                    code: hash,
                    user: req.body.user,
                    date: date.format('Y-m-d H:M:S')
                })

                CODES.save(CODES).then(data => {
                    if (!data) {
                        res.send('error')
                    } else {
                        let info = MAIL.sendMail({
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