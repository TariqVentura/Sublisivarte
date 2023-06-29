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
                            req.session.status = data.status
                            req.session.visitas = req.session.visitas ? ++req.session.visitas : 1
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

exports.findUsers = (req, res) => {
    if (req.params.id) {
        const id = req.query.id
        USERS.findById(id)
            .then(data => {
                if (!data) {
                    res.status(404).send({ message: "No se pudo encontrar este usuario" })
                } else {
                    res.send(data)
                }
            })
            .catch(err => {
                res.status(500).send({ message: "Ocurrio un error al intentar ejecutar el proceso" })
            })
    } else {
        USERS.find()
            .then(user => {
                res.send(user)
                console.log(user)
            })
            .catch(err => {
                res.status(500).send({ message: err.message || "Ocurrio un error al tratar de obtener la informacion" })
            })
    }
}

exports.updateUsers = (req, res) => {
    console.log(req.body.id)
    const id = req.body.id
    USERS.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({ message: "No se encontro el usuario" })
            } else {
                res.send('Usuario Actualizado')
            }
        })
        .catch(err => {
            res.status(500).send({ message: "Ocurrio un error al intentar ejecutar el proceso" })
        })
}

exports.deleteUsers = (req, res) => {
    if (req.session.user != req.params.user) {
        const VALUE = { user: req.params.user }
        USERS.deleteOne(VALUE)
            .then(data => {
                if (!data) {
                    res.send('err')
                } else {
                    res.send('eliminacion completada')
                }
            })
            .catch(err => {
                res.send(err)
            })
    } else {
        res.send('no tiene permisos para realizar esta accion')
    }
}

exports.searchUsers = (req, res) =>{
    const key = req.params.key
    USERS.find(
        {
            "$or":[
                {name: {$regex: key}},
                {lastname:{ $regex:key}},
                {email: {$regex: key}},
                {user: {$regex: key}},
                {document: {$regex: key}}
            ]
        }
    )
    .then(data =>{
        if (!data) {
            res.status(404).send({ message: `Sin datos` })
        } else {
            res.send(data)
        }
    })
    .catch(err => {
        res.send(err)
    })
}

exports.newPassword = (req, res) => {
    const KEY = { user:  req.session.user }
    const VALUE = { password: req.body.password }

    USERS.updateOne(KEY, VALUE, { useFindAndModify: false })
    .then(data => {
        if (!data) {
            res.send('err')
        } else {
            res.send('ok')
        }
    })
    .catch(err => {
        res.send(err)
    })
}