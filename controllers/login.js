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

    let user = document.getElementById('user').value
    let password = document.getElementById('password').value

    axios.post('http://localhost:443/logIn/users', {
        user: user,
        passowrd: password
    }, {
        //definimos que utlizaremos body url encoded
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then(data => {
        switch (data.data) {
            case true:
                Toast.fire({
                    icon: 'success',
                    title: 'Signed in successfully'
                }).then(() => {
                    location.href = '/'
                })
                break;

            case false:
                Toast.fire({
                    icon: 'error',
                    title: 'Contraseña o usuario incorrectos'
                })
                break;

            case 'session':
                Toast.fire({
                    icon: 'error',
                    title: 'Ya existe una sesión activo'
                })
                break;
        }
    })
})