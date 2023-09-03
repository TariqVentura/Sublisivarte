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