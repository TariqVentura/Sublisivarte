//se declaran las dependencias que se utilizaran
const CODE = require('../../models/code')
const FECHA = require('node-datetime')
const BCRYPT = require('bcrypt')
const USER = require('../../models/users')
const ATTEMPS = require('../../models/attemps')


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
    let compare = await BCRYPT.compareSync(password, DATA[0].password)

    //si hay coincidencia enviamos true sino enviamos false
    if (compare == false) {
        //declaramos variables a utilizar
        let attemps, newAttemp, user
        //guardamos los intentos del usuario en una variable
        const DATA = await ATTEMPS.findOne({ user: username }).exec()
        if (!DATA) {
            //sino hay atentos le asignamos el valor a 1
            attemps = 1
            //creamos un objeto con los datos que necesita el documento
            const NUMBER = new ATTEMPS({
                user: username,
                attempt: attemps
            })

            //guardamos el documento
            newAttemp = await NUMBER.save()
        } else {
            //si hay datos le sumamos 1 a la cantidad de intentos
            attemps = Number(DATA.attempt) + 1
            //actualizamos el documento con la nueva data
            newAttemp = await ATTEMPS.updateOne({ user: username }, { attempt: attemps }).exec()
            //si la cantidad de intestos es mayor o igual a 3 se bloquea el usuario
            if (attemps >= 3) {
                //enviamos la respuesta  a la API para que la devuelva al cliente
                user = await USER.updateOne({ user: username }, { status: 'inactivo' })
                return 'inactivo'
            }
        }
        //retornamos falso 
        return compare
    } else {
        //retornamos verdadero ya que la clave coincide
        return true
    }

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

exports.changePassword = async (user) => {
    //obtenemos datos del usuario
    const DATA = await USER.findOne({ user: user }).exec()
    //capturamos la fecha y la convertimos a String
    const USER_FORMAT = String(DATA.updatedAt).split(" ")
    //modificamos el formato para adecuarlo a tipo Date
    const NEW_FORMAT = USER_FORMAT.slice(0, 4).join(" ")
    //obtenemos la fecha de hoy
    const DATE_FORMAT = FECHA.create()
    //le damos formato a la fecha de hoy
    const NEW_DATE = DATE_FORMAT.format('Y-m-d').toString()
    //calculamos la diferencia de fechas
    const DATE_DIFFERENCE = new Date(NEW_DATE + 'T00:00:00-0600') - new Date(NEW_FORMAT)
    //calculamos la diferencia de dias
    const DAYS_DIFFERENCE = Math.floor(DATE_DIFFERENCE / (1000 * 60 * 60 * 24))
    //si la fierencia de dias es mayor que 90 obligamos un cambio de contraseña
    if (DAYS_DIFFERENCE >= 90) {
        //validamos que no tenga un proceso de actualizacion de contraseña pendiente
        const codeAuthentication = await this.codeAuthentication(user)

        //enviamos error en caso que tenga un proceso de actualizacion de contraseña pendiente
        if (codeAuthentication == false) {
            return 'code'
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
        const SALT_ROUNDS = await BCRYPT.genSaltSync(10)
        //enviamos el string que vamos a encriptar
        const ENCRYPTED_STRING = await BCRYPT.hashSync(result, SALT_ROUNDS)

        //creamos un objeto con los datos que guardaremos
        const CODES = new CODE({
            code: ENCRYPTED_STRING,
            user: user,
            date: date.format('Y-m-d H:M:S')
        })

        //guardamos el documento
        const SAVE = CODES.save()
        
        //validamos que se haya ejecutado el proceso
        if (SAVE) {
            //retornamos el codigo para enviarlo al cliente
            return result
        } else {
            return false
        }

    } else {
        //retornamos null en caso que no haya pasado el tiempo
        return null
    }
}