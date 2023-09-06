CODE_FORM = document.getElementById('code-form')

CODE_FORM.addEventListener('submit', (e) => {
    e.preventDefault()

    let user, email

    user = document.getElementById('user').value
    email = document.getElementById('email').value

    axios.post('http://localhost:443/email/password', {
        user: user,
        email: email
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
                    text: 'Revise su correo para obtener el código de seguridad para cambiar su contraseña',
                    showConfirmButton: true
                }).then(() => {
                    //redirigimos a la pagina para visualizar los cambios
                    location.href = '/'
                })
                break
            case false:
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Error en la base de datos',
                    showConfirmButton: true
                })
                break
            case 'empty':
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'No se permiten campos vacios',
                    showConfirmButton: true
                })
                break
            case 'user':
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Usuario o correo invalidos',
                    showConfirmButton: true
                })
                break
        }
    })
})