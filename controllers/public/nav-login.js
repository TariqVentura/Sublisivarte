


const header = document.querySelector('header')
const logo_img = document.querySelector('.logo-img')

header.innerHTML = `
        <a href="" class="logo"><img src="../../resources/images/logo.png" alt="" class="logo-img"></a>
        <nav class="navegation">
            <a href="#">Inicio</a>
            <a href="#">Sobre nosotros</a>
            <a href="#">Servicios</a>
            <a href="#">Contactos</a>
            <button class="btnLogin-popup" id="btn-login">Login</button>
        </nav>
        <div class="overlay">
            <div class="popup">
                <div class="wrapper">
                    <span class="icon-close" id="btn-close-login">
                        <ion-icon name="close"></ion-icon>
                    </span>
                    <div class="form-box login">
                        <h2>Login</h2>
                        <form action="">
                            <div class="imput-box">
                                <span class="icon"><ion-icon name="mail"></ion-icon></span>
                                <input type="email" required>
                                <label for="">Email</label>
                            </div>
                            <div class="imput-box">
                                <span class="icon"><ion-icon name="lock-closed"></ion-icon></span>
                                <input type="password" required>
                                <label for="">Contraseña</label>
                            </div>
                            <div class="remember-forgot">
                                <label for=""><input type="checkbox"> Recordarme</label>
                                <a href="#">Olvidé mi contraseña</a>
                            </div>
                            <button type="submit" class="btn">Login</button>
                            <div class="login-register">
                                <p>¿No tienes una cuenta? <a href="#" class="register-link">Registrarme</a></p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;

var overlay = document.querySelector('.overlay')
window.document.getElementById('btn-login').addEventListener('click', function () {
    overlay.classList.add('active')
})

var btn_close = document.getElementById('btn-close-login')
btn_close.addEventListener('click', function () {
    overlay.classList.remove('active')
})

var nav = document.getElementById('nav-info')

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