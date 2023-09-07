const FORM_USER = document.getElementById('form-user')

FORM_USER.addEventListener('submit', (e) => {
    e.preventDefault()

    let name, lastname, email, user, doc, role, password

    name = document.getElementById('name').value
    lastname = document.getElementById('lastname').value
    email = document.getElementById('email').value
    user = document.getElementById('username').value
    doc = document.getElementById('document').value
    role = document.getElementById('role').value
    password = document.getElementById('password').value

    axios.post('http://localhost:443/api/users', {
        name: name,
        lastname: lastname,
        email: email,
        user: user,
        password: password,
        document: doc,
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

