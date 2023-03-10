const carousel = document.querySelector('.carousel')
firstImage = carousel.querySelectorAll('img')[0]
arrowIcon = document.querySelectorAll('.wrapper-carousel i')
 
let isDragStart = false, isDragging = false, prevPageX, prevScroleft, positionDiff
let firstImageWidth = firstImage.clientWidth + 14
let scrollWidth = carousel.scrollWidth - carousel.clientWidth

const showHiddenIcons = () => {
    arrowIcon[0].style.display = carousel.scrollLeft == 0 ? 'none' : 'block'
    arrowIcon[1].style.display = carousel.scrollLeft == scrollWidth ? 'none' : 'block'
}

arrowIcon.forEach(icon => {
    icon.addEventListener('click', () => {
        carousel.scrollLeft += icon.id == 'left' ? -firstImageWidth : firstImageWidth
        showHiddenIcons()
        setTimeout(() => showHiddenIcons(), 60)
    })
})

const autoSlide = () => {
    if (carousel.scrollLeft == (carousel.scrollWidth - carousel.clientWidth)) return

    positionDiff = Math.abs(positionDiff)
    let valDifference = firstImageWidth - positionDiff
    if (carousel.scrollLeft > prevScroleft) {
        return carousel.scrollLeft += positionDiff > firstImageWidth / 3 ? valDifference: positionDiff
    }
    carousel.scrollLeft -= positionDiff > firstImageWidth / 3 ? valDifference: positionDiff
}

const dragStart = (e) => {
    isDragStart = true
    prevPageX = e.pageX || e.touches[0].pageX
    prevScroleft = carousel.scrollLeft
}

const draggin = (e) => {
    if(!isDragStart) return;
    e.preventDefault()
    isDragging = true
    carousel.classList.add('dragging')
    positionDiff = (e.pageX || e.touches[0].pageX) - prevPageX
    carousel.scrollLeft = prevScroleft - positionDiff
    showHiddenIcons()
}

const dragStop = () => {
    isDragStart = false
    carousel.classList.remove('dragging')

    if (!isDragging)return 
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