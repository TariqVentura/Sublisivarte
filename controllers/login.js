//obetenemos el formulario
const LOGIN = document.getElementById('login')

//escuchamos el evento submit
LOGIN.addEventListener('submit', (e) => {
    //evitamos que se recargue el formulario
    e.preventDefault()

    //creamos un Toas de SweetAlerts
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })

    //obtenemos los datos del formulario
    let user = document.getElementById('username').value
    let password = document.getElementById('password').value

    //utilizamos axios para enviar la peticion a la API
    axios.post('http://localhost:443/logIn/users', {
        user: user,
        password: password
    }, {
        //definimos que utlizaremos body url encoded
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then(data => {
        //validamos con un switch las respuestas de la API
        switch (data.data) {
            case false:
                Toast.fire({
                    icon: 'error',
                    title: 'Contraseña o usuario incorrectos'
                })
                break

            case 'session':
                Toast.fire({
                    icon: 'error',
                    title: 'Ya existe una sesión activo'
                })
                break
            case 'empty':
                Toast.fire({
                    icon: 'error',
                    title: 'No se permiten campos vacios'
                })
                break
            case 'inactivo':
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Su cuenta ha sido desactivo por sobrepasar el numero de intentos permitidos'
                })
                break
            case 'expired':
                
                break
            default:
                Swal.fire({
                    icon: 'success',
                    title: 'Inicio de sesión exitoso',
                    text: 'Acceso permtiido'
                }).then(() => {
                    //redirigimos a la pagina para visualizar los cambios
                    localStorage.setItem('token', data.data)
                    location.href = '/'
                })
                break
        }
    })
})