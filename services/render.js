const AXIOS = require('axios')
let session, token

exports.error = (req, res) => {
    AXIOS.get('http://localhost:443/api/images')
        .then(function (images) {
            res.render('include/error', { user: false, resources: images.data, mensaje: ". ", confirmation: false, icon: " ." })
        })
}

exports.index = (req, res) => {
    if (req.session.user) {
        session = req.session
    } else {
        session = false
    }
    AXIOS.get('http://localhost:443/api/images')
        .then(function (images) {
            res.render('index', { user: session, resources: images.data, mensaje: ". ", confirmation: false, icon: " ." })
        })
}

exports.newAccount = (req, res) => {
    res.render('account', { user: false })
}

exports.products = (req, res) => {
    if (req.session.user) {
        session = req.session
    } else {
        session = false
    }
    AXIOS.get('http://localhost:443/api/products')
        .then(function (response) {
            AXIOS.get('http://localhost:443/api/categories')
                .then(function (categorie) {
                    res.render('productos', { products: response.data, categories: categorie.data, user: session, mensaje: ". ", confirmation: false, icon: " ." })
                })
                .catch(err => {
                    res.send('hola')
                })
        })
        .catch(err => {
            res.send('No se puedieron cargar los productos')
        })
}

exports.producto = (req, res) => {
    if (req.session.user) {
        session = req.session
        AXIOS.get('http://localhost:443/api/products/' + req.params.id)
            .then(function (product) {
                AXIOS.get('http://localhost:443/api/orders/' + req.session.user)
                    .then(function (order) {
                        console.log(order.data)
                        res.render('producto', { products: product.data, user: session, orders: order.data })
                    })
            })
            .catch(err => {
                res.send(err)
            })
    } else {
        session = false
        AXIOS.get('http://localhost:443/api/products/' + req.params.id)
            .then(function (product) {
                res.render('producto', { products: product.data, user: session, orders: null })
            })
            .catch(err => {
                res.send(err)
            })
    }

}

exports.categories = (req, res) => {
    if (req.session.user) {
        session = req.session
    } else {
        session = false
    }
    AXIOS.get('http://localhost:443/api/categories')
        .then(function (categorie) {
            res.render('categories', { categorie: categorie.data, user: session })
        })

}

exports.carrito = (req, res) => {
    if (req.session.user) {
        session = req.session
        AXIOS.get('http://localhost:443/api/orders/' + req.session.user)
            .then(function (order) {
                res.render('carrito', { user: session, orders: order.data })
            })
    } else {
        session = false
        res.render('carrito', { user: session })
    }
}

exports.details1 = (req, res) => {
    if (req.session.user) {
        session = req.session
        AXIOS.get('http://localhost:443/api/details/' + req.params.id)
            .then(function (detail) {
                console.log(req.params.status)
                res.render('detalles', { user: session, details: detail.data, status: req.params.status, order: req.params.id })
            })
    } else {
        session = false
        res.render('detalles', { user: session })
    }
}

exports.cuenta = (req, res) => {
    if (req.session.user) {
        session = req.session
    } else {
        session = false
    }
    AXIOS.get('http://localhost:443/api/get/users/' + req.session.user)
        .then(function (info) {
            console.log(info.data)
            res.render('cuenta', { user: session, data: info.data })
        })
}

exports.usuarios = (req, res) => {
    if (req.session.token) {
        token = req.session.token
    } else {
        token = null
    }
    
    const CONFIG = {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }

    AXIOS.get('http://localhost:443/api/users', CONFIG)
        .then(function (response) {
            if (response.data == false) {
                res.redirect('/error404')
            } else {
                res.render('usuarios', { users: response.data, user: req.session, mensaje: ". ", confirmation: false, icon: " ." })
            }
        })
        .catch(err => {
            res.send('No se pudieron cargar los usuarios')
        })
}

exports.administracion = (req, res) => {
    if (req.session.user) {
        session = req.session
    } else {
        session = false
    }
    res.render('administracion', { user: session })
}

exports.categorias = (req, res) => {
    if (req.session.user) {
        session = req.session
    } else {
        session = false
    }
    AXIOS.get('http://localhost:443/api/categories')
        .then(function (categorie) {
            res.render('categorias', { categories: categorie.data, user: session, mensaje: ". ", confirmation: false, icon: " ." })
        })
        .catch(err => {
            res.send('No se puede acceder a las categorias')
        })
}

exports.comments = (req, res) => {
    if (req.session.user) {
        session = req.session
    } else {
        session = false
    }
    AXIOS.get('http://localhost:443/api/comments')
        .then(function (comments) {
            AXIOS.get('http://localhost:443/api/products')
                .then(function (product) {
                    res.render('comentarios', { comments: comments.data, products: product.data, user: session, mensaje: ". ", confirmation: false, icon: " ." })
                })
        })
        .catch(err => {
            res.send('No se puede acceder a  los comentarios')
        })
    // res.render('comentarios', {user: session})
}

exports.searchComments = (req, res) => {
    if (req.session.user) {
        session = req.session
    } else {
        session = false
    }
    AXIOS.get('http://localhost:443/api/comments' + '/' + req.params.key)
        .then(function (comments) {
            AXIOS.get('http://localhost:443/api/products')
                .then(function (product) {
                    console.log(comments.data)
                    res.render('comentarios', { comments: comments.data, products: product.data, user: session, mensaje: ". ", confirmation: false, icon: " ." })
                })
        })
}

exports.searchUser = (req, res) => {
    if (req.session.user) {
        session = req.session
    } else {
        session = false
    }
    AXIOS.get('http://localhost:443/api/users' + '/' + req.params.key)
        .then(function (user) {
            res.render('usuarios', { users: user.data, user: session, mensaje: ". ", confirmation: false, icon: " ." })
        })
}

exports.searchProduct = (req, res) => {
    if (req.session.user) {
        session = req.session
    } else {
        session = false
    }
    AXIOS.get('http://localhost:443/api/view/products/' + req.params.key)
        .then(function (response) {
            AXIOS.get('http://localhost:443/api/categories')
                .then(function (categorie) {
                    res.render('productos', { products: response.data, categories: categorie.data, user: session, mensaje: ". ", confirmation: false, icon: " ." })
                })
                .catch(err => {
                    res.send('hola')
                })
        })
        .catch(err => {
            res.send('No se puedieron cargar los productos')
        })
}

exports.viewProducts = (req, res) => {
    if (req.session.user) {
        session = req.session
    } else {
        session = false
    }
    AXIOS.get('http://localhost:443/categorie/api/products/' + req.params.key)
        .then(function (products) {
            res.render('viewPorducts', { user: session, products: products.data, mensaje: ". ", confirmation: false, icon: " ." })
        })
}

exports.newViewProducts = (req, res) => {
    if (req.session.user) {
        session = req.session
    } else {
        session = false
    }
    AXIOS.get('http://localhost:443/api/view/products/' + req.params.key)
        .then(function (products) {
            res.render('viewPorducts', { user: session, products: products.data, mensaje: ". ", confirmation: false, icon: " ." })
        })
}

exports.allProducts = (req, res) => {
    if (req.session.user) {
        session = req.session
    } else {
        session = false
    }
    AXIOS.get('http://localhost:443/api/products')
        .then(function (products) {
            res.render('viewPorducts', { user: session, products: products.data, mensaje: ". ", confirmation: false, icon: " ." })
        })
}

exports.searchCategorie = (req, res) => {
    if (req.session.user) {
        session = req.session
    } else {
        session = false
    }
    AXIOS.get('http://localhost:443/api/categories' + '/' + req.params.key)
        .then(function (categorie) {
            res.render('categorias', { categories: categorie.data, user: session, mensaje: ". ", confirmation: false, icon: " ." })
        })
        .catch(err => {
            res.send('No se pudieron cargar las Categorias')
        })
}

exports.orders = (req, res) => {
    if (req.session.token) {
        token = req.session.token
    } else {
        token = null
    }
    
    const CONFIG = {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }
    AXIOS.get('http://localhost:443/api/orders', CONFIG)
        .then(function (orders) {
            res.render('orders', { orders: orders.data, user: req.session, mensaje: ". ", confirmation: false, icon: " ." })
        })
        .catch(err => {
            res.send('No se pudieron cargar las Categorias')
        })
}

exports.details = (req, res) => {
    if (req.session.user) {
        session = req.session
    } else {
        session = false
    }
    AXIOS.get('http://localhost:443/api/details/' + req.params.id)
        .then(function (details) {
            res.render('details', { details: details.data, user: session, mensaje: ". ", confirmation: false, icon: " ." })
        })
        .catch(err => {
            res.send('No se pudieron cargar las Categorias')
        })
}

exports.ordersSearch = (req, res) => {
    if (req.session.user) {
        session = req.session
    } else {
        session = false
    }
    AXIOS.get('http://localhost:443/api/orders/' + req.params.key)
        .then(function (orders) {
            res.render('orders', { orders: orders.data, user: session, mensaje: ". ", confirmation: false, icon: " ." })
        })
        .catch(err => {
            res.send('No se pudieron cargar las Categorias')
        })
}