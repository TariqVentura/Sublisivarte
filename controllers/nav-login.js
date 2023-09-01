/* Se crea una variable que mande a llamar al header */
let header = document.querySelector('header')
/* Se crea una variable que mande a llamar al Footer */
let footer = document.querySelector('footer')
let logo_img = document.querySelector('.logo-img')

let overlay = document.querySelector('.overlay')

/* se manda a llamar un boton el cual al escucha el evento click se da al overlay la clase active */
window.document.getElementById('btn-login').addEventListener('click', function () {
    overlay.classList.add('active')
})

/* se manda a llamar un boton el cual al escucha el evento click le quita al overlay la clase active */
let btn_close = document.getElementById('btn-close-login')
btn_close.addEventListener('click', function () {
    overlay.classList.remove('active')
})

let nav = document.getElementById('nav-info')

/* se crea una funcion que al detectar el scroll en la ventana, y si este es mayor a 0 añade la clase active añ header y al nav y cuando sino la remueve */
window.onscroll = function () {
    let y = window.scrollY
    if (y != 0) {
        header.classList.add('active')
        nav.classList.add('active')

    } else {
        header.classList.remove('active')
        nav.classList.remove('active')
    }
}

document.addEventListener('contextmenu', function (e) {
    e.preventDefault()
})

document.addEventListener('DOMContentLoaded', function () {
    let input = document.getElementsByTagName('input')

    for (let index = 0; index < input.length; index++) {
        input[index].setAttribute('autocomplete', 'off')
        input[index].removeAttribute('value')
    }
})

