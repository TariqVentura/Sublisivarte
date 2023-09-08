require('dotenv').config()
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
const OPTIONS_CLIENTS = require('../helpers/format/clients')
const VALIDATION = require('../helpers/validations/users')
const JWT = require('jsonwebtoken')
const TOKEN_VALIDATION = require('../helpers/validations/token')

//funcion para crear un usuario
exports.createUser = async (req, res) => {
    //validamos los campos para que no esten vacios
    if (!req.body.user || !req.body.name || !req.body.lastname || !req.body.email || !req.body.password || !req.body.document || !req.body.confirm) {
        res.send('empty')
        return
    } else {
        //declaramos variables
        let name, lastname, email, user, password, document, role, newDocument, confirm

        //le asignamos un valor a las variables
        name = req.body.name
        lastname = req.body.lastname
        email = req.body.email
        user = req.body.user
        document = req.body.document
        password = req.body.password
        confirm = req.body.confirm


        //validamos que no existan campos vacios
        if (!name.trim() || !lastname.trim() || !email.trim() || !user.trim() || !document.trim() || !password.trim() || !confirm.trim()) {
            res.send('empty')
            return
        }

        console.log(confirm.trim() + ' ' + password.trim())

        if (confirm.trim() != password.trim()) {
            res.send('coincidencia')
            return
        }

        //validamos que no sea un usuario repetido
        const USER_VALIDATION = await VALIDATION.userValidation(user)

        if (USER_VALIDATION == true) {
            res.send('user')
            return
        }

        //validamos que no sea un correo repetido
        const EMAIL_VALIDATION = await VALIDATION.uniqueEmail(email)

        if (EMAIL_VALIDATION == false) {
            res.send('email')
            return
        }

        //validamos que la contraseña sea valida
        const PASSWORD_VALIDATION = await VALIDATION.newPasswordValidation(password, user, email)

        if (PASSWORD_VALIDATION) {
            res.send('invalid')
            return
        }

        //generamos los saltos del hash en 10 que son los que recomienda OWASP
        const SALT_ROUNDS = await BCRYPT.genSaltSync(10)
        const ENCRYPTED_PASSWORD = password

        //hasheamos la contraseña con bcrypt y la guardamos en una constante
        const HASH = await BCRYPT.hashSync(ENCRYPTED_PASSWORD, SALT_ROUNDS)

        //validamos si es un usuario credo desde el sitio publico o privado
        if (req.session.user && req.session.role == 'admin') {

            //validamos que el campo de rol no este vacio
            if (req.body.role) {
                role = req.body.role
            } else {
                role = ''
            }

            console.log('role')

            if (!role.trim()) {
                res.send('empty')
                return
            }

            //creamos un objeto con los datos del nuevo usuario
            newDocument = new USERS({
                name: name,
                lastname: lastname,
                email: email,
                user: user,
                password: HASH,
                document: document,
                role: role
            })

        } else {
            //creamos un objeto con los datos del nuevo usuario
            newDocument = new USERS({
                name: req.body.name,
                lastname: req.body.lastname,
                email: req.body.email,
                user: req.body.user,
                password: HASH,
                document: req.body.document,
            })
        }

        //utilizamos el metodo save de mongoose para guardar los datos en la base
        const DATA = await newDocument.save()

        //enviamos una respuesta segun se haya completado el proceso
        if (DATA) {
            res.send(true)
        } else {
            res.send(false)
        }
    }
}

exports.logIn = async (req, res) => {
    //validamos que no existan campos vacios
    if (!req.body.user && !req.body.password) {
        res.send('empty')
        return
    }

    //obtenemos los datos del formulario
    const USER = req.body.user
    const PASSWORD = req.body.password

    //validamos datos 
    if (!USER.trim() || !PASSWORD.trim()) {
        res.send('empty')
        return
    }

    //verificamos que la contraseña y el usuario coincidan
    const COMPARE = await VALIDATION.comparePassword(USER, PASSWORD)

    //si no coinciden mandamos error
    if (COMPARE == false) {
        res.send(false)
        return
    }

    //verificamos que no haya una sesion
    if (req.session.authenticated) {
        res.send('session')
        return
    } else {
        //almaenamos los datos del usuario en una varible
        let data = await USERS.find({ user: USER }).exec()

        const INFO = {
            user: USER,
            rol: data[0].role
        }

        JWT.sign({ INFO }, process.env.TOKEN, { expiresIn: '1h' }, (err, token) => {
            if (err) {
                res.send(false)
                return
            } else {
                req.session.token = token
                //llenamos los datos de la sesion con los datos del usuario
                req.session.authenticated = true
                req.session.user = USER
                req.session.role = data[0].role
                req.session.status = data[0].status
                req.session.email = data[0].email
                req.session.visitas = req.session.visitas ? ++req.session.visitas : 1

                //enviamos la respuesta
                res.send(true)
            }
        })
    }
}

exports.logOut = (req, res) => {
    req.session.destroy()
    return res.redirect('/')
}

exports.findUsers = (req, res) => {
    if (req.usuario.INFO.rol != 'admin') {
        res.redirect('/error404')
        return
    }
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
            })
            .catch(err => {
                res.status(500).send({ message: err.message || "Ocurrio un error al tratar de obtener la información" })
            })
    }
}

exports.updateUsers = (req, res) => {
    if (!req.session.user || req.session.role != 'admin') {
        res.redirect('/error404')
        return
    }
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
    if (!req.session.user || req.session.role != 'admin') {
        res.redirect('/error404')
        return
    }
    const ID = req.params.id
    const VALUE = { status: 'baneado' }

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
    if (!req.session.user || req.session.role != 'admin') {
        res.redirect('/error404')
        return
    }
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
    if (req.usuario.INFO.rol != 'admin') {
        res.redirect('/error404')
        return
    }
    const key = req.params.key
    USERS.find(
        {
            "$or": [
                { name: { $regex: key } },
                { lastname: { $regex: key } },
                { email: { $regex: key } },
                { user: { $regex: key } },
                { document: { $regex: key } },
                { role: { $regex: key } }
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

/*
*   Función asíncrona para cambiar la contraseña de un usuario.
*   
*   Parámetros:
*   - req: Objeto de solicitud HTTP.
*   - res: Objeto de respuesta HTTP.
*   
*   Retorno: Ninguno.
*/

//Función para cambiar la contraseña
exports.newPassword = async (req, res) => {
    //declaramos variables que utilizaremos
    let password, newPassword, encryptedPassword, rounds, username, code

    //les asignamos un valor a las varibles
    password = req.body.password
    newPassword = req.body.newPassword
    rounds = 10
    code = req.body.code

    //validamos si existe una sesion o si es recuperacion de contraseña
    if (req.session.user) {
        username = req.session.user
    } else {
        if (req.body.user) {
            username = req.body.user
        } else {
            res.send('vacio')
            return
        }
    }

    //validamos que sea un usuario existente
    let userValidation = await VALIDATION.userValidation(username)

    if (userValidation == false) {
        res.send('user')
        return
    }

    //validamos que no existan campos vacios
    if (!password.trim() || !newPassword.trim() || !code.trim()) {
        res.send('vacio')
        return
    } else {
        //utilizamos una funcion para validar si el codigo es valido (ctrl + click en codeValidation para ver el codigo)
        let codeValidation = await VALIDATION.codeValidation(username, code)

        //si la funcion retorna true procedemos sino enviamos que ocurrio un error
        if (codeValidation == true) {
            if (password != newPassword) {
                //si las contraseñas no coinciden enviamos un error
                res.send('coincidencia')
                return
            } else {
                console.log(newPassword)
                //utilizamos una funcion para validar si la contraseña es valida (ctrl + click en passwordValidation para ver el codigo)
                let passwordValidation = await VALIDATION.passwordValidation(newPassword, username)

                //validamos que no ingrese una clave repetida
                let comparePassword = await VALIDATION.comparePassword(username, newPassword)

                //si la validacion retorna null es que no hay problema
                if (!passwordValidation || comparePassword == true) {
                    //encriptamos la contraseña utilizando 10 saltos
                    encryptedPassword = await BCRYPT.hashSync(newPassword, rounds)
                    try {
                        //guardamos los datos en la base
                        await USERS.updateOne({ user: username }, { password: encryptedPassword })
                        //enviamos confirmacion
                        res.send(true)
                    } catch (error) {
                        //si ocurrio un error se envia un error
                        res.send(false)
                    }
                } else {
                    //error si la contraseña no es valida
                    res.send('invalido')
                    return
                }
            }
        } else {
            res.send('codigo')
            return
        }
    }
}

exports.statusUser = (req, res) => {
    if (!req.session.user || req.session.role != 'admin') {
        res.redirect('/error404')
        return
    }
    const PARAM = { user: req.params.id }
    const VALUE = { status: 'inactivo' }

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
    if (req.usuario.INFO.user != req.session.user) {
        res.send('No puedes modificar datos de otro usuario')
        return
    }

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
    if (!req.session.user || req.session.role != 'admin') {
        res.redirect('/error404')
        return
    }
    //creamos constante de FILE_NAME y HTML como parametros para la dependencia
    const HMTL = FS.readFileSync(PATH.join(__dirname, '../helpers/templates/users.html'), 'utf-8')
    const FILE_NAME = 'REPORTE_USUARIOS_' + req.params.key + '.pdf'
    
    let token

    if (req.session.token) {
        token = req.session.token
    } else {
        token = null
    }

    const CONFIG = {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }
    
    //ocupamos el axios para obtener los datos de la api
    AXIOS.get('http://localhost:443/api/users/' + req.params.key, CONFIG).then(function (detail) {
        //declaramos arreglos vacios y un objeto donde guardaremos los datos de la api
        let obj = detail.data, active = [], inactive = [], banned = []

        //navegamos en el objeto con un forEach
        obj.forEach(i => {
            //almacenamos los datos del salto en un nuevo objeto
            let filter = { name: i.name, lastname: i.lastname, email: i.email, user: i.user, document: i.document }

            //filtramos los datos y los almacenamos en los arreglos que creamos antes segun su estado
            if (i.status == 'activo') {
                active.push(filter)
            } else if (i.status == 'inactivo') {
                inactive.push(filter)
            } else if (i.status == 'baneado') {
                banned.push(filter)
            }
        })

        //creamos otros objeto donde almacenamos los datos que enviaremos al reporte
        const DATA = {
            user: req.session.user,
            active: active,
            inactive: inactive,
            banned: banned,
            date: FECHA.toISOString().substring(0, 10) + ' ' + FECHA.getHours() + ':' + FECHA.getMinutes() + ':' + FECHA.getSeconds()
        }

        //creamos la constante que enviaremos como parametro a la dependencia
        const DOCUMENT = {
            html: HMTL,
            data: {
                data: DATA
            },
            path: "./docs/" + FILE_NAME,
            type: ""
        }

        //validamos que tipo de usuario sera el que tendra el reporte y abrimos el reporte en el navegador
        if (req.params.key == 'admin') {
            PDF.create(DOCUMENT, OPTIONS).then(p => {
                res.redirect('/' + FILE_NAME)
            }).catch(err => {
                res.send(err)
            })
        } else {
            PDF.create(DOCUMENT, OPTIONS_CLIENTS).then(p => {
                res.redirect('/' + FILE_NAME)
            }).catch(err => {
                res.send(err)
            })
        }
    })
}

exports.countUsers = (req, res) => {
    //Usamos un funcion de agregacion y filtramos a los usuarios que esten activos e inactivos
    USERS.aggregate().group({
        //Agrupamos los usuarios en estados y contamos cuantos usuarios por estado hay.
        _id: "$status",
        count: { $count: {} }
    }).then(data => {
        //Enviamos la data
        res.send(data)
    }).catch(err => {
        res.status(404).send(err)
    })
}
