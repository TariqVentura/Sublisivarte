const carousel = document.querySelector('.carousel')
/** se llama a los objetos img dentro del carousel y se guardan en una arreglo */
firstImage = carousel.querySelectorAll('img')[0]

/** se crea un arreglo con los icon de flechas */
arrowIcon = document.querySelectorAll('.wrapper-carousel i')

let isDragStart = false, isDragging = false, prevPageX, prevScroleft, positionDiff
let firstImageWidth = firstImage.clientWidth + 14
let scrollWidth = carousel.scrollWidth - carousel.clientWidth

/** detecta  si hay mas espacio para hacer scroll en 'X' dependiendo de la respuesta oculta o muestra el icon del '+X' o '-X' segun el arreglo*/
const showHiddenIcons = () => {
    arrowIcon[0].style.display = carousel.scrollLeft == 0 ? 'none' : 'block'
    arrowIcon[1].style.display = carousel.scrollLeft == scrollWidth ? 'none' : 'block'
}

/** por cada icon que encuentre en el arreglo se ejecuta lo siguiente */
arrowIcon.forEach(icon => {
    /** al escuchar el evento click en el icon detecta cual de los icon dentro del arreglo fue precionado mediante un id y en base a eso hace Scroll a '-X' o '+X' */
    icon.addEventListener('click', () => {
        carousel.scrollLeft += icon.id == 'left' ? -firstImageWidth : firstImageWidth
        /** manda a llamar el metodo en para verificar si debe ocultar algun icon */
        showHiddenIcons()
        setTimeout(() => showHiddenIcons(), 60)
    })
})

const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
// const registerLink = document.querySelector('.register-link');
const btnPopup = document.querySelector('.btnLogin-popup');
const iconClose = document.querySelector('.icon-close');


/** al escuchar el evento click añade la clase active */
registerLink.addEventListener('click', () => {
    wrapper.classList.add('active');
})

/** al escuchar el evento click remueve la clase active */
loginLink.addEventListener('click', () => {
    wrapper.classList.remove('active');
})

/** al escuchar el evento click añade la clase active */
btnPopup.addEventListener('click', () => {
    wrapper.classList.add('active-popup');
})

/** al escuchar el evento click remueve la clase active */
iconClose.addEventListener('click', () => {
    wrapper.classList.remove('active-popup');
})

/* al detectar movimiento de scroll centra la imagen en el carousel */
const autoSlide = () => {
    if (carousel.scrollLeft == (carousel.scrollWidth - carousel.clientWidth)) return

    positionDiff = Math.abs(positionDiff)
    let valDifference = firstImageWidth - positionDiff
    if (carousel.scrollLeft > prevScroleft) {
        return carousel.scrollLeft += positionDiff > firstImageWidth / 3 ? valDifference : positionDiff
    }
    carousel.scrollLeft -= positionDiff > firstImageWidth / 3 ? valDifference : positionDiff
}

/** al iniciar el contacto con la imagen se inicio esta funcion */
const dragStart = (e) => {
    isDragStart = true
    prevPageX = e.pageX || e.touches[0].pageX
    prevScroleft = carousel.scrollLeft
}

/** esta funcion se ejecuta mientras se este agarrando el objeto */
const draggin = (e) => {
    if (!isDragStart) return;
    e.preventDefault()
    isDragging = true
    /** si el usuario esta con contacto con la imagen se agrega la clase dragging al carousel */
    carousel.classList.add('dragging')
    /** se calvcula la diferencia de position meidante restando el movimiento actual o el momento 0 del eje 'X' de la pagina menos el anterior movimiento  */
    positionDiff = (e.pageX || e.touches[0].pageX) - prevPageX
    /** se define que el scroll deirigido al eje '+X' sera igual que el scroll previo de '-X' - la diferencia de posicion anterior */
    carousel.scrollLeft = prevScroleft - positionDiff
    showHiddenIcons()
}

/** esta funcion se ejecuta cuando el usuario suelt la imagen */
const dragStop = () => {
    isDragStart = false
    carousel.classList.remove('dragging')

    /** si el usuario ya no esta en contacto con la imagen esta se centra */
    if (!isDragging) return
    isDragging = false
    autoSlide()
}

carousel.addEventListener('mousedown', dragStart)
carousel.addEventListener('mousemove', draggin)
carousel.addEventListener('mouseup', dragStop)
carousel.addEventListener('mouseleave', dragStop)

carousel.addEventListener('touchstart', dragStart)
carousel.addEventListener('touchmove', draggin)
carousel.addEventListener('touchend', dragStop)