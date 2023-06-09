/**
 * Se declaran las constantes para mandar a llamar al controlador y las dependencias de node
 */
const USERS = require('../models/users')
const AXIOS = require('axios')
const BCRYPT = require('bcrypt')

/**
 * Por medio de la depencia de axios se obtiene la informacion de las API utilizando el metodo GET y se renderizan las paginas con la informacion obetnida
 * Haciendo uso ddel metodo SAVE de mongoose se guardan los datos en el servidor de Atlas
 */
exports.createUser = (req, res) => {
    //validamos los campos para que no esten vacios
    if (!req.body.user || !req.body.name || !req.body.lastname || !req.body.email || !req.body.password || !req.body.document || !req.body.role) {
        res.status(404).send('No se permiten campos vacios')
    } else {
        const SALT_ROUNDS = 10
        const ENCRYPTED_PASSWORD = req.body.password

        BCRYPT.genSalt(SALT_ROUNDS, function (err, salt) {
            BCRYPT.hash(ENCRYPTED_PASSWORD, salt, function (err, hash) {
                const USER = new USERS({
                    name: req.body.name,
                    lastname: req.body.lastname,
                    email: req.body.email,
                    user: req.body.user,
                    password: hash,
                    document: req.body.document,
                    role: req.body.role,
                    status: 'active'
                })

                USER
                    .save(USER)
                    .then(data => {
                        if (!data) {
                            res.status(404).send('Ocurrio un error al crear el usuario')
                        } else {
                            res.send('usuario creado')
                        }
                    })
                    .catch(err => {
                        res.send(err)
                    })
            })
        })
    }
}

exports.logIn = (req, res) => {
    const USER = req.body.user
    USERS.findOne({ user: USER })
        .then(data => {
            if (!data) {
                res.send('usuario inexistente')
            } else {
                BCRYPT.compare(req.body.password, data.password, function (err, result) {
                    if (result) {
                        if (req.session.authenticated) {
                            res.json(req.session)
                        } else {
                            req.session.authenticated = true,
                            req.session.user = USER,
                            req.session.role = data.role
                            req.session.visitas = req.session.visitas ? ++ req.session.visitas : 1
                            console.log(req.session)
                            res.redirect('/')
                        }
                    } else {
                        res.send('contraseña incorrecta')
                    }
                })
            }
        })
}

exports.logOut = (req, res) => {
    req.session.destroy()
    return res.redirect('/')
}

