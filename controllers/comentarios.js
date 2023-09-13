
const BUSCAR_COMENTARIO = document.getElementById('btn-buscar')

BUSCAR_COMENTARIO.addEventListener('click', function () {
    //almacenamos los datos del buscador
    const PARAM = document.getElementById('producto-comentario').value

    //validamos la existencia de datos
    if (!PARAM.trim()) {
        //sino hay datos en el buscador se envia una alerta
        Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'No se permiten campos vacios',
        })
    } else {
        //vaciamos el canvas
        document.getElementById('container-canvas').innerHTML = ''

        //creamos el canvas
        document.getElementById('container-canvas').innerHTML = '<canvas id="productComment"></canvas>'

        //Se utiliza axios para obtener la informacion de la api
        axios.get('http://localhost:443/api/count/comments/' + PARAM).then(function (data) {
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

            const COMMENT_PRODUCT = document.getElementById('productComment')

            //Creamo el grafico chart.js
            new Chart(COMMENT_PRODUCT, {
                type: 'bar',
                data: {
                    //Enviamos el arreglo categorieName que llenamos con el for
                    labels: status,
                    datasets: [{
                        //Le damos un titulo al grafico
                        label: 'Cantidad de comentarios de un producto',
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
    }
})

function confirmDelete (_id) {
    Swal.fire({
        title: 'Esta seguro?',
        text: "Desea cambiar el estado de esta categoria a " + status,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            //utilizamos axios para ejecutar la peticion
            deleteComments(_id)
        }
    })
}

function deleteComments (_id) {
    console.log(_id)
    axios.get('http://localhost:443/delete/comments/' + _id, {
        //definimos que utlizaremos body url encoded y enviamos el token 
        headers: {
            'Authorization': localStorage.getItem('token')
        }
    }).then((data) => {
        switch (data.data) {
            case true:
                Swal.fire({
                    icon: 'success',
                    title: 'Proceso completado',
                    text: 'Se ha eliminado el comentario exitosamente'
                }).then(() => {
                    location.href = '/comentarios'
                })
                break
            case false:
                Swal.fire({
                    icon: 'error',
                    title: 'Ooops...',
                    text: 'Error en la base datos'
                })
                break
            case 'empty':
                Swal.fire({
                    icon: 'error',
                    title: 'Ooops...',
                    text: 'No se permiten campos vacios'
                })
                break
        }
    })
}