const MSJ = document.getElementById('mensaje').value
const ICON = document.getElementById('icon').value
const CONFIRMATION = document.getElementById('confirmation').value

document.addEventListener("DOMContentLoaded", function (event) {
    console.log(CONFIRMATION)
    if (CONFIRMATION == 'true') {
        Swal.fire({
            icon: ICON,
            text: MSJ
          })
    }
});