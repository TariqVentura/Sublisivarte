//se llama a dotenv para poder usar las variables de entorno
require('dotenv').config()
/**
 * Se declaran las constantes de las dependencias que utilizaremos para manejar el servidor 
 * Las constantes se escriben en mayusculas y en casa de ser dos palabras se utiliza el guion bajo (_) como separador
 */
const EXPRESS = require('express')
const CORS = require('cors')
const CONNECTION = require('./config/connection')
const LAYOUTS = require('express-ejs-layouts')
const MORGAN = require('morgan')
const BODY_PARSER = require('body-parser')
const PATH = require('path')
const HTTP = require('http')
const SESSION = require('express-session')

/**
 * Se inicia la constante APP utilizando cors 
 * cors es un middleware que crea la conexion con express
 * express es un framework que ayuda con el manejo de las APIs utilizado en NodeJS 
 */
const APP = EXPRESS()
APP.use(CORS())

//creamos nuestro servidor mediante el protocolo HTTP
const SERVER = HTTP.createServer(APP)

/**
 * Se le dice a la APP que utilize el motor de plantillas ejs 
 * La APP obtiene la direccion de la carpeta 'views' donde buscara los archivos con extencion .ejs
 */
APP.set('view engine', 'ejs')
APP.set('views', __dirname + 'views')

/**
 * Se le provee un puerto a la APP
 * Buscara 'PORT' en las variables de entorno y tomara ese valor
 * En caso de no encontrarlo se le dara el valor de '444' como puerto
 */
APP.set('port', process.env.PORT || 444)

//Iniciamos la conexion con la base de datos
CONNECTION()

/**
 * Se crea la sesion del usuario haciendo uso las cookies
 * Utilizamos la constante SESSION que declaramos al principio 
 * Guardamos las session que hayan iniciado unicamente
 * Le definimos un tiempo de vida a la session
 */
APP.use(SESSION({
    key: 'user',
    secret: 'zymuxtDKz4VcGMpx',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 180 * 60 * 1000 }
}))

//declaramos el middleware de morgan que ayuda con los request de loggeo a la aplicacion
APP.use(MORGAN('tiny'))

//BODY_PARSER es un middleware que nos permite manejar los req.body de la aplicacion
APP.use(BODY_PARSER.urlencoded({ extended: true }))

/**
 * Le damos a la APP las rutas de las carpetas 'controllers' y 'resoruces'
 * la carpeta 'controllers' almacena los archivos JS del frontend
 * la carpeta 'resources' alamcena los archivos CSS y las imagenes
 */
APP.use(EXPRESS.static(__dirname + '/controllers'))
APP.use(EXPRESS.static(__dirname + '/resources'))

//nos permite manejar los resultados de los request de la pagina
APP.use(EXPRESS.urlencoded({ extended: true }))

//definimos el formato JSON
APP.use(EXPRESS(JSON))

//le decimos a la APP que utilize los layouts de ejs mediante express
APP.use(LAYOUTS)

//Se le dice a la APP que utilize el archivo routes para las direcciones de la aplicacion
APP.use('/', require('./router'))

//Se utiliza el archivo app para las configuraciones del servidor
APP.use(EXPRESS.static(PATH.join(__dirname, 'app')))

//Le decimos al servidor que escuche el puerto de la APP 
SERVER.listen(APP.get('port'), () => {
    console.log(process.env.PORT)
})