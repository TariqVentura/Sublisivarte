document.addEventListener("DOMContentLoaded", function (event) {
    // se ocupa axios para obtener la informacion de la api
    axios.get('http://localhost:443/api/count/orders').then(function (orders) {
        //declaramos la variables que ocuparemos
        //alamcenamos los datos de la api en la variable data
        let data = orders.data, statusName = [], orderCount = [], order, status

        //navegamos con un for dentro del objeto data
        for (let i = 0; i < data.length; i++) {
            //obtenemos el atributo count del objeto
            order = data[i].count
            //enviamos el dato count al arreglo categorieCount
            orderCount.push(order)
            //obtenemos el atrbuto _id del objeto
            status = data[i]._id
            //enviamos el datp _id al arreglo categorieName
            statusName.push(status)
        }   

        console.log(orderCount)

        //declaramos una constante donde ubicaremos al canvas 
        const ORDER_STATUS = document.getElementById('statusOrder')

        //generamos el chart
        new Chart(ORDER_STATUS, {
            type: 'bar',
            data: {
                //enviamos el arreglo categorieName que llenamos con el for
                labels: statusName,
                datasets: [{
                    label: 'Cantidad de Ordenes por estado',
                    //enviamos el arreglo categorieCount que llenamos con el for
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
