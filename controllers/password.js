const VALIDATE_PASSWORD = document.getElementById('form_p')

function passwordValidator  (control) {
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

        }
    }
})
