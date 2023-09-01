const CODE = require('../../models/code')
const FECHA = require('node-datetime')

exports.codeValidation = async (username) => {
    let obj = await CODE.find({ user: username, status: 'activo' }).exec()
    let newDate = FECHA.create()
    let date = Number(obj[0].date.substring(14, 16)) + 15

    console.log(obj[0].date.substring(0, 13))

    if (obj[0].status == 'inactivo') {
        return false
    } else if (newDate.format('M') > date && newDate.format('Y-m-d H') == obj[0].date.substring(0, 12)) {
        return true
    } else {
        await CODE.findByIdAndUpdate(obj[0]._id, { status: 'inactivo' }, { useFindAndModify: false }).exec()
        return false
    }
}

exports.passwordValidation = (control) => {
    // Esta expresión regular verifica si la contraseña cumple con los requisitos
    const PASSWORD_REGEX = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?!.*\s).{8,}$/
    // Estos son los nombres de usuario que no se permiten en la contraseña
    const FORBIDDEN_USERNAMES = ['usuario', 'nombreusuario', 'admin', 'administrador', '12345678']
    // Esta variable verifica si la contraseña contiene un nombre de usuario no permitido
    const FORBIDDEN = FORBIDDEN_USERNAMES.some(username => control.value.toLowerCase().includes(username.toLowerCase()))
    // Esta variable verifica si la contraseña cumple con la expresión regular
    const VALID = PASSWORD_REGEX.test(control.value)
    // Si la contraseña es válida y no contiene un nombre de usuario no permitido, devuelve null de lo contrario, devuelve un objeto con un mensaje de error
    return VALID && !FORBIDDEN ? null : { 'Contraseña inválida': { value: control.value } }
}