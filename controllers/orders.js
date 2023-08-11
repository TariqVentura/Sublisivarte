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
        });
    })
})
