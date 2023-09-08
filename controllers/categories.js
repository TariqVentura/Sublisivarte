//llamamos al formulario
const NEW_CATEGORY = document.getElementById('new-category')

//funcion para enviar los datos a la api de categorias
NEW_CATEGORY.addEventListener('submit', async (e) => {
    //evitamos el proceso default
    e.preventDefault()

    //capturamos los valores del formulario
    let category = document.getElementById('category').value
    let status = document.getElementById('inputGroupSelect01').value

    //utilizamos la libreria de axios para enviar los datos a la api
    axios.post('http://localhost:443/api/categories', {
        categorie: category,
        status: status
    }, {
        //definimos que utlizaremos body url encoded
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': localStorage.getItem('token')
        }
    }).then(data => {
        //validamos si los datos son validos y si se han ingresado en la based para luego mostrar la alerta correspondiente
        if (data.data == true) {
            Swal.fire({
                icon: 'success',
                title: 'Proceso Exitoso',
                text: 'Se ha creado la categoria exitosamente'
            }).then(() => {
                //redirigimos a la pagina para visualizar los cambios
                location.href = '/categorias'
            })

        } else if (data.data == true) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No se permiten campos vacios'
            })
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No se permiten valores repetidos'
            })
        }
    }).catch(err => {
        //error generico
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error en la base de datos'
        })
    })
})

function deleteCategory(_id) {
    Swal.fire({
        title: 'Esta seguro?',
        text: "Esta acción no es reversible",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            axios.get('http://localhost:443/delete/categorie/' + _id, {
                //enviamos el token
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            }).then(data => {
                switch (data.data) {
                    case true:
                        Swal.fire({
                            icon: 'success',
                            title: 'Proceso completado',
                            text: 'Se ha cancelado el pedido exitosamente'
                        }).then(() => {
                            location.href = '/categorias'
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

function changeStatus(_id, status) {
    Swal.fire({
        title: 'Esta seguro?',
        text: "Desea cambiar el estado de esta categoria a " + status,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            axios.get('http://localhost:443/status/categorie/' + _id + '/' + status, {
                //enviamos el token
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            }).then(data => {
                switch (data.data) {
                    case true:
                        Swal.fire({
                            icon: 'success',
                            title: 'Proceso completado',
                            text: 'Se ha cambiado el estado de el pedido exitosamente'
                        }).then(() => {
                            location.href = '/categorias'
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