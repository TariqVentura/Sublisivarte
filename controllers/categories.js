//llamamos al formulario
const NEW_CATEGORY = document.getElementById('new-category')

//funcion para enviar los datos a la api de categorias
NEW_CATEGORY.addEventListener('submit', async (e) => {
    //evitamos el proceso default
    e.preventDefault()

    //capturamos los valores del formulario
    let category = document.getElementById('category').value
    let status = document.getElementById('inputGroupSelect01').value

    //utilizamos la libreria de axios para enviar los datos a la api
    axios.post('http://localhost:443/api/categories', {
        categorie: category,
        status: status
    }, {
        //definimos que utlizaremos body url encoded
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then(data => {
        //validamos si los datos son validos y si se han ingresado en la based para luego mostrar la alerta correspondiente
        if (data.data == true) {
            Swal.fire({
                icon: 'success',
                title: 'Proceso Exitoso',
                text: 'Se ha creado la categoria exitosamente'
            }).then(() => {
                //redirigimos a la pagina para visualizar los cambios
                location.href = '/categorias'
            })
            
        } else if (data.data == true) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No se permiten campos vacios'
            })
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No se permiten valores repetidos'
            })
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