var overlay = document.querySelector('.overlay')
var btn_login = document.getElementById('btn-login')
var btn_close = document.getElementById('btn-close-login')
const header = document.querySelector('header')
const logo_img = document.querySelector('.logo-img')

btn_login.addEventListener('click', function () {
    overlay.classList.add('active')
})

btn_close.addEventListener('click', function () {
    overlay.classList.remove('active')
})

window.onscroll = function () {
    var y = window.scrollY
    if (y != 0) {
        header.classList.add('active')
        logo_img.classList.add('active')

    } else {
        header.classList.remove('active')
        logo_img.classList.remove('active')
    }
}

// $(document).ready(function () {
//     header.innerHTML = `
//         <a href="" class="logo"><img src="../resources/images/logo.png" alt="" class="logo-img"></a>
//         <nav class="navegation">
//             <a href="#">Inicio</a>
//             <a href="#">Sobre nosotros</a>
//             <a href="#">Servicios</a>
//             <a href="#">Contactos</a>
//             <button class="btnLogin-popup" id="btn-login">Login</button>
//         </nav>
//         <div class="overlay">
//             <div class="popup">
//                 <div class="wrapper">
//                     <span class="icon-close" id="btn-close-login">
//                         <ion-icon name="close"></ion-icon>
//                     </span>
//                     <div class="form-box login">
//                         <h2>Login</h2>
//                         <form action="">
//                             <div class="imput-box">
//                                 <span class="icon"><ion-icon name="mail"></ion-icon></span>
//                                 <input type="email" required>
//                                 <label for="">Email</label>
//                             </div>
//                             <div class="imput-box">
//                                 <span class="icon"><ion-icon name="lock-closed"></ion-icon></span>
//                                 <input type="password" required>
//                                 <label for="">Contraseña</label>
//                             </div>
//                             <div class="remember-forgot">
//                                 <label for=""><input type="checkbox"> Recordarme</label>
//                                 <a href="#">Olvidé mi contraseña</a>
//                             </div>
//                             <button type="submit" class="btn">Login</button>
//                             <div class="login-register">
//                                 <p>¿No tienes una cuenta? <a href="#" class="register-link">Registrarme</a></p>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     `;
// })

document.addEventListener('DOMContentLoaded', () => {
    header.innerHTML = `
        <a href="" class="logo"><img src="../resources/images/logo.png" alt="" class="logo-img"></a>
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
})

