const AXIOS = require('axios')
const USER = require('../models/users')
let session, token, count = 1

exports.error = (req, res) => {
    AXIOS.get('http://localhost:443/api/images')
        .then(function (images) {
            res.render('include/error', { user: false, resources: images.data, mensaje: ". ", confirmation: false, icon: " .", count: count })
        }).catch(err => {
            res.send('pagina no encontrada')
        })
}

exports.index = async (req, res) => {
    if (req.session.user) {
        session = req.session
    } else {
        session = false
    }
    

    const COUNT = await USER.count().exec()

    if (COUNT > 0) {
        count = COUNT
    } else {
        count = 0
    }

    AXIOS.get('http://localhost:443/api/images')
        .then(function (images) {
            res.render('index', { user: session, resources: images.data, mensaje: ". ", confirmation: false, icon: " .", count: count})
        }).catch(err => {
            res.send('pagina no encontrada')
        })
}

exports.newAccount = (req, res) => {
    res.render('account', { user: false, count: count})
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
                    res.render('productos', { products: response.data, categories: categorie.data, user: session, mensaje: ". ", confirmation: false, icon: " .", count: count })
                })
                .catch(err => {
                    res.send('hola')
                })
        }).catch(err => {
            res.send('pagina no encontrada')
        })
}

exports.producto = (req, res) => {
    if (req.session.user && req.session.token) {
        session = req.session
        token = req.session.token
        const CONFIG = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
        AXIOS.get('http://localhost:443/api/products/' + req.params.id)
            .then(function (product) {
                AXIOS.get('http://localhost:443/api/orders/' + req.session.user, CONFIG)
                    .then(function (order) {
                        res.render('producto', { products: product.data, user: session, orders: order.data, count: count })
                    })
            })
            .catch(err => {
                res.send('pagina no encontrada')
            })
    } else {
        session = false
        AXIOS.get('http://localhost:443/api/products/' + req.params.id)
            .then(function (product) {
                res.render('producto', { products: product.data, user: session, orders: null, count: count })
            })
            .catch(err => {
                res.send('pagina no encontrada')
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
            res.render('categories', { categorie: categorie.data, user: session, count: count })
        }.catch(err => {
            res.send('pagina no encontrada')
        }))

}

exports.carrito = (req, res) => {
    if (req.session.token) {
        token = req.session.token
    } else {
        res.redirect('/error404')
        return
    }

    const CONFIG = {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }
    if (req.session.user) {
        session = req.session
        AXIOS.get('http://localhost:443/api/orders/' + req.session.user, CONFIG)
            .then(function (order) {
                res.render('carrito', { user: session, orders: order.data, count: count })
            }).catch(err => {
                res.send('pagina no encontrada')
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
                res.render('detalles', { user: session, details: detail.data, status: req.params.status, order: req.params.id, count: count })
            }).catch(err => {
                res.send('pagina no encontrada')
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

    if (req.session.token) {
        token = req.session.token
    } else {
        res.redirect('/error404')
        return
    }

    const CONFIG = {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }

    AXIOS.get('http://localhost:443/api/get/users/' + req.session.user, CONFIG).then((info) => {
        res.render('cuenta', { user: session, data: info.data, count: count })
    })
}

exports.usuarios = (req, res) => {
    if (req.session.token) {
        token = req.session.token
    } else {
        res.redirect('/error404')
        return
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
                res.render('usuarios', { users: response.data, user: req.session, mensaje: ". ", confirmation: false, icon: " .", count: count })
            }
        })
        .catch(err => {
            res.send('Pagina no encontrada')
        })
}

exports.administracion = (req, res) => {
    if (req.session.user) {
        session = req.session
    } else {
        session = false
    }
    res.render('administracion', { user: session, count: count })
}

exports.categorias = (req, res) => {
    if (req.session.user) {
        session = req.session
    } else {
        session = false
    }
    AXIOS.get('http://localhost:443/api/categories')
        .then(function (categorie) {
            res.render('categorias', { categories: categorie.data, user: session, mensaje: ". ", confirmation: false, icon: " .", count: count })
        })
        .catch(err => {
            res.send('Pagina no encontrada')
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
                    res.render('comentarios', { comments: comments.data, products: product.data, user: session, mensaje: ". ", confirmation: false, icon: " .", count: count })
                })
        })
        .catch(err => {
            res.send('pagina no encontrada')
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
                    res.render('comentarios', { comments: comments.data, products: product.data, user: session, mensaje: ". ", confirmation: false, icon: " .", count: count })
                }).catch(err => {
                    res.send('pagina no encontrada')
                })
        }).catch(err => {
            res.send('pagina no encontrada')
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
            res.render('usuarios', { users: user.data, user: session, mensaje: ". ", confirmation: false, icon: " .", count: count })
        }).catch(err => {
            res.send('pagina no encontrada')
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
                    res.render('productos', { products: response.data, categories: categorie.data, user: session, mensaje: ". ", confirmation: false, icon: " .", count: count })
                })
                .catch(err => {
                    res.send('error de conexion')
                })
        })
        .catch(err => {
            res.send('pagina no encontrada')
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
            res.render('viewPorducts', { user: session, products: products.data, mensaje: ". ", confirmation: false, icon: " .", count: count })
        }).catch(err => {
            res.send('pagina no encontrada')
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
            res.render('viewPorducts', { user: session, products: products.data, mensaje: ". ", confirmation: false, icon: " .", count: count })
        }).catch(err => {
            res.send('pagina no encontrada')
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
            res.render('viewPorducts', { user: session, products: products.data, mensaje: ". ", confirmation: false, icon: " .", count: count })
        }).catch(err => {
            res.send('pagina no encontrada')
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
            res.render('categorias', { categories: categorie.data, user: session, mensaje: ". ", confirmation: false, icon: " .", count: count })
        })
        .catch(err => {
            res.send('pagina no encontrada')
        })
}

exports.orders = (req, res) => {
    if (req.session.token) {
        token = req.session.token
    } else {
        res.redirect('/error404')
        return
    }

    const CONFIG = {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }
    AXIOS.get('http://localhost:443/api/orders', CONFIG)
        .then(function (orders) {
            res.render('orders', { orders: orders.data, user: req.session, mensaje: ". ", confirmation: false, icon: " .", count: count })
        })
        .catch(err => {
            res.send('pagina no encontrada')
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
            res.render('details', { details: details.data, user: session, mensaje: ". ", confirmation: false, icon: " .", count: count })
        }).catch(err => {
            res.send('pagina no encontrada')
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
            res.render('orders', { orders: orders.data, user: session, mensaje: ". ", confirmation: false, icon: " .", count: count })
        }).catch(err => {
            res.send('pagina no encontrada')
        })
}