


const header = document.querySelector('header')
const footer = document.querySelector('footer')
const logo_img = document.querySelector('.logo-img')

header.innerHTML = `
        <a href="" class="logo mb-0 d-none d-lg-inline-block"><img src="../../resources/images/logo.png" alt="" class="logo-img"></a>
        <nav class="navegation">
            <a href="../public/index.html">Inicio</a>
            <a href="../public/productos.html">Productos</a>
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
                        <form action="#">
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
                                <label for="" class="text-light"><input type="checkbox"> Recordarme</label>
                                <a href="#" class="text-light">Olvidé mi contraseña</a>
                            </div>
                            <button type="submit" class="btn">Login</button>
                            <div class="login-register">
                                <p class="text-light">¿No tienes una cuenta? <a href="../public/cuenta.html" class="register-link text-light">Registrarme</a></p>
                            </div>
                        </form>
                    </div>
                    <div class="form-box registrate">
                        <h2>Registarte</h2>
                        <form action="#">
                            <div class="imput-box">
                                <span class="icon"><ion-icon name="person"></ion-icon></span>
                                <input type="name" required>
                                <label for="">Nombre</label>
                            </div>
                            <div class="imput-box">
                                <span class="icon"><ion-icon name="mail"></ion-icon></span>
                                <input type="email" required>
                                <label for="">Email</label>
                            </div>
                            <div class="imput-box">
                                <span class="icon"><ion-icon name="card-outline"></ion-icon></span>
                                <input type="text" required>
                                <label for="">DUI</label>
                            </div>
                            <div class="imput-box">
                                <span class="icon"><ion-icon name="lock-closed"></ion-icon></span>
                                <input type="password" required>
                                <label for="">Contraseña</label>
                            </div>
                            <div class="remember-forgot">
                                <label for="" class="text-light"><input type="checkbox"> Accepto los terminos y condiciones</label>
                            </div>
                            <button type="submit" class="btn">Registrarme</button>
                            <div class="login-register">
                                <p class="text-light">¿Ya tienes una cuenta? <a href="#" class="login-link text-light">Login</a></p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;

footer.innerHTML = `
<div class="d-flex flex-row justify-content-around" id="footer-content">
    <div class="py-3">
        <p class="fs-4 fw-bold">Sublisivarte</p>
        <p class="fs-6 text-light">Tendencias</p>
        <p class="fs-6 text-light">Productos</p>
        <p class="fs-6 text-light">¿Quienes Somos?</p>
    </div>
    <div class="py-3">
        <p class="fs-4 fw-bold">Tienda</p>
        <p class="fs-6 text-light">Terminos y condiciones</p>
        <p class="fs-6 text-light">Politica de Privacidad</p>
    </div>
    <div class="py-3">
        <p class="fs-4 fw-bold">Ayuda</p>
        <p class="fs-6 text-light">Preguntas frecuentes</p>
        <p class="fs-6 text-light">Diseñador de camisetas</p>
    </div>
    <div class="py-3">
        <p class="fs-4 fw-bold">Contactanos</p>
        <p class="fs-6 text-light">Facebook</p>
        <p class="fs-6 text-light">Instagram</p>
        <p class="fs-6 text-light">Correo</p>
    </div>
</div>
<div>
    <p class="fs-5 fw-bold text-light text-center pt-3">© Copyright 2023-2023 Sublisivarte. Todos los Derechos Reservados - Instituto Tecnico Ricaldone</p>
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