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
            })
        }
    })
}