function sendEmail(username, email) {
    Swal.fire({
        title: 'Esta seguro?',
        text: "¿Desea empezar un proceso de recuperacion de contraseña? ",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            //le asignamos valor a las variables
            user = username
            email = email

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
                    //codigo invalido
                    case 'code':
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Usted ya posee un codigo activo',
                            showConfirmButton: true
                        })
                        break
                }
            })
        }
    })
}

function changeAuthentification(_id, authentification) {
    //mensaje de confirmacion
    Swal.fire({
        title: 'Esta seguro?',
        text: "Desea desactivar la autentificacion " + authentification,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            //utilizamos axios para ejecutar la peticion
            axios.get('http://localhost:443/api/authentification/' + _id + '/' + authentification, {
                //enviamos el token
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            }).then(data => {
                //utilizamos switch para validar las respuestas de la API
                switch (data.data) {
                    case true:
                        Swal.fire({
                            icon: 'success',
                            title: 'Proceso completado',
                            text: 'Se ha cambiado el estado de el pedido exitosamente'
                        }).then(() => {
                            location.href = '/cuenta'
                        })
                        break;
                    case false:
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Error en la base de datos'
                        })
                        break;
                    default:
                        break;
                }
            }).catch(err => {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: err
                })
            })
        }
    })
}