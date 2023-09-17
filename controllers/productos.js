document.addEventListener("DOMContentLoaded", function (event) {
    // se ocupa axios para obtener la informacion de la api
    axios.get('http://localhost:443/api/count/products').then(function (products) {
        //declaramos la variables que ocuparemos
        //alamcenamos los datos de la api en la variable data
        let data = products.data, categorieName = [], categorieCount = [], count, name

        //navegamos con un for dentro del objeto data
        for (let i = 0; i < data.length; i++) {
            //obtenemos el atributo count del objeto
            count = data[i].count
            //enviamos el dato count al arreglo categorieCount
            categorieCount.push(count)
            //obtenemos el atrbuto _id del objeto
            name = data[i]._id
            //enviamos el datp _id al arreglo categorieName
            categorieName.push(name)
        }

        //declaramos una constante donde ubicaremos al canvas 
        const PRODUCT_CATEGORIE = document.getElementById('categorieProducts')

        //generamos el chart
        new Chart(PRODUCT_CATEGORIE, {
            type: 'pie',
            data: {
                //enviamos el arreglo categorieName que llenamos con el for
                labels: categorieName,
                datasets: [{
                    label: 'Cantidad de Productos por Categoria',
                    //enviamos el arreglo categorieCount que llenamos con el for
                    data: categorieCount,
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        })
    })
})

const BUSCAR_CATEGORIA = document.getElementById('btn-buscap')

BUSCAR_CATEGORIA.addEventListener('submit', function (e) {
    e.preventDefault()

    //Almacenamos los datos del buscador
    const PARAM = document.getElementById('producto-categoria').value

    //Validamos la existencia de los datos
    if (!PARAM.trim()) {
        //Si no hay datos en el buscador se envía una alerta
        Swal.fire({
            icon: 'Error',
            title: '¡Error!',
            text: 'No se permiten campos vacíos',
        })
    } else {
        //Vaciamos el canvas para volver a generar un nuevo gráfico
        document.getElementById('canvas-container').innerHTML = ''

        //Se utiliza axios para obtener la información de la API
        axios.get('http://localhost:443/categorieTop/api/products/' + PARAM).then(function (data) {
            //Almacenamos los datos de la API en una variable
            let obj = data.data
            if (!obj.length) {
                document.getElementById('canvas-container').innerHTML = `<div class="alert alert-warning" role="alert">
                Esta categoría no existe
              </div>`
            } else {
                //Creamos un nuevo canvas
                document.getElementById('canvas-container').innerHTML = '<canvas id="productCategorie"></canvas>'

                //Creamos arreglos para almacenar los estados y el número de pedidos
                let product = [], price = []

                //Creamos variables para almacenar el dato recorrido en el for
                let productName, productPrice

                //Utilizamos un for para recorrer en los datos del objeto
                for (let i = 0; i < obj.length; i++) {
                    //Almacenamos el estado de la posición i dentro de una variable
                    productName = obj[i]._id

                    //Enviamos el dato del estado al arreglo
                    product.push(productName)

                    //Almacenamos la cantidad de productos en la posición i en una variable
                    productPrice = obj[i].maxPrice

                    //Enviamos la cantidad de productos al arreglo
                    price.push(productPrice)
                }

                const CATEGORIE_PRODUCT = document.getElementById('productCategorie')

                //Creamos el gráfico chart.js
                new Chart(CATEGORIE_PRODUCT, {
                    type: 'polarArea',
                    data: {
                        //Enviamos el arreglo categorieName que llenamos con el for
                        labels: product,
                        datasets: [{
                            //Le damos un titulo al grafico
                            label: 'Precio del producto: ',
                            //Enviamos el arreglo orderCount que llenamos con el for
                            data: price,
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                })
            }
        })
    }
})

const FORM_PRODUCT = document.getElementById('form-product')

FORM_PRODUCT.addEventListener('submit', (e) => {
    e.preventDefault()

    const PRODUCT = document.getElementById('product').value
    const PRICE = document.getElementById('price').value
    const CATEGORY = document.getElementById('categorie').value
    const STOCK = document.getElementById('stock').value
    const IMAGE = document.getElementById('image').value

    axios.post('http://localhost:443/api/products', {
        product: PRODUCT,
        price: PRICE,
        categorie: CATEGORY,
        image: IMAGE,
        stock: STOCK
    }, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': localStorage.getItem('token')
        }
    }).then((data) => {
        switch (data.data) {
            case true:
                Swal.fire({
                    icon: 'success',
                    title: 'Proceso Exitoso',
                    text: 'Se ha creado la categoria exitosamente'
                }).then(() => {
                    //redirigimos a la pagina para visualizar los cambios
                    location.href = '/products'
                })
                break
            case false:
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Error de conexion'
                })
                break
            case 'empty':
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'No se permiten campos vacios'
                })
                break
            case 'format':
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'La imagen no es de un formato valido (.png, .jpg, .jpeg)'
                })
                break
            case 'price':
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'El precio no puede ser menor que 0'
                })
                break
            case 'stock':
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'El stock no puede ser menor que 0'
                })
                break
            case 'compare':
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'No se permiten productos repetidos'
                })
                break
        }
    })
})

const UPDATE_PRODUCT = document.getElementById('update-product')

UPDATE_PRODUCT.addEventListener('submit', (e) => {
    e.preventDefault()

    const PRODUCT = document.getElementById('product-update').value
    const PRICE = document.getElementById('price-update').value
    const CATEGORY = document.getElementById('categorie-update').value
    const STATUS = document.getElementById('status-update').value
    const ID = document.getElementById('id-product').value

    axios.post('http://localhost:443/update/products/', {
        product: PRODUCT,
        price: PRICE,
        categorie: CATEGORY,
        status: STATUS,
        id: ID
    }, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': localStorage.getItem('token')
        }
    }).then((data) => {
        switch (data.data) {
            case true:
                Swal.fire({
                    icon: 'success',
                    title: 'Proceso Exitoso',
                    text: 'Se ha creado la categoria exitosamente'
                }).then(() => {
                    //redirigimos a la pagina para visualizar los cambios
                    location.href = '/products'
                })
                break
            case false:
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Error de conexion'
                })
                break
            case 'empty':
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'No se permiten campos vacios'
                })
                break
            case 'price':
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'El precio no puede ser menor que 0'
                })
                break
            case 'compare':
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'No se permiten productos repetidos'
                })
                break
        }
    })
})


function deleteProducts(_id) {
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
            axios.get('http://localhost:443/delete/products/' + _id, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': localStorage.getItem('token')
                }
            }).then((data) => {
                switch (data.data) {
                    case true:
                        Swal.fire({
                            icon: 'success',
                            title: 'Proceso Exitoso',
                            text: 'Se ha eliminado el producto exitosamente'
                        }).then(() => {
                            //redirigimos a la pagina para visualizar los cambios
                            location.href = '/products'
                        })
                        break
                    case false:
                        Swal.fire({
                            icon: 'error',
                            title: 'Ooops..',
                            text: 'No se puedo encontrar al producto'
                        })
                        break
                }
            })
        }
    })
}