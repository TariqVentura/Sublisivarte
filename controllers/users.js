document.addEventListener("DOMContentLoaded", function (event) {
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

        console.log(usersCount)

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

function passwordValidator(control) {
    // Esta expresión regular verifica si la contraseña cumple con los requisitos
    const PASSWORD_REGEX = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?!.*\s).{8,}$/
    // Estos son los nombres de usuario que no se permiten en la contraseña
    const FORBIDDEN_USERNAMES = ['usuario', 'nombreusuario', 'admin', 'administrador', '12345678']
    // Esta variable verifica si la contraseña contiene un nombre de usuario no permitido
    const FORBIDDEN = FORBIDDEN_USERNAMES.some(username => control.value.toLowerCase().includes(username.toLowerCase()))
    // Esta variable verifica si la contraseña cumple con la expresión regular
    const VALID = PASSWORD_REGEX.test(control.value)
    // Si la contraseña es válida y no contiene un nombre de usuario no permitido, devuelve null de lo contrario, devuelve un objeto con un mensaje de error
    return VALID && !FORBIDDEN ? null : { 'Contraseña inválida': { value: control.value } }
}

VALIDATE_PASSWORD.addEventListener('submit', function (e) {
    e.preventDefault()
    // Obtiene el control de formulario de la contraseña
    const PASSWORD_CONTROL = document.getElementById('password')
    // Si el valor del control de contraseña está vacío, muestra un mensaje de error
    if (!PASSWORD_CONTROL.value.trim()) {
        Swal.fire({
            icon: 'error',
            title: '¡Error!',
            text: 'No se permiten campos vacÍos'
        })
    } else {
        //Válida la contraseña con la función
        const PASSWORD_VALIDATION = passwordValidator(PASSWORD_CONTROL)
        // Si la contraseña no es válida, muestra un mensaje de error
        if (PASSWORD_VALIDATION) {
            Swal.fire({
                icon: 'error',
                title: '¡Error!',
                text: 'La contraseña no cumple con los requisitos'
            })
        } else {
            // La contraseña cumple con los requisitos
        }
    }
})