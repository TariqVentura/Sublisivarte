/**
 * Se declaran las constantes para mandar a llamar al controlador y las dependencias de node
 */
const USERS = require('../models/users')
const AXIOS = require('axios')
const BCRYPT = require('bcrypt')
const FECHA = new Date()
const PDF = require('pdf-creator-node')
const PATH = require('path')
const FS = require('fs')
const OPTIONS = require('../helpers/format/users')

/**
 * Por medio de la depencia de axios se obtiene la informacion de las API utilizando el metodo GET y se renderizan las paginas con la informacion obetnida
 * Haciendo uso ddel metodo SAVE de mongoose se guardan los datos en el servidor de Atlas
 */
exports.createUser = (req, res) => {
    //validamos los campos para que no esten vacios
    if (!req.body.user || !req.body.name || !req.body.lastname || !req.body.email || !req.body.password || !req.body.document || !req.body.role) {
        res.render('usuarios', { users: response.data, mensaje: "No se permiten campos vacios", confirmation: true, icon: 'error', user: req.session })
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
                            AXIOS.get('http://localhost:443/api/users')
                                .then(function (response) {
                                    res.render('usuarios', { users: response.data, mensaje: "Usuario Creado", confirmation: true, icon: 'success', user: req.session })
                                })
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
                AXIOS.get('http://localhost:443/api/images')
                    .then(function (images) {
                        res.render('index', { resources: images.data, mensaje: "Usuario Inexistente  ", confirmation: true, icon: 'error', user: false })
                    })
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
                        AXIOS.get('http://localhost:443/api/images')
                            .then(function (images) {
                                res.render('index', { resources: images.data, mensaje: "Contraseña Erronea", confirmation: true, icon: 'error', user: false })
                            })
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
                AXIOS.get('http://localhost:443/api/users')
                    .then(function (response) {
                        res.render('usuarios', { users: response.data, mensaje: "Usuario Actualizado", confirmation: true, icon: 'success', user: req.session })
                    })
            }
        })
        .catch(err => {
            res.status(500).send({ message: "Ocurrio un error al intentar ejecutar el proceso" })
        })
}

exports.bannUser = (req, res) => {
    const ID = req.params.id
    const VALUE = { status: 'banned' }

    USERS.findByIdAndUpdate(ID, VALUE, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.send('error')
            } else {
                AXIOS.get('http://localhost:443/api/users')
                    .then(function (response) {
                        res.render('usuarios', { users: response.data, mensaje: "Usuario Baneado", confirmation: true, icon: 'success', user: req.session })
                    })
            }
        })
        .catch(err => {
            res.send(err)
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
                    AXIOS.get('http://localhost:443/api/users')
                        .then(function (response) {
                            res.render('usuarios', { users: response.data, mensaje: "Usuario Eliminado", confirmation: true, icon: 'success', user: req.session })
                        })
                }
            })
            .catch(err => {
                res.send(err)
            })
    } else {
        res.send('no tiene permisos para realizar esta accion')
    }
}

exports.searchUsers = (req, res) => {
    const key = req.params.key
    USERS.find(
        {
            "$or": [
                { name: { $regex: key } },
                { lastname: { $regex: key } },
                { email: { $regex: key } },
                { user: { $regex: key } },
                { document: { $regex: key } }
            ]
        }
    )
        .then(data => {
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
    if (!req.body.password) {
        AXIOS.get('http://localhost:443/api/images')
            .then(function (images) {
                res.render('index', { user: session, resources: images.data, mensaje: "No se permiten campos vacios", confirmation: true, icon: "error" })
            })
    } else {
        const SALT_ROUNDS = 10
        const ENCRYPTED_PASSWORD = req.body.password

        BCRYPT.genSalt(SALT_ROUNDS, function (err, salt) {
            BCRYPT.hash(ENCRYPTED_PASSWORD, salt, function (err, hash) {
                const KEY = { user: req.session.user }
                const VALUE = { password: hash }

                USERS.updateOne(KEY, VALUE, { useFindAndModify: false })
                    .then(data => {
                        if (!data) {
                            res.send('err')
                        } else {
                            AXIOS.get('http://localhost:443/api/images')
                                .then(function (images) {
                                    res.render('index', { user: session, resources: images.data, mensaje: "Se ha actualizado la contraseña", confirmation: true, icon: "success" })
                                })
                        }
                    })
                    .catch(err => {
                        res.send(err)
                    })
            })
        })
    }
}

exports.statusUser = (req, res) => {
    const PARAM = { user: req.params.id }
    const VALUE = { status: 'inactive' }

    USERS.updateOne(PARAM, VALUE)
        .then(data => {
            if (data) {
                req.session.destroy()
                return res.redirect('/')
            } else {
                res.send('err')
            }
        })

}

exports.getUser = (req, res) => {
    const KEY = req.params.key

    USERS.find({
        "$or": [
            { user: { $regex: KEY } }
        ]
    })
        .then(data => {
            if (!data) {
                res.send('error')
            } else {
                res.send(data)
            }
        })
        .catch(err => {
            res.send(err)
        })
}

exports.modifyUser = (req, res) => {
    if (!req.body.name || !req.body.lastname || !req.body.email) {
        AXIOS.get('http://localhost:443/api/images')
            .then(function (images) {
                res.render('index', { user: session, resources: images.data, mensaje: "No se permiten campos vacios", confirmation: true, icon: "error" })
            })
    } else {
        console.log(req.body.user)
        const PARAM = { user: req.body.user }
        const VALUE = { name: req.body.name, lastname: req.body.lastname, email: req.body.email }

        USERS.updateOne(PARAM, VALUE)
            .then(data => {
                if (!data) {
                    console.log('error')
                } else {
                    AXIOS.get('http://localhost:443/api/images')
                        .then(function (images) {
                            res.render('index', { user: session, resources: images.data, mensaje: "Sus datos han sido actualizados", confirmation: true, icon: "success" })
                        })
                }
            })
            .catch(err => {
                res.send(err)
            })
    }
}

exports.getUserReport = (req, res) => {
    const HMTL = FS.readFileSync(PATH.join(__dirname, '../helpers/templates/users.html'), 'utf-8')
    const FILE_NAME = 'REPORTE_USUARIOS' + '.pdf'
    AXIOS.get('http://localhost:443/api/users/').then(function (detail) {
        let obj = detail.data

        const DATA = {
            user: req.session.user,
            obj: obj,
            date: FECHA.toISOString().substring(0, 10)
        }
        const DOCUMENT = {
            html: HMTL,
            data: {
                data: DATA
            },
            path: "./docs/" + FILE_NAME,
            type: ""
        }
        PDF.create(DOCUMENT, OPTIONS).then(p => {
            res.redirect('/' + FILE_NAME)
        }).catch(err => {
            res.send(err)
        })
    })
}