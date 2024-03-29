const VALIDATE_PASSWORD = document.getElementById('form_p')

//evento para enviar los datos a la API
VALIDATE_PASSWORD.addEventListener('submit', function (e) {
    //evitamos que recargue el formulario
    e.preventDefault()

    //declaramos las variables
    let password, newPassword, code

    //le asignamos valor a las variables
    password = document.getElementById('password').value
    newPassword = document.getElementById('password_confirm').value
    code = document.getElementById('code').value

    changePassword(code, password, newPassword)

})

function changePassword(code, password, newPassword) {
    //utilizamos la libreria de axios para enviar los datos a la api
    axios.post('http://localhost:443/api/newPassword/', {
        code: code,
        password: password,
        newPassword: newPassword
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
                    location.href = '/cuenta'
                })
                break
            case false:
                //error generico
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Error en la base de datos try',
                    showConfirmButton: true
                })
                break
            //codigo invalido
            case 'codigo':
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Código inválido',
                    showConfirmButton: true
                })
                break
            //contraseñoa no coincide
            case 'coincidencia':
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Las contraseñas no coinciden',
                    showConfirmButton: true
                })
                break
            //contraseña no cumple los parametros establecidos
            case 'invalido':
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'La contraseña no cumple con los parámetros de seguridad',
                    showConfirmButton: true
                })
                break
            //existen campos vacios
            case 'vacio':
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'No se permiten campos vacíos',
                    showConfirmButton: true
                })
                break
            case 'user':
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Usuario Inexistente',
                    showConfirmButton: true
                })
                break
            case 'repetido':
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'No se puede utilizar una contraseña antigua',
                    showConfirmButton: true
                })
                break
            default:
                //error generico
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Error en la base de datos 616',
                    showConfirmButton: true
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
        })
    })
}