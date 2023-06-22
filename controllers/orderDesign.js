var imageURL = document.getElementById('imageURL')
var canvas = document.getElementById("myCanvas")
var ctx = canvas.getContext("2d")

imageURL.addEventListener('change', function () {
    var image = new Image()
    image.src = "/images/" + document.getElementById('imageURL').files[0].name
    var imageX = 0
    var imageY = 0

    image.onload = function () {
        ctx.drawImage(image, 0, 0, 100, 75)

        function handleMouseDown(e) {
            var mouseX = e.clientX - canvas.offsetLeft;
            var mouseY = e.clientY - canvas.offsetTop;

            if (mouseX >= imageX && mouseX <= imageX + image.width &&
                mouseY >= imageY && mouseY <= imageY + image.height) {
                canvas.addEventListener("mousemove", handleMouseMove)
                canvas.addEventListener("mouseup", handleMouseUp)
            }
        }

        function handleMouseMove(e) {
            var mouseX = e.clientX - canvas.offsetLeft
            var mouseY = e.clientY - canvas.offsetTop

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