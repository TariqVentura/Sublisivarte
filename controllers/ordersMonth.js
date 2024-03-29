document.addEventListener("DOMContentLoaded", function (event) {
    //Se utiliza axios para obtener la informacion de la api
    axios.get('http://localhost:443/api/count/ordersMonth').then(function (orders) {
        //Declaramos la variables que utilizaremos
        //Almacenamos los datos de la api en una variable data
        let data = orders.data, statusName = [], ordersCount = [], order, status

        //Navegamos con un for dentro del objeto data
        for (let i = 0; i < data.length; i++) {
            //Obtenemos el atributo count del objeto
            order = data[i].count
            //Enviamos el dato count al arreglo orderCount
            ordersCount.push(order)
            //Obtenemos el atrbuto _id del objeto
            status = data[i]._id
            //Enviamos el dato _id al arreglo statusName
            statusName.push(status)
        }

        console.log(ordersCount)

        //Declaramos una constante donde ubicaremos el canvas 
        const ORDERS_MONTH = document.getElementById('monthOrder')

        //Creamo el grafico chart.js
        new Chart(ORDERS_MONTH, {
            type: 'bar',
            data: {
                //Enviamos el arreglo categorieName que llenamos con el for
                labels: statusName,
                datasets: [{
                    //Le damos un titulo al grafico
                    label: 'Cantidad de ordenes por estado',
                    //Enviamos el arreglo orderCount que llenamos con el for
                    data: ordersCount,
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

BUSCAR_ORDEN.addEventListener('click', function () {
    //almacenamos los datos del buscador
    const PARAM = document.getElementById('cliente-pedido').value

        //vaciamos el canvas
        document.getElementById('container-canvas').innerHTML = ''

        //creamos el canvas
        document.getElementById('container-canvas').innerHTML = '<canvas id="clientOrder"></canvas>'

        //Se utiliza axios para obtener la informacion de la api
        axios.get('http://localhost:443/api/count/orders/' + PARAM).then(function (data) {
            //Almacenamos los datos de la api en una variable
            let obj = data.data

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
                type: 'line',
                data: {
                    //Enviamos el arreglo categorieName que llenamos con el for
                    labels: status,
                    datasets: [{
                        //Le damos un titulo al grafico
                        label: 'Cantidad de pedidos por estado',
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
        })
    })