//obtenemos el formulario
const FORM_USER = document.getElementById('form-user')

//escuchamos el evento submit
FORM_USER.addEventListener('submit', (e) => {
    //evitamos que se recargue le formulario
    e.preventDefault()

    //declaramos las varibales a utilizar
    let name, lastname, email, user, doc, password, confirm

    //asignamos valores
    name = document.getElementById('name').value
    lastname = document.getElementById('lastname').value
    email = document.getElementById('mail').value
    doc = document.getElementById('documento').value
    user = document.getElementById('username-account').value
    password = document.getElementById('password-account').value
    confirm = document.getElementById('password-account-confirm').value

    //axios envia la peticion a la API
    axios.post('http://localhost:443/api/users', {
        name: name,
        lastname: lastname,
        email: email,
        user: user,
        password: password,
        document: doc,
        confirm: confirm
    }, {
        //definimos que utlizaremos body url encoded
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then(data => {
        //switch valida la respuesta de la API
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