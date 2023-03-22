function createAccount() {
    Swal.fire({
        title: 'Cuenta creada exitosamente',
        icon: 'success',
        showClass: {
            popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
        }
    })
}

function Pedido() {
    Swal.fire({
        title: 'Pedido realizado exitosamente',
        icon: 'success',
        showClass: {
            popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
        }
    })
}

function confirmacion() {
    Swal.fire({
        icon: 'success',
        text: 'Compra realizada exitosamente',
        footer: '<a href="../public/productos.html">Seguir comprando?</a>',
        background: '#fff8eb',
        color: '#584342',
        button: '#fff8eb'
    })
}