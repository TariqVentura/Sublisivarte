const LOGIN = document.getElementById('login')

LOGIN.addEventListener('submit', (e) => {
    e.preventDefault()

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

    let user = document.getElementById('username').value
    let password = document.getElementById('password').value

    axios.post('http://localhost:443/logIn/users', {
        user: user,
        password: password
    }, {
        //definimos que utlizaremos body url encoded
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then(data => {
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