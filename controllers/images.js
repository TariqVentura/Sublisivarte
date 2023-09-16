const FORM_IMAGE = document.getElementById('form-image')

FORM_IMAGE.addEventListener('submit', (e) => {
    e.preventDefault()

    const IMAGE = document.getElementById('image').value

    axios.post('http://localhost:443/api/images', {
        image: IMAGE
    }, {
        //definimos que utlizaremos body url encoded y enviamos el token 
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': localStorage.getItem('token')
        }
    }).then((data) => {
        switch (data.data) {
            case true:
                Swal.fire({
                    icon: 'success',
                    title: 'Proceso Exitoso',
                    text: 'Se ha añadido la imagen al carousel'
                }).then(() => {
                    //redirigimos a la pagina para visualizar los cambios
                    location.href = '/'
                })
                break
            case false:
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Error de conexion'
                })
                break
            case 'empty':
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'No se permiten campos vacios'
                })
                break
            case 'format':
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'La imagen no es de un formato valido (.png, .jpg, .jpeg)'
                })
                break
        }
    })
})