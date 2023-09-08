//obtenemos el formulario
const SEND_ORDER = document.getElementById('enviar-orden')

//escuchamos el evento submit
SEND_ORDER.addEventListener('submit', (e) => {
    //evitamos que se recargue el formulario
    e.preventDefault()

    //declaramos las variables que utilizaremos
    let amount, image, color, size, stock, id, price, product, order

    //le asignamos un valor a las variables
    amount = document.getElementById('amount').value
    image = document.getElementById('image').value
    color = document.getElementById('color').value
    size = document.getElementById('size').value
    stock = document.getElementById('stock').value
    id = document.getElementById('id').value
    price = document.getElementById('price').value
    product = document.getElementById('product').value
    order = document.getElementById('order').value

    //utilizamos axios para realizar la peticion
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
        //definimos que utlizaremos body url encoded y enviamos el token
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': localStorage.getItem('token')
        }
    }).then(data => {
        //utlizamos un switch para validar las respuestas de la API
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