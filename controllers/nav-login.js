/* Se crea una constante que mande a llamar al header */
const header = document.querySelector('header')
/* Se crea una constante que mande a llamar al Footer */
const footer = document.querySelector('footer')
const logo_img = document.querySelector('.logo-img')

var overlay = document.querySelector('.overlay')

/* se manda a llamar un boton el cual al escucha el evento click se da al overlay la clase active */
window.document.getElementById('btn-login').addEventListener('click', function () {
    overlay.classList.add('active')
})

/* se manda a llamar un boton el cual al escucha el evento click le quita al overlay la clase active */
var btn_close = document.getElementById('btn-close-login')
btn_close.addEventListener('click', function () {
    overlay.classList.remove('active')
})

var nav = document.getElementById('nav-info')

/* se crea una funcion que al detectar el scroll en la ventana, y si este es mayor a 0 añade la clase active añ header y al nav y cuando sino la remueve */
window.onscroll = function () {
    var y = window.scrollY
    if (y != 0) {
        header.classList.add('active')
        nav.classList.add('active')

    } else {
        header.classList.remove('active')
        nav.classList.remove('active')
    }
}
