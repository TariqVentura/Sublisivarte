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
                        break
                    case false:
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Error en la base de datos'
                        })
                        break
                    default:
                        break
                }
            })
        }
    })
}

finishOrder = (_id) => {
    Swal.fire({
        title: 'Confirmación',
        text: "¿Esta seguro que desea realizar la compra?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            //utilizamos axios para enviar la peticion
            axios.get('http://localhost:443/finish/orders/' + _id, {
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
                            text: 'Se ha realizado la compra exitosamente'
                        }).then(() => {
                            location.href = '/carrito'
                        })
                        break
                    case false:
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Error en la base de datos'
                        })
                        break
                    default:
                        break
                }
            })
        }
    })
}

const FORM_COMMENT = document.getElementById('form-comment')

FORM_COMMENT.addEventListener('submit', (e) => {
    e.preventDefault()
    let comment, review, client, product

    comment = document.getElementById('comment').value
    review = document.getElementById('review').value
    client = document.getElementById('client').value
    product = document.getElementById('product').value

    axios.post('http://localhost:443/api/comments', {
        comment: comment,
        review: review,
        client: client,
        product: product
    }, {
        //definimos que utlizaremos body url encoded y enviamos el token 
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': localStorage.getItem('token')
        }
    }).then((data) => {
        console.log(data)
        switch (data.data) {
            case true:
                Swal.fire({
                    icon: 'success',
                    title: 'Proceso completado',
                    text: 'Se ha publicado el comentario exitosamente'
                }).then(() => {
                    location.href = '/carrito'
                })
                break
            case false:
                Swal.fire({
                    icon: 'error',
                    title: 'Ooops...',
                    text: 'Ha ocurrido un error de red'
                })
                break
            case 'empty':
                Swal.fire({
                    icon: 'error',
                    title: 'Ooops...',
                    text: 'No se permiten campos vacios'
                })
                break
            case 'max':
                Swal.fire({
                    icon: 'error',
                    title: 'Ooops...',
                    text: 'El valor maximo de la puntuacion es 10 y su valor minimo es 0'
                })
                break
            case 'length':
                Swal.fire({
                    icon: 'error',
                    title: 'Ooops...',
                    text: 'El comentario excede el limite de 250 caracteres'
                })
                break
        }
    })
})