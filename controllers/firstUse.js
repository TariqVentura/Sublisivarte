const FORM_USER = document.getElementById('form-user')

FORM_USER.addEventListener('submit', (e) => {
    e.preventDefault()

    let name, lastname, email, user, doc, password, confirm, role

    name = document.getElementById('name').value
    lastname = document.getElementById('lastname').value
    email = document.getElementById('mail').value
    user = document.getElementById('username-account').value
    doc = document.getElementById('documento').value
    password = document.getElementById('password-account').value
    confirm = document.getElementById('confirm').value
    role = document.getElementById('role').value

    axios.post('http://localhost:443/api/users', {
        name: name,
        lastname: lastname,
        email: email,
        user: user,
        document: doc,
        password: password,
        confirm: confirm,
        role: role
    }, {
        //definimos que utlizaremos body url encoded
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then(data => {
        switch (data.data) {
            case true:
                Swal.fire({
                    icon: 'success',
                    title: 'Proceso Exitoso',
                    text: 'Se ha creado el usuario exitosamente'
                }).then(() => {
                    //redirigimos a la pagina para visualizar los cambios
                    location.href = '/'
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
            case 'invalid':
                //contraseña invalida
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'La contraseña no cumple con los parametros de seguridad'
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
            case 'user':
                //campos vacios
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Este usuario esta un uso'
                })
                break
            case 'email':
                //campos vacios
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Este correo esta en uso'
                })
                break
            case 'coincidencia':
                //campos vacios
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Las contraseñas no coinciden'
                })
                break
            default:
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