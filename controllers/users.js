document.addEventListener("DOMContentLoaded", function (event) {
    //Se ocupa axios para obtener la informacion de la api
    axios.get('http://localhost:443/api/count/users').then(function (users) {
        //declaramos la variables que ocuparemos
        //almacenamos los datos de la api en la variable data
        let data = users.data, statusName = [], usersCount = [], user, status

        //navegamos con un for dentro del objeto data
        for (let i = 0; i < data.length; i++) {
            //obtenemos el atributo count del objeto
            user = data[i].count
            //enviamos el dato count al arreglo categorieCount
            usersCount.push(user)
            //obtenemos el atrbuto _id del objeto
            status = data[i]._id
            //enviamos el datp _id al arreglo categorieName
            statusName.push(status)
        }   

        console.log(usersCount)

        //declaramos una constante donde ubicaremos al canvas 
        const USER_STATUS = document.getElementById('statusUser')

        //generamos el chart
        new Chart(USER_STATUS, {
            type: 'bar',
            data: {
                //enviamos el arreglo categorieName que llenamos con el for
                labels: statusName,
                datasets: [{
                    label: 'Cantidad de usuarios por estado',
                    //enviamos el arreglo categorieCount que llenamos con el for
                    data: usersCount,
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