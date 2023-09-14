function getUser() {
    Swal.fire({
        title: 'Ingresa tus datos',
        html:
            '<label style="padding: 3%;" for="user">Usuario: </label>' +
            '<input  type="text" name="user-code" id="user-code" required></br>' +
            '<label style="padding: 3%;" for="email">Correo: </label>' +
            '<input  type="email" name="email" id="email" required>',
        focusConfirm: false,
        preConfirm: () => {
            const USER = Swal.getPopup().querySelector('#user-code').value
            const EMAIL = Swal.getPopup().querySelector('#email').value

            if (!USER || !EMAIL) {
                Swal.showValidationMessage('Ambos campos son obligatorios')
            }

            return { user: USER, email: EMAIL }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            sendCode(result.value.user, result.value.email)
        }
    })
}

function sendCode(user, email) {
    //utilizamos axios para enviar la peticion a la API utilizando el metodo POST
    axios.post('http://localhost:443/email/password', {
        user: user,
        email: email
    }, {
        //definimos que utlizaremos body url encoded
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then(data => {
        //utilizamos switch para validar las diferentes respuestas de la API
        switch (data.data) {
            //se envio el correo
            case true:
                Swal.fire({
                    icon: 'success',
                    title: 'Proceso Completado',
                    text: 'Revise su correo para obtener el código de seguridad para cambiar su contraseña',
                    showConfirmButton: true
                }).then(() => {
                    this.getPasswordRecup()
                })
                break
            //error de base
            case false:
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Error en la base de datos',
                    showConfirmButton: true
                }).then(() => {
                    getUser()
                })
                break
            //campos vacios
            case 'empty':
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'No se permiten campos vacios',
                    showConfirmButton: true
                }).then(() => {
                    getUser()
                })
                break
            //usuario o correo invalido
            case 'user':
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Usuario o correo invalidos',
                    showConfirmButton: true
                }).then(() => {
                    getUser()
                })
                break
            //codigo invalido
            case 'code':
                Swal.fire({
                    icon: 'warning',
                    title: 'Oops...',
                    text: 'Usted ya posee un codigo activo',
                    showConfirmButton: true
                }).then(() => {
                    this.getPasswordRecup()
                })
                break
        }
    })
}

function getPasswordRecup() {
    Swal.fire({
        title: 'Ingresa una contraseña nueva',
        html:
            '<label style="padding: 3%;"  for="code-change">Codigo: </label>' +
            '<input type="text" name="code-change" id="code-change" required></br>' +
            '<label style="padding: 3%;" for="user">Usuario: </label>' +
            '<input type="text" name="user-change" id="user-change" required></br>' +
            '<label style="padding: 3%;" for="input1">Contraseña: </label>' +
            '<input type="password" id="input1" required></br>' +
            '<label style="padding: 3%;" for="input2">Confirmar: </label>' +
            '<input type="password" id="input2" required></br>',
        focusConfirm: false,
        preConfirm: () => {
            const USER = Swal.getPopup().querySelector('#user-change').value
            const CODE = Swal.getPopup().querySelector('#code-change').value
            const PASSWORD = Swal.getPopup().querySelector('#input2').value
            const CONFIRM = Swal.getPopup().querySelector('#input2').value

            if (!USER || !PASSWORD || !CONFIRM || !CODE) {
                Swal.showValidationMessage('No se permtien campos vacios')
            }

            return { user: USER, code: CODE, password: PASSWORD, confirm: CONFIRM }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            this.newPassword(result.value.code, result.value.password, result.value.confirm, result.value.user)
        }
    })
}

function newPassword(code, password, newPassword, user) {
    //utilizamos la libreria de axios para enviar los datos a la api
    axios.post('http://localhost:443/api/newPassword/', {
        code: code,
        password: password,
        newPassword: newPassword,
        user: user
    }, {
        //definimos que utlizaremos body url encoded
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then(data => {
        //utilizamos la estructura switch para capturar los diferentes mensajes que puede enviar la API
        switch (data.data) {
            //proceso exitoso
            case true:
                Swal.fire({
                    icon: 'success',
                    title: 'Proceso Completado',
                    text: 'Se ha cambiado la contraseña exitosamente',
                    showConfirmButton: true
                }).then(() => {
                    //redirigimos a la pagina para visualizar los cambios
                    location.href = '/'
                })
                break
            case false:
                //error generico
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Error en la base de datos try',
                    showConfirmButton: true
                }).then(() => {
                    this.getPasswordRecup()
                })
                break
            //codigo invalido
            case 'codigo':
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Código inválido',
                    showConfirmButton: true
                }).then(() => {
                    this.getPasswordRecup()
                })
                break
            //contraseñoa no coincide
            case 'coincidencia':
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Las contraseñas no coinciden',
                    showConfirmButton: true
                }).then(() => {
                    this.getPasswordRecup()
                })
                break
            //contraseña no cumple los parametros establecidos
            case 'invalido':
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'La contraseña no cumple con los parámetros de seguridad',
                    showConfirmButton: true
                }).then(() => {
                    this.getPasswordRecup()
                })
                break
            //existen campos vacios
            case 'vacio':
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'No se permiten campos vacíos',
                    showConfirmButton: true
                }).then(() => {
                    this.getPasswordRecup()
                })
                break
            case 'user':
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Usuario Inexistente',
                    showConfirmButton: true
                }).then(() => {
                    this.getPasswordRecup()
                })
                break
            case 'repetido':
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'No se puede utilizar una contraseña antigua',
                    showConfirmButton: true
                }).then(() => {
                    this.getPasswordRecup()
                })
                break
            default:
                //error generico
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Error en la base de datos 616',
                    showConfirmButton: true
                }).then(() => {
                    this.getPasswordRecup()
                })
                break
        }
    }).catch(err => {
        //error generico
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error en la conexion',
            showConfirmButton: true
        }).then(() => {
            this.getPasswordRecup()
        })
    })
}
