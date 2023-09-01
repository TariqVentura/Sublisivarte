const FORM = document.getElementById('form')
const FORM_P = document.getElementById('form_p')

FORM.addEventListener('submit', function (e) {
    e.preventDefault()
    if (!document.getElementById('user').value.trim() || !document.getElementById('email').value.trim()) {
        Swal.fire({
            icon: 'error',
            title: 'Error...',
            text: 'No se permiten campos vacios'
        })
    } else {
        //axios post
    }
})

FORM_P.addEventListener('submit', function (e) {
    e.preventDefault()
    if (!document.getElementById('password').value.trim() || !document.getElementById('password_confirm').value.trim()) {
        Swal.fire({
            icon: 'error',
            title: 'Error...',
            text: 'No se permiten campos vacios'
        })
    } else if (!document.getElementById('password') != !document.getElementById('password_confirm')){
        Swal.fire({
            icon: 'error',
            title: 'Error...',
            text: 'Las contraseñas no coinciden'
        })
    } else{
        //axios post
    }
})