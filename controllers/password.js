const FORM = document.getElementById('form')

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