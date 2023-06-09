const msj = document.getElementById('mensaje').value
const icon = document.getElementById('icon').value
const confirmation = document.getElementById('confirmation').value

document.addEventListener("DOMContentLoaded", function (event) {
    console.log(confirmation)
    if (confirmation == 'true') {
        Swal.fire({
            icon: icon,
            text: msj
          })
    }
});