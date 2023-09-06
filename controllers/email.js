//mandamos a llamar al formulario
CODE_FORM = document.getElementById('code-form')

CODE_FORM.addEventListener('submit', (e) => {
    //evitamos que se envie el formulario
    e.preventDefault()

    //declaramos varibles
    let user, email

    //le asignamos valor a las variables
    user = document.getElementById('user').value
    email = document.getElementById('email').value

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
                    //redirigimos a la pagina para visualizar los cambios
                    location.href = '/'
                })
                break
            //error de base
            case false:
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Error en la base de datos',
                    showConfirmButton: true
                })
                break
            //campos vacios
            case 'empty':
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'No se permiten campos vacios',
                    showConfirmButton: true
                })
                break
            //usuario o correo invalido
            case 'user':
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Usuario o correo invalidos',
                    showConfirmButton: true
                })
                break
            //usuario o correo invalido
            case 'code':
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Usted ya posee un codigo de recuperacion activo',
                    showConfirmButton: true
                })
                break
        }
    })
})