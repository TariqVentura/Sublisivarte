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
const COMMENTS = require('./api/comments')

/**
 * Se ocupa el metodo get para que al momento de que se envie a 
 * la direccion con una '/' ocupe el service para renderizar 
 * la informacion
 */
ROUTER.get('/', RENDER.index)
ROUTER.get('/account', RENDER.newAccount)
ROUTER.get('/products', RENDER.products)
ROUTER.get('/categories', RENDER.categories)
ROUTER.get('/carrito', RENDER.carrito)
ROUTER.get('/cuenta', RENDER.cuenta)
ROUTER.get('/usuarios', RENDER.usuarios) 
ROUTER.get('/carrito/:id/:status', RENDER.details)
ROUTER.get('/producto/:id', RENDER.producto)
ROUTER.get('/administracion', RENDER.administracion)
ROUTER.get('/categorias', RENDER.categorias)
ROUTER.get('/comentarios', RENDER.comments )

//API images
ROUTER.post('/api/images', IMAGES.saveImages)
ROUTER.get('/api/images', IMAGES.getImages)

//API users
ROUTER.post('/api/users', USERS.createUser)
ROUTER.get('/api/users', USERS.findUsers)
ROUTER.post('/update/users', USERS.updateUsers)
ROUTER.get('/delete/users/:user',USERS.deleteUsers)
ROUTER.post('/logIn/users', USERS.logIn)
ROUTER.get('/logOut/users', USERS.logOut)

//API comments
ROUTER.post('/api/comments', COMMENTS.createComment)
ROUTER.get('/api/comments', COMMENTS.findComments)
ROUTER.get('/delete/comments/:id', COMMENTS.deleteComments)
ROUTER.get('/api/comments/:key', COMMENTS.serchComments)

//API orders
ROUTER.post('/api/orders', ORDERS.createOrder)
ROUTER.get('/finish/orders/:id', ORDERS.finishOrder)
ROUTER.get('/api/orders/:key', ORDERS.getOrders)

//API details
ROUTER.post('/api/details', DETAILS.createDetail)
ROUTER.get('/delete/details/:key/:stock/:id', DETAILS.cancelDetail)
ROUTER.get('/api/details/:id', DETAILS.getDetails)

//API products
ROUTER.post('/api/products', PRODUCTS.createProduct )
ROUTER.get('/api/products', PRODUCTS.findProduct )
ROUTER.get('/api/products/:id', PRODUCTS.findProduct )
ROUTER.post('/update/products/', PRODUCTS.updateProduct)
ROUTER.get('/delete/products/:id', PRODUCTS.deleteProducts)

//API categories
ROUTER.post('/api/categories', CATEGORIES.createCategorie)
ROUTER.get('/api/categories', CATEGORIES.findCategorie)
ROUTER.post('/update/categories' , CATEGORIES.updateCategorie)
ROUTER.get('/delete/categorie/:key', CATEGORIES.deleteCategorie)
ROUTER.get('/status/categorie/:id/:status', CATEGORIES.categorieStatus)

/**
 * Exportamos el router para que puedo ser accesido por el servidor
 */
module.exports = ROUTER