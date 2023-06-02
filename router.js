/**
 * Se declaran las constantes de las dependencias de node y de los controladores
 * Las constantes se escriben en mayusculas y en casa de ser dos palabras se utiliza el guion bajo (_) como separado
 */
const EXPRESS = require('express') 
const ROUTER = EXPRESS.Router()
const RENDER = require('./services/render')
const USERS = require('./api/users')
const IMAGES = require('./api/images')
const CATEGORIES = require('./api/categories')
const ORDERS = require('./api/orders')
const DETAILS = require('./api/details')
const PRODUCTS = require('./api/products')


/**
 * Se ocupa el metodo get para que al momento de que se envie a 
 * la direccion con una '/' ocupe el service para renderizar 
 * la informacion
 */
ROUTER.get('/', RENDER.index)
ROUTER.get('/account', RENDER.newAccount)
ROUTER.get('/products', RENDER.products)
ROUTER.get('/categories', RENDER.categories)

//API images

ROUTER.post('/api/images', IMAGES.saveImages)
ROUTER.get('/api/images', IMAGES.getImages)

//API users
ROUTER.post('/api/users', USERS.createUser)
ROUTER.post('/logIn/users', USERS.logIn)
ROUTER.get('/logOut/users', USERS.logOut)


//API orders
ROUTER.post('/api/orders', ORDERS.createOrder)

//API details
ROUTER.post('/api/details', DETAILS.createDetail)
ROUTER.get('/delete/details/:key/:stock/:id', DETAILS.cancelDetail)

//API products
ROUTER.post('/api/products', PRODUCTS.CreateProduct )
ROUTER.post('/api/categories', CATEGORIES.createCategorie)


/**
 * Exportamos el router para que puedo ser accesido por el servidor
 */
module.exports = ROUTER