let imageURL = document.getElementById('imageURL')
let canvas = document.getElementById("myCanvas")
let ctx = canvas.getContext("2d")
let design = document.getElementById('btn-design')

imageURL.addEventListener('change', function () {
    let image = new Image()
    image.src = "/images/" + document.getElementById('imageURL').files[0].name
    let imageX = 0
    let imageY = 0

    image.onload = function () {
        ctx.drawImage(image, 0, 0, 100, 75)

        function handleMouseDown(e) {
            let mouseX = e.clientX - canvas.offsetLeft;
            let mouseY = e.clientY - canvas.offsetTop;

            if (mouseX >= imageX && mouseX <= imageX + image.width &&
                mouseY >= imageY && mouseY <= imageY + image.height) {
                canvas.addEventListener("mousemove", handleMouseMove)
                canvas.addEventListener("mouseup", handleMouseUp)
            }
        }

        function handleMouseMove(e) {
            let mouseX = e.clientX - canvas.offsetLeft
            let mouseY = e.clientY - canvas.offsetTop

            imageX = mouseX - image.width / 2
            imageY = mouseY - image.height / 2

            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.drawImage(image, imageX, imageY, 100, 75)
        }

        function handleMouseUp() {
            canvas.removeEventListener("mousemove", handleMouseMove)
            canvas.removeEventListener("mouseup", handleMouseUp)
        }

        canvas.addEventListener("mousedown", handleMouseDown)
    }

})

design.addEventListener('click', function () {
    let imageDataURL = canvas.toDataURL()
    const URL = document.createElement('a')
    URL.download = "DiseñoSublisilette.png"
    URL.href = imageDataURL
    URL.click()
})

