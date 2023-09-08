const SEND_ORDER = document.getElementById('enviar-orden')

SEND_ORDER.addEventListener('submit', (e) => {
    e.preventDefault()

    let amount, image, color, size, stock, id, price, product, order

    amount = document.getElementById('amount').value
    image = document.getElementById('image').value
    color = document.getElementById('color').value
    size = document.getElementById('size').value
    stock = document.getElementById('stock').value
    id = document.getElementById('id').value
    price = document.getElementById('price').value
    product = document.getElementById('product').value
    order = document.getElementById('order').value

    console.log(amount +
        image+
        color+
        size+
        stock+
        id+
        price+
        product+
        order)

    axios.post('http://localhost:443/api/details', {
        amount: amount,
        image: image,
        color: color,
        size: size,
        stock: stock,
        id: id,
        price: price,
        product: product,
        order: order
    }, {
        //definimos que utlizaremos body url encoded
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': localStorage.getItem('token')
        }
    }).then(data => {
        switch (data.data) {
            case true:
                Swal.fire({
                    icon: 'success',
                    title: 'Proceso Exitoso',
                    text: 'Se ha creado el pedido exitosamente'
                }).then(() => {
                    //redirigimos a la pagina para visualizar los cambios
                    location.href = '/producto/' + id
                })
                break
            case false:
                //error generico
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Error en la base de datos'
                })
                break
            case 'stock':
                //contraseña invalida
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'No poseemos suficientes existencias de este producto'
                })
                break
            case 'empty':
                //campos vacios
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'No se permiten campos vacios'
                })
                break
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