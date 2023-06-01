/**
 * Se declaran las constantes de las dependencias de node y de los controladores
 * Las constantes se escriben en mayusculas y en casa de ser dos palabras se utiliza el guion bajo (_) como separado
 */
const EXPRESS = require('express') 
const ROUTER = EXPRESS.Router()
const RENDER = require('./services/render')
const USERS = require('./api/users')

/**
 * Se ocupa el metodo get para que al momento de que se envie a 
 * la direccion con una '/' ocupe el service para renderizar 
 * la informacion
 */
ROUTER.get('/', RENDER.index)

//API images

//API users
ROUTER.post('/api/users', USERS.createUser)

/**
 * Exportamos el router para que puedo ser accesido por el servidor
 */
module.exports = ROUTER