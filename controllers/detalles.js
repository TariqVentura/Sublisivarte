//funcion para eliminar un producto del pedido
function deleteDetail(product, amount, id) {
    //mensaje de confirmacion
    Swal.fire({
        title: 'Confirmación',
        text: "¿Esta seguro que desea eliminar el producto " + product + "?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            //utilizamos axios para enviar la peticion
            axios.get('http://localhost:443/delete/details/' + product + "/" + amount + "/" + id, {
                //enviamos el token
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            }).then(data => {
                //validamos la respueta de la API utilizando axios
                switch (data.data) {
                    case true:
                        Swal.fire({
                            icon: 'success',
                            title: 'Proceso completado',
                            text: 'Se ha eliminado el producto exitosamente'
                        }).then(() => {
                            location.href = '/carrito'
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