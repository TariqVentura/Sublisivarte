const VALIDATE_PASSWORD = document.getElementById('form_p')

VALIDATE_PASSWORD.addEventListener('submit', function (e) {
    e.preventDefault()

    let password, newPassword, code

    password = document.getElementById('password').value
    newPassword = document.getElementById('password_confirm').value
    code = document.getElementById('code').value

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
        switch (data.data) {
            case true:
                Swal.fire({
                    icon: 'success',
                    title: 'Proceso Completado',
                    text: 'Se ha cambiado la contraseña exitosamente',
                    showConfirmButton: true
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
            case 'codigo':
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Codigo invalido',
                    showConfirmButton: true
                })
                break
            case 'coincidencia':
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Las contraseñas no coinciden',
                    showConfirmButton: true
                })
                break
            case 'invalido':
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'La contraseña no cumple con los parametros de seguridad',
                    showConfirmButton: true
                })
                break
            case 'vacio':
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'No se permiten campos vacios',
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

})