const NEW_CATEGORY = document.getElementById('new-category')

NEW_CATEGORY.addEventListener('submit', async (e) => {
    e.preventDefault()

    let category = document.getElementById('category').value
    let status = document.getElementById('inputGroupSelect01').value

    axios.post('http://localhost:443/api/categories', {
        categorie: category,
        status: status
    }, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then(data => {
        console.log(data)
        if (data.data == true) {
            Swal.fire({
                icon: 'success',
                title: 'Proceso Exitoso',
                text: 'Se ha creado la categoria exitosamente'
            }).then(() => {
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
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error en la base de datos'
        })
    })
})