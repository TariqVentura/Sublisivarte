//obtenemos el formualrio
const FORM_USER = document.getElementById('form-user')

//escuchamos evento submit
FORM_USER.addEventListener('submit', (e) => {
    //evitamos que se recargue el formulario
    e.preventDefault()

    //declaramos variables
    let name, lastname, email, user, doc, role, password

    //capturamos datos
    name = document.getElementById('name').value
    lastname = document.getElementById('lastname').value
    email = document.getElementById('email').value
    user = document.getElementById('username').value
    doc = document.getElementById('document').value
    role = document.getElementById('role').value
    password = document.getElementById('password').value
    confirm = document.getElementById('confirm').value

    //enviamos la peticion con axios
    axios.post('http://localhost:443/api/users', {
        name: name,
        lastname: lastname,
        email: email,
        user: user,
        password: password,
        document: doc,
        role: role,
        confirm: confirm
    }, {
        //definimos que utlizaremos body url encoded
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then(data => {
        //utilizamos switch para validar la respuesta de la API
        switch (data.data) {
            case true:
                Swal.fire({
                    icon: 'success',
                    title: 'Proceso Exitoso',
                    text: 'Se ha creado el usuario exitosamente'
                }).then(() => {
                    //redirigimos a la pagina para visualizar los cambios
                    location.href = '/usuarios'
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
                //usuario invalido
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

function bulkInsert() {
    Swal.fire({
        title: 'Crea tu pedido',
        html:
            '<label for="file-user">Documento: </label>' +
            `<input type="file" class="form-control" id="file-user" required>`
        ,
        focusConfirm: false,
        preConfirm: () => {

            const FILE = document.getElementById('file-user').value

            if (!FILE) {
                Swal.showValidationMessage('No se permiten campos vacios')
            }

            return { file: FILE }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            axios.post('http://localhost:443/api/bulk/users', {
                file: result.value.file
            }, {
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
                            text: 'Se han añadido los usuarios exitosamente'
                        }).then(() => {
                            //redirigimos a la pagina para visualizar los cambios
                            location.href = '/usuarios'
                        })
                        break
                    case false:
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Error en la base de datos'
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
                            text: 'El formato del archivo debe ser de tipo JSON'
                        })
                        break
                    case 'file':
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Archivo no encontrado o es inaccesible'
                        })
                        break
                }
            })
        }
    })
}

document.addEventListener("DOMContentLoaded", (event) => {
    //Se ocupa axios para obtener la informacion de la api
    axios.get('http://localhost:443/api/count/users').then(function (users) {
        //declaramos la variables que ocuparemos
        //almacenamos los datos de la api en la variable data
        let data = users.data, statusName = [], usersCount = [], user, status

        //navegamos con un for dentro del objeto data
        for (let i = 0; i < data.length; i++) {
            //obtenemos el atributo count del objeto
            user = data[i].count
            //enviamos el dato count al arreglo categorieCount
            usersCount.push(user)
            //obtenemos el atrbuto _id del objeto
            status = data[i]._id
            //enviamos el datp _id al arreglo categorieName
            statusName.push(status)
        }

        //declaramos una constante donde ubicaremos al canvas 
        const USER_STATUS = document.getElementById('statusUser')

        //generamos el chart
        new Chart(USER_STATUS, {
            type: 'bar',
            data: {
                //enviamos el arreglo categorieName que llenamos con el for
                labels: statusName,
                datasets: [{
                    label: 'Cantidad de usuarios por estado',
                    //enviamos el arreglo categorieCount que llenamos con el for
                    data: usersCount,
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
})

