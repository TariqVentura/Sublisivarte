//obetenemos el formulario
const LOGIN = document.getElementById('login')

//escuchamos el evento submit
LOGIN.addEventListener('submit', (e) => {
    //evitamos que se recargue el formulario
    e.preventDefault()

    //creamos un Toas de SweetAlerts
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })

    //obtenemos los datos del formulario
    let user = document.getElementById('username').value
    let password = document.getElementById('password').value

    //utilizamos axios para enviar la peticion a la API
    axios.post('http://localhost:443/logIn/users', {
        user: user,
        password: password
    }, {
        //definimos que utlizaremos body url encoded
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then(data => {
        console.log(data.data)

        let response = data.data

        if (String(response).includes('expired')) {
            response = 'expired'
        }

        console.log('client: ' + response)

        //validamos con un switch las respuestas de la API
        switch (response) {
            case false:
                Toast.fire({
                    icon: 'error',
                    title: 'Contraseña o usuario incorrectos'
                })
                break

            case 'session':
                Toast.fire({
                    icon: 'error',
                    title: 'Ya existe una sesión activo'
                })
                break
            case 'empty':
                Toast.fire({
                    icon: 'error',
                    title: 'No se permiten campos vacios'
                })
                break
            case 'inactivo':
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Su cuenta ha sido desactivo por sobrepasar el numero de intentos permitidos'
                })
                break
            case 'expired':
                getPasswordChange(String(data.data).substring('expired'.length), user)
                break
            case 'code':
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Usted tiene un proceso de recuperacion de contraseña pendiente'
                }).then(() => {
                    location.href = '/'
                })
                break
            default:
                Swal.fire({
                    icon: 'success',
                    title: 'Inicio de sesión exitoso',
                    text: 'Acceso permtiido'
                }).then(() => {
                    //redirigimos a la pagina para visualizar los cambios
                    localStorage.setItem('token', data.data)
                    location.href = '/'
                })
                break
        }
    })
})

function getPasswordChange(code, user) {
    Swal.fire({
        title: 'Ingresa tus datos',
        html:
            '<input id="input1" type="password" class="swal2-input"> ' +
            '<input id="input2" type="password" class="swal2-input"> ',
        focusConfirm: false,
        preConfirm: () => {
            const input1 = Swal.getPopup().querySelector('#input1').value
            const input2 = Swal.getPopup().querySelector('#input2').value

            if (!input1 || !input2) {
                Swal.showValidationMessage('Ambos campos son obligatorios')
            }

            return { input1: input1, input2: input2 }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            changePassword(code, result.value.input1, result.value.input2, user)
        }
    })
}

function changePassword(code, password, newPassword, user) {
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
                    getPasswordChange(code, user)
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
                    getPasswordChange(code, user)
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
                    getPasswordChange(code, user)
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
                    getPasswordChange(code, user)
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
                    getPasswordChange(code, user)
                })
                break
            case 'user':
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Usuario Inexistente',
                    showConfirmButton: true
                }).then(() => {
                    getPasswordChange(code, user)
                })
                break
            case 'repetido':
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'No se puede utilizar una contraseña antigua',
                    showConfirmButton: true
                }).then(() => {
                    getPasswordChange(code, user)
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
                    getPasswordChange(code, user)
                })
                break
        }
    }).catch(err => {
        //error generico
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: err,
            showConfirmButton: true
        }).then(() => {
            newPassword(code, user)
        })
    })
}