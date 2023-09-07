//se declaran las dependencias que se utilizaran
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
    console.log(DATA)
    //sino hay datos en la base del usuario retornamos false
    if (!DATA.length) {
        return false
    }
    //comparamos los datos de la base con los del usuario
    let compare = await BCRYPT.compareSync(password, DATA[0].password)
    console.log(compare)
    //si hay coincidencia enviamos true sino enviamos false
    return compare
}

//funcion para validar que el correo pertenezca a un usuario
exports.emailValidation = async (email, username) => {
    //buscamos en la base al usuario con el correo que se envio
    const DATA = await USER.find({ user: username, email: email }).exec()

    //sino hay datos es que el correo no coincide con el usuario y enviamos false
    if (!DATA.length) {
        return false
    } else {
        return true
    }
}

//funcion para validar el codigo de seguridad
exports.codeAuthentication = async (username) => {
    //guardamos en una constante datos para validar el codigo
    const DATA = await CODE.find({ user: username, status: 'activo' }).exec()

    //sino hay datos entonces puede crear un codigo
    if (!DATA.length) {
        return true
    } else {
        //declaramos una fecha de node-datetime
        let newDate = FECHA.create()

        //obtenemos la cantidad de minutos que hay en la hora en que se creo el codigo
        let createCode = Number(DATA[0].date.substring(11, 13)) * 60 + Number(DATA[0].date.substring(14, 16))

        //obtenemos la cantidad de minutos que hay en la hora en que se envio el codigo
        let insertCode = Number(newDate.format('H')) * 60 + Number(newDate.format('M'))

        //calculamos la diferencia de minutos que hay entre el momento que se creo el codigo y el momento en que se envio 
        let date = insertCode - createCode

        console.log(DATA[0].date.substring(0, 10) + ' ' + newDate.format('Y-m-d'))

        //si el tiempo en que se envio es menor o igual a 15 minutos entonces ya tiene un codigo activo y no puede generar otro
        if (date <= 15 && newDate.format('Y-m-d') == DATA[0].date.substring(0, 10)) {
            return false
        } else {
            //si el tiempo es mayor a 15 minutos entonces desactivamos el codigo y le permitimos crear uno nuevo
            await CODE.findByIdAndUpdate(DATA[0]._id, { status: 'inactivo' }, { useFindAndModify: false }).exec()
            return true
        }
    }
}

//funcion para validar que el correo sea unico
exports.uniqueEmail = async (email) => {
    //almacenamos en una constante las coincidencias de usuarios con el correo enviaso
    const DATA = await USER.find({ email: email }).exec()

    //sino hay datos es porque el correo no ha sido utilizado y es valido
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

let intentosFallidos = 0
let cuentaBloqueada = false
let tiempoBloqueo = 24 * 60 * 60 * 1000

function validarContrasena(contrasena) {
    // Verifica si la contraseña ingresada es correcta
    if (contrasena === "Contraseña correcta") {
        // Inicia sesión de forma exitosa
    } else {
        //Incrementa el número de intentos fallidos de inicio de sesión
        intentosFallidos++
        if (intentosFallidos >= 3) {      
            cuentaBloqueada = true
            //Se establece un temporizador para desbloquear la cuenta del usuario
            setTimeout(() => {
                cuentaBloqueada = false;
                intentosFallidos = 0;
            }, tiempoBloqueo);
            alert("Su cuenta ha sido bloqueada debido a varios intentos fallidos de inicio de sesión. Por favor, espere 24 horas o contacte al soporte técnico para recuperar el acceso a su cuenta.");
        } else {
            alert("Contraseña incorrecta. Por favor, inténtelo de nuevo.");
        }
    }
}