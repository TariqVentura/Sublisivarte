document.addEventListener("DOMContentLoaded", function (event) {

    //Se utiliza axios para obtener la informacion de la api
    axios.get('http://localhost:443/api/count/orders').then(function (orders) {
        //Declaramos la variables que utilizaremos
        //Almacenamos los datos de la api en una variable data
        let data = orders.data, statusName = [], orderCount = [], order, status

        //Navegamos con un for dentro del objeto data
        for (let i = 0; i < data.length; i++) {
            //Obtenemos el atributo count del objeto
            order = data[i].count
            //Enviamos el dato count al arreglo orderCount
            orderCount.push(order)
            //Obtenemos el atrbuto _id del objeto
            status = data[i]._id
            //Enviamos el dato _id al arreglo statusName
            statusName.push(status)
        }

        console.log(orderCount)

        //Declaramos una constante donde ubicaremos el canvas 
        const ORDER_STATUS = document.getElementById('statusOrder')

        //Creamo el grafico chart.js
        new Chart(ORDER_STATUS, {
            type: 'bar',
            data: {
                //Enviamos el arreglo categorieName que llenamos con el for
                labels: statusName,
                datasets: [{
                    //Le damos un titulo al grafico
                    label: 'Cantidad de ordenes por estado',
                    //Enviamos el arreglo orderCount que llenamos con el for
                    data: orderCount,
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

const BUSCAR_ORDEN = document.getElementById('btn-buscar')

BUSCAR_ORDEN.addEventListener('submit', function (e) {
    e.preventDefault()
    //almacenamos los datos del buscador
    const PARAM = document.getElementById('cliente-pedido').value

    //validamos la existencia de datos
    if (!PARAM.trim()) {
        //sino hay datos en el buscador se envia una alerta
        Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'No se permiten campos vacios',
        })
    } else {
        document.getElementById('canvas2').innerHTML = ''

        axios.get('http://localhost:443/api/count/orders/' + PARAM).then(function (data) {
            let obj = data.data
            if (!obj.length) {
                document.getElementById('canvas2').innerHTML = `<div class="alert alert-warning" role="alert">
                No hay pedidos de este cliente
              </div>`
            } else {
                document.getElementById('canvas2').innerHTML = `<canvas id="clientOrder"></canvas>`

                //Creamos arreglos para almacenar los estados y el numero de pedidos
                let status = [], count = []

                //Creamos variables para almacenar el dato recorrido en el for
                let newStatus, newCount

                //utilizamos un for para recorrer en los datos del objeto
                for (let i = 0; i < obj.length; i++) {
                    //alamcenamos el estado de la poscicion i dentro de una variable
                    newStatus = obj[i]._id

                    //enviamos el dato del estado al arreglo
                    status.push(newStatus)

                    //almacenamos la cantidad de pedidos en la posicion i en una variable
                    newCount = obj[i].count

                    //enviamos la cantidad de pedidos al arreglo
                    count.push(newCount)
                }

                const ORDER_CLIENT = document.getElementById('clientOrder')

                //Creamo el grafico chart.js
                new Chart(ORDER_CLIENT, {
                    type: 'bar',
                    data: {
                        //Enviamos el arreglo categorieName que llenamos con el for
                        labels: status,
                        datasets: [{
                            //Le damos un titulo al grafico
                            label: 'Cantidad de pedidos realizados por el cliente ' + PARAM,
                            //Enviamos el arreglo orderCount que llenamos con el for
                            data: count,
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

const BUSCAR_FECHA = document.getElementById('btn-busqueda')

BUSCAR_FECHA.addEventListener('submit', function (e) {
    e.preventDefault()

    let fecha = document.getElementById('fecha').value

    if (!fecha.trim()) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ingrese una fecha!',
        })

    } else {
        document.getElementById('canvas').innerHTML = ''

        axios.get('http://localhost:443/api/count/date/' + fecha).then(function (date) {
            let obj = date.data
            if (!obj.length) {
                document.getElementById('canvas').innerHTML = `<div class="alert alert-warning" role="alert">
                No se realizarón pedidos en esta fecha
              </div>`
            } else {
                let statusArray = [], countArray = []

                let status, count

                for (let i = 0; i < obj.length; i++) {
                    status = obj[i]._id
                    count = obj[i].count

                    statusArray.push(status)
                    countArray.push(count)
                }

                document.getElementById('canvas').innerHTML = '<canvas id="monthOrder"></canvas>'

                const MONTH_ORDER = document.getElementById('monthOrder')

                new Chart(MONTH_ORDER, {
                    type: 'line',
                    data: {
                        //Enviamos el arreglo categorieName que llenamos con el for
                        labels: statusArray,
                        datasets: [{
                            //Le damos un titulo al grafico
                            label: 'Pedidos por dia',
                            //Enviamos el arreglo orderCount que llenamos con el for
                            data: countArray,
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