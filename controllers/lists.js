//obtenemos el formulario
const NEW_LIST = document.getElementById('new-list')

//escuchamos el evento submit
NEW_LIST.addEventListener('submit', (e) => {
    //evitamos que se recargue el formulario
    e.preventDefault()

    //otenemos el valor de name 
    let name = document.getElementById('list-name').value

    //utilizamos axios para hacer la peticion a la API
    axios.post('http://localhost:443/api/orders', {
        name: name
    }, {
        //definimos que utlizaremos body url encoded y enviamos el token
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': localStorage.getItem('token')
        }
    }).then(data => {
        //utilizamos switch para validar las respuestas de la API
        switch (data.data) {
            case true:
                Swal.fire({
                    icon: 'success',
                    title: 'Proceso Exitoso',
                    text: 'Se ha creado la lista exitosamente'
                }).then(() => {
                    //redirigimos a la pagina para visualizar los cambios
                    location.href = '/carrito'
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