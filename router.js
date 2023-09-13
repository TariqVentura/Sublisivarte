require('dotenv').config()

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
const RECORD = require('./api/record')
const EMAIL = require('./api/email')
const JWT = require('jsonwebtoken')

//funcion para validar el token de sesion
function tokenValidation (req, res, next) {
    //obtenemos el token
    const TOKEN = req.header('Authorization')

    //sino hay token enviamos error
    if (!TOKEN) {
        return res.status(401).json({ mensaje: 'Acceso no autorizado' })
    }

    //verificamos el token usando la variable de entorno
    JWT.verify(TOKEN.replace('Bearer ', ''), process.env.TOKEN, (err, decoded) => {
        if (err) {
            return res.status(401).json({ mensaje: 'Token Invalido' })
        } else {
            //guardamos los datos del token para poder usarlos despues
            req.usuario = decoded
            //le decimos que contiue con el codigo
            next()
        }
    })
}

/**
 * Se ocupa el metodo get para que al momento de que se envie a 
 * la direccion con una '/' ocupe el service para renderizar 
 * la informacion
 */
ROUTER.get('/', RENDER.index)
ROUTER.get('/error404', RENDER.error)
ROUTER.get('/account', RENDER.newAccount)
ROUTER.get('/products', RENDER.products)
ROUTER.get('/categories', RENDER.categories)
ROUTER.get('/carrito', RENDER.carrito)
ROUTER.get('/cuenta', RENDER.cuenta)
ROUTER.get('/usuarios', RENDER.usuarios)
ROUTER.get('/carrito/:id/:status', RENDER.details1)
ROUTER.get('/producto/:id', RENDER.producto)
ROUTER.get('/administracion', RENDER.administracion)
ROUTER.get('/categorias', RENDER.categorias)
ROUTER.get('/comentarios', RENDER.comments)
ROUTER.get('/products/:key', RENDER.searchProduct)
ROUTER.get('/comments/:key', RENDER.searchComments)
ROUTER.get('/users/:key', RENDER.searchUser)
ROUTER.get('/productos/:key', RENDER.viewProducts)
ROUTER.get('/views/products', RENDER.allProducts)
ROUTER.get('/views/products/:key', RENDER.newViewProducts)
ROUTER.get('/categories/:key', RENDER.searchCategorie)
ROUTER.get('/pedidos', RENDER.orders)
ROUTER.get('/views/pedidos/:key', RENDER.ordersSearch)
ROUTER.get('/pedidos/detalles/:id', RENDER.details)

//API images
ROUTER.post('/api/images', IMAGES.saveImages)
ROUTER.get('/api/images', IMAGES.getImages)

//API users
ROUTER.post('/api/users', USERS.createUser)
ROUTER.get('/api/users', tokenValidation, USERS.findUsers)
ROUTER.post('/update/users', USERS.updateUsers)
ROUTER.get('/delete/users/:user', USERS.deleteUsers)
ROUTER.post('/logIn/users', USERS.logIn)
ROUTER.get('/logOut/users', USERS.logOut)
ROUTER.get('/api/users/:key', tokenValidation, USERS.searchUsers)
ROUTER.post('/api/newPassword/', USERS.newPassword)
ROUTER.get('/bann/users/:id', USERS.bannUser)
ROUTER.get('/status/user/:id', USERS.statusUser)
ROUTER.get('/api/get/users/:key', tokenValidation, USERS.getUser)
// ROUTER.post('/api/modifyUser', USERS.modifyUser)
ROUTER.get('/report/user/:key', USERS.getUserReport)
ROUTER.get('/api/count/users', USERS.countUsers)
ROUTER.get('/api/authentification/:id/:authentification', tokenValidation, USERS.userAuthentification)

//API comments
ROUTER.post('/api/comments', tokenValidation, COMMENTS.createComment)
ROUTER.get('/api/comments', COMMENTS.findComments)
ROUTER.get('/delete/comments/:id', tokenValidation, COMMENTS.deleteComments)
ROUTER.get('/api/comments/:key', COMMENTS.serchComments)
ROUTER.get('/api/count/comments/:key', COMMENTS.countCommentsProduct)

//API orders
ROUTER.post('/api/orders', tokenValidation, ORDERS.createOrder)
ROUTER.get('/finish/orders/:id', ORDERS.finishOrder)
ROUTER.get('/api/orders/:key', tokenValidation, ORDERS.getOrders)
ROUTER.get('/api/orders', tokenValidation, ORDERS.getOrders)
ROUTER.get('/cancel/orders/:id', ORDERS.cancelOrder)
ROUTER.get('/report/invoice/:key', ORDERS.getInvoice)
ROUTER.get('/report/orders', ORDERS.reportOrders)
ROUTER.get('report/detail/:key', ORDERS.getReportDetail)
ROUTER.get('/api/count/date/:key', ORDERS.dateOrders)
ROUTER.get('/api/count/orders', ORDERS.countOrders)
ROUTER.get('/api/count/orders/:key', ORDERS.countOrdersClient)
ROUTER.get('/api/count/ordersMonth/:key', ORDERS.countOrdersDate)


//API details
ROUTER.post('/api/details', tokenValidation, DETAILS.createDetail)
ROUTER.get('/delete/details/:key/:stock/:id', tokenValidation, DETAILS.cancelDetail)
ROUTER.get('/api/details/:id', DETAILS.getDetails)
ROUTER.get('/report/detail/:key/:client', DETAILS.getReportDetail)

//API products
ROUTER.post('/api/products', PRODUCTS.createProduct)
ROUTER.get('/api/products', PRODUCTS.findProduct)
ROUTER.get('/api/products/:id', PRODUCTS.findProduct)
ROUTER.post('/update/products/', PRODUCTS.updateProduct)
ROUTER.get('/delete/products/:id', PRODUCTS.deleteProducts)
ROUTER.get('/api/view/products/:key', PRODUCTS.searchProduct)
ROUTER.get('/categorie/api/products/:key', PRODUCTS.categorieProduct)
ROUTER.get('/api/count/products', PRODUCTS.countProducts)
ROUTER.get('/report/stock/:key', PRODUCTS.getStockReport)
ROUTER.get('/report/products', PRODUCTS.reportProducts)
ROUTER.get('/api/count/stock', PRODUCTS.countStockProducts)
ROUTER.get('/categorieTop/api/products/:key', PRODUCTS.countPriceProducts)


//API categories
ROUTER.post('/api/categories', tokenValidation, CATEGORIES.createCategorie)
ROUTER.get('/api/categories', CATEGORIES.findCategorie)
ROUTER.get('/delete/categorie/:key', tokenValidation, CATEGORIES.deleteCategorie)
ROUTER.get('/status/categorie/:id/:status', tokenValidation, CATEGORIES.categorieStatus)
ROUTER.get('/api/categories/:key', CATEGORIES.searchCategories)
ROUTER.get('/report/categories/:key', CATEGORIES.getReport)

//API record
ROUTER.post('/api/record', RECORD.newRecord)
ROUTER.get('/api/record/:key', RECORD.getRecord)

//API email
ROUTER.post('/email/password', EMAIL.newPasswordEmail)

/**
 * Exportamos el router para que puedo ser accesido por el servidor
 */
module.exports = ROUTER