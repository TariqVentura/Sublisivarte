const CODE = require('../../models/code')
const FECHA = require('node-datetime')
const BCRYPT = require('bcrypt')
const USER = require('../../models/users')

//funcion para validar codigo de recuperacion de contraseña
exports.codeValidation = async (username, code) => {
    //capturamos los datos del usuario en un objeto
    let obj = await CODE.find({ user: username, status: 'activo' }).exec()
    //validamos si exiten datos del usuario
    if (!obj.length) {
        return false
    } else {
        //comparamos el codigo ingresado por el usuario con el de la base
        let compare = await BCRYPT.compareSync(code, obj[0].code)

        //retornamos false en caso de no ser iguales
        if (compare == false) {
            return false
        } else {
            //validamos el estado del codigo y si no ha expirado su tiempo limite de 15 minutos
            let newDate = FECHA.create()
            let createCode = Number(obj[0].date.substring(11, 13)) * 60 + Number(obj[0].date.substring(14, 16))
            let insertCode = Number(newDate.format('H')) * 60 + Number(newDate.format('M'))
            let date = insertCode - createCode
            console.log(obj[0].date.substring(0, 10))
            if (obj[0].status == 'inactivo') {
                return false
            } else if (date <= 15 && newDate.format('Y-m-d') == obj[0].date.substring(0, 10)) {
                return true
            } else {
                //en caso de haber expirado cambiamos el estado a inactivo
                await CODE.findByIdAndUpdate(obj[0]._id, { status: 'inactivo' }, { useFindAndModify: false }).exec()
                return false
            }
        }
    }
}

//funcion para validar la contraseña segun parametros de seguridad
exports.passwordValidation = async (control, user) => {
    //capturamos los datos del usuario en un objeto
    const DATA = await USER.find({ user: user }).exec()
    //obtenemos el correo del usuario
    let mail = DATA[0].email
    //separamos para obtener el correo sin el dominio
    let value = mail.split('@')
    // Esta expresión regular verifica si la contraseña cumple con los requisitos
    const PASSWORD_REGEX = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?!.*\s).{8,}$/
    // Estos son los nombres de usuario que no se permiten en la contraseña
    const FORBIDDEN_USERNAMES = ['usuario', 'nombreusuario', 'admin', 'administrador', '12345678', user, value[0]]
    // Esta variable verifica si la contraseña contiene un nombre de usuario no permitido
    const FORBIDDEN = FORBIDDEN_USERNAMES.some(username => control.toLowerCase().includes(username.toLowerCase()))
    // Esta variable verifica si la contraseña cumple con la expresión regular
    const VALID = PASSWORD_REGEX.test(control)
    // Si la contraseña es válida y no contiene un nombre de usuario no permitido, devuelve null de lo contrario, devuelve un objeto con un mensaje de error
    return VALID && !FORBIDDEN ? null : { 'Contraseña inválida': { value: control } }
}

//funcion para validar la existencia de un usuario
exports.userValidation = async (username) => {
    //buscamos datos en la base y los guardamos en un arreglo
    const DATA = await USER.find({ user: username }).exec()

    console.log(DATA)

    //si el arreglo tiene datos enviamos true sino mandamos false 
    if (DATA.length) {
        return true
    } else {
        return false
    }
}

//funcion para comparar contraseñas repetidas
exports.comparePassword = async (username, password) => {
    //buscamos datos en la base y los guardamos en un arreglo
    const DATA = await USER.find({ user: username }).exec()
    //sino hay datos en la base del usuario retornamos false
    if (!DATA.length) {
        return false
    }
    //comparamos los datos de la base con los del usuario
    let compare = await BCRYPT.compareSync(DATA[0].password, password)
    //si hay coincidencia enviamos true sino enviamos false
    if (compare == true) {
        return true
    } else {
        return false
    }
}

exports.emailValidation = async (email, username) => {
    const DATA = await USER.find({ user: username, email: email }).exec()
    console.log(DATA)
    if (!DATA.length) {
        return false
    } else {
        return true
    }
}

exports.codeAuthentication = async (username) => {
    const DATA = await CODE.find({ user: username, status: 'activo' }).exec()

    if (!DATA.length) {
        return true
    } else {
        let newDate = FECHA.create()
        let createCode = Number(DATA[0].date.substring(11, 13)) * 60 + Number(DATA[0].date.substring(14, 16))
        let insertCode = Number(newDate.format('H')) * 60 + Number(newDate.format('M'))
        let date = insertCode - createCode
        console.log(date)
        if (date <= 15 &&  newDate.format('Y-m-d') == DATA[0].date.substring(0, 10)) {
            return false
        } else {
            await CODE.findByIdAndUpdate(DATA[0]._id, { status: 'inactivo' }, { useFindAndModify: false }).exec()
            return true
        }
    }
}

exports.uniqueEmail = async (email) => {
    const DATA = await USER.find({ email: email }).exec()
    
    console.log(DATA)

    if (!DATA.length) {
        return true
    } else {
        return false
    }
}

exports.newPasswordValidation = async (control, user, email) => {
    //separamos para obtener el correo sin el dominio
    let value = email.split('@')
    // Esta expresión regular verifica si la contraseña cumple con los requisitos
    const PASSWORD_REGEX = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?!.*\s).{8,}$/
    // Estos son los nombres de usuario que no se permiten en la contraseña
    const FORBIDDEN_USERNAMES = ['usuario', 'nombreusuario', 'admin', 'administrador', '12345678', user, value[0]]
    // Esta variable verifica si la contraseña contiene un nombre de usuario no permitido
    const FORBIDDEN = FORBIDDEN_USERNAMES.some(username => control.toLowerCase().includes(username.toLowerCase()))
    // Esta variable verifica si la contraseña cumple con la expresión regular
    const VALID = PASSWORD_REGEX.test(control)
    // Si la contraseña es válida y no contiene un nombre de usuario no permitido, devuelve null de lo contrario, devuelve un objeto con un mensaje de error
    return VALID && !FORBIDDEN ? null : { 'Contraseña inválida': { value: control } }
}