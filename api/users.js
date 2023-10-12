require('dotenv').config()
/**
 * Se declaran las constantes para mandar a llamar al controlador y las dependencias de node
 */
const USERS = require('../models/users')
const AXIOS = require('axios')
const BCRYPT = require('bcrypt')
const FECHA = require('node-datetime')
const PDF = require('pdf-creator-node')
const PATH = require('path')
const FS = require('fs')
const OPTIONS = require('../helpers/format/users')
const OPTIONS_CLIENTS = require('../helpers/format/clients')
const VALIDATION = require('../helpers/validations/users')
const VALIDATION_REPORT = require('../helpers/validations/reports')
const MAIL = require('../api/email')
const ATTEMPS = require('../models/attemps')
const JWT = require('jsonwebtoken')


//funcion para crear un usuario
exports.createUser = async (req, res) => {
    //validamos los campos para que no esten vacios
    if (!req.body.user || !req.body.name || !req.body.lastname || !req.body.email || !req.body.password || !req.body.document || !req.body.confirm) {
        res.send('empty')
        return
    } else {
        //declaramos variables
        let name, lastname, email, user, password, document, role, newDocument, confirm, authentification

        //le asignamos un valor a las variables
        name = req.body.name
        lastname = req.body.lastname
        email = req.body.email
        user = req.body.user
        document = req.body.document
        password = req.body.password
        confirm = req.body.confirm
        authentification = req.body.authentification


        //validamos que no existan campos vacios
        if (!name.trim() || !lastname.trim() || !email.trim() || !user.trim() || !document.trim() || !password.trim() || !confirm.trim()) {
            res.send('empty')
            return
        }

        //validamos que coincidan las contraseñas del formulario
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
            const COUNT = await USERS.count().exec()

            if (COUNT > 0) {
                //creamos un objeto con los datos del nuevo usuario
                newDocument = new USERS({
                    name: req.body.name,
                    lastname: req.body.lastname,
                    email: req.body.email,
                    user: req.body.user,
                    password: HASH,
                    document: req.body.document
                })
            } else {
                //validamos que el campo de rol no este vacio
                if (req.body.role) {
                    role = req.body.role
                } else {
                    role = ''
                }

                if (!role.trim()) {
                    res.send('empty')
                    return
                }
                //creamos un objeto con los datos del nuevo usuario
                newDocument = new USERS({
                    name: req.body.name,
                    lastname: req.body.lastname,
                    email: req.body.email,
                    user: req.body.user,
                    password: HASH,
                    document: req.body.document,
                    role: role
                })
            }
        }

        try {
            //utilizamos el metodo save de mongoose para guardar los datos en la base
            const DATA = await newDocument.save()
            console.log(newDocument + ' ' + DATA)
            return res.send(true)
        } catch (error) {
            console.log(error)
            return res.send(false)
        }
    }
}

//funcion de login 
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

    //almacenamos los datos del usuario en una varible
    let data = await USERS.find({ user: USER }).exec()

    //verificamos que la contraseña y el usuario coincidan
    const COMPARE = await VALIDATION.comparePassword(USER, PASSWORD)
    //si no coinciden mandamos error
    if (COMPARE == false) {
        res.send(false)
        return
    } else if (COMPARE == 'inactivo') {
        res.send('inactivo' + data[0].email)
        return
    }

    //obtenemos el valor de retorno de la funcion changePassword
    const CHANGE_PASSWORD = await VALIDATION.changePassword(USER)

    //si retorna code es porque existe un proceso de recuperacion de contraseña pendiente
    if (CHANGE_PASSWORD == 'code') {
        res.send('code')
        return
        //si retorna un dato y este no es falso es porque debe cambiar la contraseña porque expiro el plazo de 90 dias
    } else if (CHANGE_PASSWORD && CHANGE_PASSWORD != false) {
        //enviamos el codigo de cambio de contraseña
        res.send('expired' + CHANGE_PASSWORD)
        return
    }

    //obtenemos la cantidad de intentos fallidos del usuario
    const GET_ATTEMPTS = await ATTEMPS.findOne({ user: USER }).exec()

    if (GET_ATTEMPTS) {
        //restablecemos la cantidad de intentos del usuario para loggearse
        const RESTART_ATTEMPTS = await ATTEMPS.updateOne({ user: USER }, { attempt: 0 }, { useFindAndModify: false }).exec()
    }

    if (data[0].status == 'inactivo') {
        return res.send('inactivo' + data[0].email)
    }

    //verificamos que no haya una sesion
    if (req.session.authenticated) {
        res.send('session')
        return
    } else {
        //generamos los saltos para encriptar los datos
        const SALT_ROUNDS = await BCRYPT.genSaltSync(10)

        //encriptamos el usuario
        const ENCRYPTED_USER = await BCRYPT.hashSync(USER, SALT_ROUNDS)

        //obtenemos el rol del usuario
        const NEW_ROL = data[0].role

        //encriptamos el rol
        const ENCRYPTED_ROL = await BCRYPT.hashSync(NEW_ROL[0], SALT_ROUNDS)

        //creamos un objeto con la informacion del usuario
        const INFO = {
            user: ENCRYPTED_USER,
            rol: ENCRYPTED_ROL
        }

        try {
            const TOKEN = await JWT.sign({ INFO }, process.env.TOKEN, { expiresIn: '1h' })
            //firmamos el token utilizando variables de entorno
            if (data[0].authentification == 'activado') {
                const CODE_AUTHENTICATION = await VALIDATION.codeAuthentication(USER)

                if (CODE_AUTHENTICATION == true) {
                    const AUTHENTIFICATION_CODE = await MAIL.codeAuthentication(USER)

                    if (AUTHENTIFICATION_CODE == true) {
                        return res.send('authentification' + TOKEN)
                    } else {
                        return res.send(false) //enviamos la respuesta
                    }
                } else {
                    return res.send('authentification' + TOKEN)
                }
            } else {
                //Aqui estaba token y puse TOKEN no se si habria algun error
                const TOKEN = await JWT.sign({ INFO }, process.env.TOKEN, { expiresIn: '1h' })
                req.session.token = TOKEN
                //llenamos los datos de la sesion con los datos del usuario
                req.session.authenticated = true
                req.session.user = USER
                req.session.role = data[0].role
                req.session.status = data[0].status
                req.session.email = data[0].email
                req.session.visitas = req.session.visitas ? ++req.session.visitas : 1
                return res.send(TOKEN) //enviamos la respuesta
            }
        } catch (error) {
            console.log(error)
        }
    }
}

exports.userCode = async (req, res) => {
    //validamos que no existan campos vacios
    if (!req.body.user && !req.body.code) {
        res.send('empty')
        return
    }

    //obtenemos los datos del formulario
    const USER = req.body.user
    const CODE = req.body.code

    //validamos datos 
    if (!USER.trim() || !CODE.trim()) {
        res.send('empty')
        return
    }

    const COMPARE = await VALIDATION.codeValidation(USER, CODE)

    if (COMPARE == true) {
        const USER_OBJECT = await USERS.findOne({ user: USER }).exec()

        const ENCRYPTED_USER = await BCRYPT.hashSync(USER_OBJECT.user, 10)

        const ENCRYPTED_ROL = await BCRYPT.hashSync(USER_OBJECT.role[0], 10)

        const INFO = {
            user: ENCRYPTED_USER,
            rol: ENCRYPTED_ROL
        }

        try {
            const TOKEN = await JWT.sign({ INFO }, process.env.TOKEN, { expiresIn: '1h' })
            req.session.token = TOKEN
            //llenamos los datos de la sesion con los datos del usuario
            req.session.authenticated = true
            req.session.user = USER
            req.session.role = USER_OBJECT.role
            req.session.status = USER_OBJECT.status
            req.session.email = USER_OBJECT.email
            req.session.visitas = req.session.visitas ? ++req.session.visitas : 1
            return res.send(true)
        } catch (error) {
            console.log(error)
            return res.send(error)
        }
    } else {
        return res.send(false)
    }
}

//Función para cerrar sesión
exports.logOut = (req, res) => {
    //destruimos la sesion
    req.session.destroy()
    return res.send('logout')
}

//Función para buscar usuarios
exports.findUsers = (req, res) => {
    // Comprueba si se proporcionó un parámetro "id" en la solicitud.
    if (req.params.id) {
        //Obtiene el valor del parámetro
        const id = req.query.id
        //Busca el usuario por su ID
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
        // Si no se proporciona un parámetro "id" en la solicitud, realiza una búsqueda de todos los usuarios
        USERS.find()
            .then(user => {
                res.send(user)
            })
            .catch(err => {
                res.status(500).send({ message: err.message || "Ocurrio un error al tratar de obtener la información" })
            })
    }
}

//Función para actualizar usuarios
exports.updateUsers = (req, res) => {
    // Comprueba si no hay un usuario en la sesión o si el rol del usuario no es 'admin'.
    if (!req.session.user || req.session.role != 'admin') {
        res.redirect('/error404')
        return
    }

    const CONFIG = {
        headers: {
            'Authorization': `Bearer ${req.session.token}`
        }
    }

    //Obtiene el valor del parámetro 
    const id = req.body.id

    //Actualiza al usuario por su id
    USERS.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            // Comprueba si se encontró un usuario con el ID proporcionado.
            if (!data) {
                res.status(404).send({ message: "No se encontro el usuario" })
            } else {
                AXIOS.get('http://localhost:443/api/users', CONFIG)
                    .then(function (response) {
                        res.render('usuarios', { users: response.data, mensaje: "Usuario Actualizado", confirmation: true, icon: 'success', user: req.session, count: 1 })
                    })
            }
        })
        .catch(err => {
            res.status(500).send({ message: "Ocurrio un error al intentar ejecutar el proceso" })
        })
}

//Función para banear al usuario
exports.bannUser = (req, res) => {
    if (!req.session.user || req.session.role != 'admin') {
        res.redirect('/error404')
        return
    }

    const CONFIG = {
        headers: {
            'Authorization': `Bearer ${req.session.token}`
        }
    }

    const ID = req.params.id
    const VALUE = { status: 'baneado' }

    USERS.findByIdAndUpdate(ID, VALUE, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.send('error')
            } else {
                AXIOS.get('http://localhost:443/api/users', CONFIG)
                    .then(function (response) {
                        res.render('usuarios', { users: response.data, mensaje: "Usuario Baneado", confirmation: true, icon: 'success', user: req.session, count: 1 })
                    })
            }
        })
        .catch(err => {
            res.send(err)
        })

}

//Función para eliminar/desactivar usuarios
exports.deleteUsers = (req, res) => {
    if (!req.session.user || req.session.role != 'admin') {
        res.redirect('/error404')
        return
    }
    if (req.session.user != req.params.user) {

        const CONFIG = {
            headers: {
                'Authorization': `Bearer ${req.session.token}`
            }
        }

        const VALUE = { user: req.params.user }
        USERS.deleteOne(VALUE)
            .then(data => {
                if (!data) {
                    res.send('err')
                } else {
                    AXIOS.get('http://localhost:443/api/users', CONFIG)
                        .then(function (response) {
                            res.render('usuarios', { users: response.data, mensaje: "Usuario Eliminado", confirmation: true, icon: 'success', user: req.session, count: 1 })
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

//Función para buscar usuarios
exports.searchUsers = async (req, res) => {
    const COMPARE = await BCRYPT.compareSync('admin', req.usuario.INFO.rol)

    if (COMPARE == false) {
        return res.send(false)
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
                return res.status(404).send({ message: `Sin datos` })
            } else {
                return res.send(data)
            }
        })
        .catch(err => {
            return res.send(err)
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

        //si la funcion retorna true procedemos, si no enviamos que ocurrio un error
        if (codeValidation == true) {
            if (password != newPassword) {
                //si las contraseñas no coinciden enviamos un error
                res.send('coincidencia')
                return
            } else {
                console.log(newPassword)
                //utilizamos una funcion para validar si la contraseña es valida (ctrl + click en passwordValidation para ver el codigo)
                let passwordValidation = await VALIDATION.passwordValidation(newPassword, username)

                if (passwordValidation == 'true') {
                    return res.send('repetido')
                }

                //si la validacion retorna null es que no hay problema
                if (!passwordValidation) {
                    //encriptamos la contraseña utilizando 10 saltos
                    encryptedPassword = await BCRYPT.hashSync(newPassword, rounds)
                    try {
                        //guardamos los datos en la base
                        await USERS.updateOne({ user: username }, { password: encryptedPassword, status: 'activo' })
                        //enviamos confirmacion
                        res.send(true)
                    } catch (error) {
                        //si ocurrio un error se envia un error
                        console.log(error)
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

//Función estado usuario
exports.statusUser = (req, res) => {
    if (!req.session.user) {
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

//Función obtener usuario
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
                console.log('data: ' + data)
                res.send(data)
            }
        })
        .catch(err => {
            res.send(err)
        })
}

//Función modificar usuario
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

//Función obtener reporte de usuarios
exports.getUserReport = (req, res) => {
    if (!req.session.user || req.session.role != 'admin') {
        res.redirect('/error404')
        return
    }
    //creamos constante de FILE_NAME y HTML como parametros para la dependencia
    const HMTL = FS.readFileSync(PATH.join(__dirname, '../helpers/templates/users.html'), 'utf-8')
    const FILE_NAME = 'REPORTE_USUARIOS_' + req.params.key + '.pdf'

    //creamos una vartiable token
    let token

    //obtenemos los datos del token y validamos si existe
    if (req.session.token) {
        token = req.session.token
    } else {
        token = null
    }

    //creamos un objeto para definir los headers de la peticion de axios donde enviaremos el token
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

        const NEW_DATE = FECHA.create()
        const DATE_FORMAT = NEW_DATE.format('Y-m-d H:M:S')
        //creamos otros objeto donde almacenamos los datos que enviaremos al reporte
        const DATA = {
            user: req.session.user,
            active: active,
            inactive: inactive,
            banned: banned,
            newDate: DATE_FORMAT,
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
                console.log(FILE_NAME)
                //eliminamos el reporte del servidor
                VALIDATION_REPORT.deleteFile("./docs/" + FILE_NAME)
            }).catch(err => {
                res.send('error')
            })
        } else {
            PDF.create(DOCUMENT, OPTIONS_CLIENTS).then(p => {
                res.redirect('/' + FILE_NAME)
                //eliminamos el reporte del servidor
                VALIDATION_REPORT.deleteFile("./docs/" + FILE_NAME)
            }).catch(err => {
                res.send('error')
            })
        }
    })
}

//Función contar usuarios
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

//Función autentificar usuarios
exports.userAuthentification = (req, res) => {
    const AUTHENTIFICATION = req.params.authentification
    const ID = req.params.id
    const VALUE = { authentification: AUTHENTIFICATION }
    console.log(AUTHENTIFICATION + ' ' + ID + ' ' + VALUE)
    USERS.findByIdAndUpdate(ID, VALUE, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.send(false)
            } else {
                res.send(true)
            }
        })
        .catch(err => {
            res.send(false)
        })
}

exports.bulkInsert = async (req, res) => {
    if (!req.body.file) {
        return res.send('empty')
    }

    const FILE_NAME = String(req.body.file).substring("C:/fakepath/".length)

    if (!FILE_NAME.trim()) {
        return res.send('empty')
    }

    if (!FILE_NAME.includes('.json')) {
        return res.send('format')
    }

    FS.access("./data/" + FILE_NAME, FS.constants.F_OK, async (err) => {
        if (err) {
            return res.send('file')
        } else {
            try {
                const USER_DATA = FS.readFileSync("./data/" + FILE_NAME)

                const USER_FORMAT = JSON.parse(USER_DATA)

                const VALIDATE_USER = await this.validateUser(USER_FORMAT)

                if (VALIDATE_USER == false) {
                    return res.send('data')
                }

                const ENCRYPTED_DATA = await this.encryptData(USER_FORMAT)

                if (ENCRYPTED_DATA == 'password') {
                    return res.send('password')
                }

                const SAVE_USER = await USERS.insertMany(ENCRYPTED_DATA)

                return res.send(true)
            } catch (error) {
                console.log(error)
                return res.send(false)
            }
        }
    })
}


exports.encryptData = async (format) => {
    for (let index = 0; index < format.length; index++) {
        try {
            const PASSWORD_VALIDATION = await VALIDATION.newPasswordValidation(format[index].password, format[index].user, format[index].email)

            if (PASSWORD_VALIDATION) {
                return 'password'    
            }

            const ENCRYPTED_PASSWORD = await BCRYPT.hashSync(format[index].password, 10)
            format[index].password = ENCRYPTED_PASSWORD
        } catch (error) {
            console.log(error)
            return false
        }
    }
    console.log(format)
    
    return format
}

exports.validateUser = async (format) => {
    let formatError = 0
    for (let i = 0; i < format.length; i++) {
        console.log(format[i].user)
        try {
            const FIND_USER = await USERS.findOne({
                "$or": [
                    { user: format[i].user },
                    { email: format[i].email },
                    { document: format[i].document }
                ]
            }).exec()
            if (FIND_USER) {
                formatError = formatError + 1
            }
        } catch (error) {
            comsole.log(error)
            return false
        }
    }

    if (formatError == 0) {
        return true
    } else {
        return false
    }
}